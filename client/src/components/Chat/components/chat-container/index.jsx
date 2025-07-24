import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar"


const ChatContainer = () => {
  return (
    <div className=' h-[90vh] w-[100vw] bg-[#1c1d29] flex flex-col md:static md:flex-1'>
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};


export default ChatContainer;
