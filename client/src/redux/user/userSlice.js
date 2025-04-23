import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const savedUser = Cookies.get('currentUser') ? JSON.parse(Cookies.get('currentUser')) : null;

const initialState = {
    currentUser: savedUser,
    token: savedUser?.token || Cookies.get('token') || null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            const userWithToken = {
                ...action.payload.user,
                token: action.payload.token,
            };

            state.isLoading = false;
            state.currentUser = userWithToken;
            state.token = action.payload.token;
            state.error = null;

            Cookies.set('currentUser', JSON.stringify(userWithToken), { expires: 30 });
            Cookies.set('token', action.payload.token, { expires: 30 });
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.token = null;

            Cookies.remove('currentUser');
            Cookies.remove('token');
        },
        updateUserStart: (state) => {
            state.isLoading = true;
        },
        updateUserSuccess: (state, action) => {
            const token = state.currentUser?.token;

            const updatedUser = {
                ...state.currentUser,
                ...action.payload,
                token: action.payload.token || token,
            };

            state.currentUser = updatedUser;
            state.isLoading = false;
            state.error = null;

            Cookies.set('currentUser', JSON.stringify(updatedUser), { expires: 30 });
        },
        updateUserFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.isLoading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;

            Cookies.remove('currentUser');
            Cookies.remove('token');
        },
        deleteUserFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOut,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
