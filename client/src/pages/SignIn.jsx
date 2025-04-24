import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
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
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/profile');
      } else {
        dispatch(signInFailure(data.message));
        setError(data.message);
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 bg-white px-4">
      <div className="w-full max-w-md p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back!</h2>
        <p className="text-sm text-gray-500 mb-6">It's nice to see you again. Ready to code?</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            id="email"
            placeholder="Your username or email"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Your password"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-green-800"
            type="submit"
          >
            Log In
          </button>
        </form>

        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-1" /> Remember me
          </label>
          <button onClick={() => navigate('/forgot-password')} className="text-sm text-blue-600 hover:cursor-pointer">
            Forgot password?
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t"></div>
        </div>

        <OAuth />

        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 font-semibold hover:cursor-pointer"
            type='button'
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
