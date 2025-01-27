import { useNavigate, useParams } from 'react-router-dom';
import { usePostStore, useUserStore } from '../../store';
import { useState, useEffect, useRef } from 'react';

const Modal = ({ value, title, setShow }) => {
  const navigate = useNavigate();
  const { usersData } = useUserStore();
  const modalRef = useRef(null);
  const { setTab } = usePostStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredValue = value?.filter(
    (elem) =>
      elem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShow(false);
    }
  };
  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]'
      onClick={handleOutsideClick}>
      <div
        className='bg-white rounded-lg w-[500px] max-h-[500px] shadow-xl overflow-hidden'
        ref={modalRef}>
        <div className='sticky top-0 z-20 bg-white p-4 border-b'>
          <div className='flex justify-between items-center'>
            <h1 className='text-xl font-semibold text-gray-800'>{title}</h1>
            <button
              onClick={() => setShow(false)}
              className='text-gray-500 text-2xl hover:text-red-500 focus:outline-none'
              title='Close'>
              &times;
            </button>
          </div>

          <div className='mt-3'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300'
            />
          </div>
        </div>

        <div className='p-4 overflow-y-auto max-h-[400px]'>
          {filteredValue && filteredValue.length > 0 ? (
            <ul className='space-y-4'>
              {filteredValue.map((elem, index) => (
                <li key={index} className='flex items-center space-x-4'>
                  <button
                    onClick={() => {
                      navigate(`${`/user/${elem._id}`}`);
                      setShow(false);
                      usersData._id === elem._id
                        ? setTab('/account')
                        : setTab(`user/${elem._id}`);
                    }}
                    className='flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition'>
                    <img
                      src={elem.profilePic.url}
                      alt={elem.name}
                      className='w-10 h-10 rounded-full object-cover shadow-sm'
                    />
                    <div>
                      <p className='text-gray-800 font-medium text-left'>
                        {elem.name}
                      </p>
                      <p className='text-sm text-gray-500 text-left'>
                        {elem.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 text-center'>
              No {title.toLowerCase()} available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
