import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInFailure, signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    profilePic: result.user.photoURL,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess({ user: data.user, token: data.token }));
                navigate('/profile');
            } else {
                dispatch(signInFailure(data.message));
            }
        } catch (err) {
            dispatch(signInFailure(err.message));
        }
    };
    return (
        <button onClick={handleGoogleClick} type='button' className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer">
            Sign in with Google
        </button>

    )
}

export default OAuth