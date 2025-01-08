import { Link } from 'react-router-dom';
export const Comment = ({ value }) => {
  const profilePicUrl = value?.user?.profilePic?.url || value?.profilePic;
  const userName = value?.user?.name || value?.name;

  return (
    <div className='flex items-center space-x-2 mt-2 mb-4'>
      <Link to={`/user/${value.user._id}`}>
        <img src={profilePicUrl} alt='User' className='w-8 h-8 rounded-full' />
      </Link>
      <div>
        <p className='text-gray-800 font-semibold'>{userName}</p>
        <p className='text-gray-500 text-sm'>{value.comment}</p>
      </div>
    </div>
  );
};
