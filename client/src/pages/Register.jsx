import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { usePostStore, useUserStore } from '../../store';
import Loading, { LoadingAnimation } from '../components/Loading';

import { FaEdit, FaPen } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { BASE_URL } from '../../common';
import { Loader, Loader2Icon } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
    const [isClicked, setIsClicked] = useState(false);
  
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [file, setFile] = useState('');
  const [filePrev, setFilePrev] = useState('');
  const { setIsLoading, isLoading, setUsersData, setIsAuth } = useUserStore();
  const { setPosts, setReels } = usePostStore();
  const navigate = useNavigate();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('gender', gender);
  formData.append('file', file);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClicked(true);
    try {

      const res=await axios.post(`${import.meta.env.VITE_SOCKET_URL}/api/auth/register`,formData,{withCredentials:true})
//console.log(res.status);

      //console.log(res.data);
      if (res.status === 201) {
        navigate('/');
        setIsAuth(true);
        setUsersData(res.data.user);

        toast.dismiss();
        toast.success(res.data.message);
      } else {
        toast.dismiss();
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to Register");
    }
    finally{
      setIsClicked(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center'>
          <div className='bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row'>
            <div className='hidden md:flex w-1/2 bg-gradient-to-b from-blue-400 to-indigo-500 flex-col items-center justify-center text-white p-8'>
              <h1 className='text-4xl font-bold mb-4'>Already a Member?</h1>
              <p className='text-center mb-8'>
                If you already have an account, log in to access your profile
                and explore more features!
              </p>
              <Link
                to='/login'
                className='bg-white text-indigo-500 px-16 py-3 rounded-full font-semibold hover:bg-gray-100 transition'>
                Login
              </Link>
            </div>

            <div className='w-full md:w-1/2 bg-white p-8 md:p-10'>
              <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                Register on <span className='text-purple-600'>Trendloop</span>
              </h1>
              <p className='text-gray-600 mt-4 mb-3 flex justify-center'>
                <img
                  src='https://readme-typing-svg.herokuapp.com/?lines=Stay+in+touch+with+the+future.;Always+on,+always+connected;A+new+way+to+stay+connected.&color=800080'
                  className='mx-auto'
                />
              </p>

              <form onSubmit={handleSubmit} className='mt-6'>
                <div className='space-y-5'>
                  <div>
                    {filePrev ? (
                      <div className='flex justify-center mb-4'>
                        <img
                          src={filePrev}
                          alt='profile'
                          className='w-28 h-28 rounded-full border-4 border-black/45 shadow-lg cursor-pointer'
                          onClick={() =>
                            document.getElementById('profile-pic').click()
                          }
                        />
                      </div>
                    ) : (
                      <div className='flex justify-center mb-4'>
                        <div
                          className='w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-black cursor-pointer'
                          onClick={() =>
                            document.getElementById('profile-pic').click()
                          }
                          title='Profile Pic'>
                          <span className='text-center'>
                            <FiEdit2 size={15} />
                          </span>
                        </div>
                      </div>
                    )}

                    <input
                      type='file'
                      className='hidden'
                      id='profile-pic'
                      onChange={changeFileHandler}
                      accept='image/*'
                    />
                  </div>

                  <div>
                    <input
                      type='text'
                      className='custom-input'
                      placeholder='User Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type='email'
                      className='custom-input'
                      placeholder='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type='password'
                      className='custom-input'
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <select
                      className='custom-input'
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required>
                      <option value=''>Select Gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </select>
                  </div>
                  <div className='text-center mt-6'>
                    <button type='submit' className='auth-btn w-full'>
                      {isClicked?<div><LoadingAnimation/></div>: "Register"}
                    </button>
                  </div>
                </div>
              </form>
              <div className='md:hidden mt-8 px-6 text-center space-y-4'>
                <h2 className='text-lg font-semibold text-gray-800 mb-8'>
                  Already have an account?
                  <Link
                    to='/login'
                    className='bg-white text-indigo-500 px-6  rounded-full font-semibold hover:underline transition '>
                    Login
                  </Link>
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
