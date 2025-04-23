import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart , signInFailure , signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      dispatch(signInStart());
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data)); 
        console.log('Backend response:', data);
        navigate('/profile'); 
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 w-70 mx-auto">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="border border-slate-300 p-2 rounded-lg focus:outline-none"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-slate-300 p-2 rounded-lg focus:outline-none"
            id="password"
            onChange={handleChange}
          />
          <button  className="bg-slate-900 text-white p-2 rounded-lg uppercase hover:opacity-90 disabled:opacity-75 cursor-pointer">
            Sign In
          </button>
          <OAuth /> 
        </div>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button 
            type="button"
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignIn;