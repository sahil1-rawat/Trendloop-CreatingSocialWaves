import { useNavigate, useParams } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';
import { fetchUsers } from '../utills/FetchPost';

const Modal = ({ value, title, setShow }) => {
  const navigate = useNavigate();
  const { usersData } = useUserStore();
  const { setUser } = usePostStore();
  const params = useParams();
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-xl w-[350px] max-h-[500px] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold text-gray-800'>{title}</h1>
          <button
            onClick={() => setShow(false)}
            className='text-gray-500 text-3xl hover:text-red-500 focus:outline-none'>
            &times;
          </button>
        </div>

        {value && value.length > 0 ? (
          <ul className='space-y-4'>
            {value.map((elem, index) => (
              <li key={index} className='flex items-center space-x-4'>
                <button
                  onClick={() => {
                    navigate(
                      `${
                        usersData._id === elem._id
                          ? '/account'
                          : `/user/${elem._id}`
                      }`
                    );
                    setShow(false);
                  }}
                  className='flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition'>
                  <img
                    src={elem.profilePic.url}
                    alt={elem.name}
                    className='w-10 h-10 rounded-full object-cover shadow-sm'
                  />
                  <div>
                    <p className='text-gray-800 font-medium'>{elem.name}</p>
                    <p className='text-sm text-gray-500 text-left'>
                      View Profile
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500 text-center'>No {title} available.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
