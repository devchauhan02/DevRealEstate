// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-2e2fe.firebaseapp.com",
  projectId: "realestate-2e2fe",
  storageBucket: "realestate-2e2fe.firebasestorage.app",
  messagingSenderId: "557894509630",
  appId: "1:557894509630:web:55b8b7bd040d134cdf1d6f",
  measurementId: "G-ZVJ6D6CZCJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);