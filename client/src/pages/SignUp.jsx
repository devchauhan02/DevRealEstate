import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateInputs = () => {
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9 ]{1,29}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    if (!nameRegex.test(formData.name)) return 'Name should start with a letter and be 2-30 characters (letters, numbers, spaces allowed).';
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';
    if (!passwordRegex.test(formData.password)) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    setError('');
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
        navigate('/signin');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="mt-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md  bg-white text-center">
        <h1 className="text-3xl font-bold mb-1">Join us</h1>
        <p className="text-gray-600 mb-6">Create a HackerRank account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded-md"
            id="name"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-md"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Your password"
            className="w-full border p-2 rounded-md"
            id="password"
            onChange={handleChange}
          />
          <div className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" required />
            <span>I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</span>
          </div>
          <button className="w-full bg-green-700 cursor-pointer hover:bg-green-800 text-white font-semibold py-2 rounded-md">Sign up</button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <OAuth />

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
