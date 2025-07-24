import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { FaUserCircle, FaUserFriends } from 'react-icons/fa';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useChatStore } from '../../../../../../store';
import moment from 'moment';

const ContactList = ({ contacts = [], isgroup = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
    onlineStatuses,
  } = useChatStore();

  const handleClick = (contact) => {
    if (isgroup) setSelectedChatType('group');
    else setSelectedChatType('contact');
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const now = moment();
    const messageDate = moment(timestamp);

    if (now.isSame(messageDate, 'day')) {
      return messageDate.format('hh:mm A');
    } else if (now.subtract(1, 'day').isSame(messageDate, 'day')) {
      return 'Yesterday';
    } else {
      return messageDate.format('DD-MM-YY');
    }
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (a.lastMessageTime && b.lastMessageTime) {
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    }
    return 0;
  });
  return (
    <div className='mt-4 space-y-1'>
      {sortedContacts.length > 0 ? (
        sortedContacts.map((contact) => (
          <ContextMenu key={contact._id}>
            <ContextMenuTrigger
              className={`flex items-center space-x-4 px-4  rounded-lg shadow-lg transition-transform transform hover:scale-[1.02]  cursor-pointer ${
                selectedChatData && selectedChatData._id === contact._id
                  ? 'bg-[#0abde355] hover:bg-[#0abde344]'
                  : 'bg-[#2f303b] hover:bg-[#393a48]'
              } `}
              onClick={() => handleClick(contact)}>
              <div className='flex items-center w-full '>
                <div className='relative'>
                  {!isgroup ? (
                    <Avatar className='w-16 h-16 rounded-full overflow-hidden flex items-center'>
                      {contact.profilePic.url? (
                        <AvatarImage
                          src={`${contact.profilePic.url}`}
                          alt='profile'
                          className='object-cover w-12 h-12 rounded-full bg-black'
                        />
                      ) : (
                        <div className={` w-12 h-12`}>
                          <FaUserCircle
                            className={`bg-red h-full w-full rounded-full`}
                          />
                        </div>
                      )}
                      {/* {onlineStatuses[contact._id] === true && (
                        <span className='absolute top-4 left-[41px] inline-block w-2 h-2 bg-green-500 rounded-full border-green-400'></span>
                      )} */}
                    </Avatar>
                  ) : (
                    <Avatar className='w-16 h-16 rounded-full overflow-hidden flex items-center'>
                      <div className={` w-12 h-12`}>
                        <FaUserFriends
                          className={`h-12 w-12 rounded-full bg-[#aaa6d0] text-black/50 border-[1px] border-[#bbb7e4]`}
                        />
                      </div>
                    </Avatar>
                  )}
                </div>
                <div
                  className={`flex flex-col  w-full  transition-transform transform  rounded-lg cursor-pointer`}>
                  <div className='flex  mr-1'>
                    <div className='flex-1'>
                      <span className='text-[13px] font-medium font-serif text-[#e0e0e0] line-clamp-1 '>
                        {isgroup ? contact.name : contact.name || contact.email}
                      </span>
                    </div>
                    {contact.lastMessageTime && (
                      <div className='text-[11px] text-gray-400'>
                        {formatLastMessageTime(contact.lastMessageTime)}
                      </div>
                    )}
                  </div>

                  {contact.messageType === 'text' && (
                    <span className=' text-[12px] line-clamp-1'>
                      {contact.lastMessage || ''}
                    </span>
                  )}
                </div>
              </div>
            </ContextMenuTrigger>
          
          </ContextMenu>
        ))
      ) : (
        <p className='text-center text-gray-500'>
          {isgroup ? 'No Groups' : 'No contacts available'}
        </p>
      )}
    </div>
  );
};

export default ContactList;
