import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import { usePostStore, useUserStore } from '../../store';

export const Comment = ({ value }) => {
  const { usersData } = useUserStore();
  const { posts } = usePostStore();

  posts.map((post, index) => console.log(post.owner._id === usersData._id));

  const profilePicUrl = value?.user?.profilePic?.url || value?.profilePic;
  const userName = value?.user?.name || value?.name;
  const userId = value?.user?._id || '';

  return (
    <div className='flex items-start space-x-4 mt-3 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      <Link to={`/user/${userId}`}>
        <img
          src={profilePicUrl}
          alt={`${userName}'s profile`}
          className='w-12 h-12 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-transform duration-200'
        />
      </Link>

      <div className='flex-1'>
        <Link
          to={`/user/${userId}`}
          className='text-gray-900 font-medium text-sm hover:underline'>
          {userName}
        </Link>

        <p className='text-gray-700 text-sm mt-1'>{value.comment}</p>
      </div>
      {value.user._id === usersData._id ? (
        <button
          className='text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors duration-150'
          aria-label='Delete comment'
          title='Delete comment'>
          <AiFillDelete size={20} />
        </button>
      ) : (
        ''
      )}
    </div>
  );
};
