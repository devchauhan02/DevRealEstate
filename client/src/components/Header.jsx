import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-8xl mx-3 p-3'>
            <h1 className='font-bold text-sm sm:text-xl flex felx-wrap'>
                <span className='text-slate-500'>Dev</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center gap-2'>
                <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <FaSearch className='text-slate-600'/>
            </form>
            <ul className='flex gap-5'>
                <Link to = '/'>
                    <li className='text-slate-600 hover:text-slate-900 cursor-pointer hidden sm:inline'>Home</li>
                </Link>
                <Link to = '/about'>
                    <li className='text-slate-600 hover:text-slate-900 cursor-pointer hidden sm:inline'>About</li>
                </Link> 
                <Link to = '/profile'>
                   {currentUser ? ( <img className = "rounded-full h-6 w-6 object-cover" src= {currentUser.profilePic} alt="Profile" />) :
                    (<li className='text-slate-600 hover:text-slate-900 cursor-pointer'>Sign In</li>)
                   }
                </Link>
            </ul>
        </div>

    </header>
  )
}

export default Header