import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('User created successfully');
        navigate('/signin'); // Redirect to sign-in page after successful signup
      } else {
        setError(data.message || 'Something went wrong'); // Set error message
      }
    } catch (err) {
      console.log(err);
      setError('An unexpected error occurred. Please try again.'); // Handle unexpected errors
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error */}
          <input
            type="text"
            placeholder="Name"
            className="border w-70 border-slate-300 p-2 rounded-lg focus:outline-none"
            id="name"
            onChange={handleChange}
          />
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
          <button className="bg-slate-900 text-white p-2 rounded-lg uppercase hover:opacity-90 disabled:opacity-75 cursor-pointer">
            Sign Up
          </button>
          <OAuth /> 
        </div>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;