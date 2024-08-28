import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchData, setisLogged } from '../../Redux-Toolkit/Slices/permissonSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogged, userData } = useSelector((state) => state.permission);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(setisLogged(!isLogged));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("uid");
  };

  const handleLinkClick = () => {
    setIsOpen(false); 
  };

  const isActive = (path) => (location.pathname === path ? 'bg-blue-700' : 'hover:bg-blue-500');

  return (
    <nav className="bg-gradient-to-r bg-blue-500 shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-white font-extrabold text-xl md:text-2xl lg:text-3xl flex items-center">
          Task Management App / {userData.role}
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Links for Desktop and Mobile */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 w-full bg-blue-500 lg:static lg:block lg:w-auto sm:flex sm:top-16 sm:bg-blue-500 transition-all duration-300`}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-6 items-center">
            <Link
              to="/manageUser"
              onClick={handleLinkClick}
              className={`block text-white px-4 py-2 rounded-lg mt-2 lg:mt-0 ${isActive('/manageUser')} transition duration-300`}
            >
              User Details
            </Link>
            <Link
              to="/showtasks"
              onClick={handleLinkClick}
              className={`block text-white px-4 py-2 rounded-lg mt-2 lg:mt-0 ${isActive('/showtasks')} transition duration-300`}
            >
              Tasks
            </Link>
            {userData.permission && userData.permission.includes('task_write') && (
              <Link
                to="/tasks"
                onClick={handleLinkClick}
                className={`block text-white px-4 py-2 rounded-lg mt-2 lg:mt-0 ${isActive('/tasks')} transition duration-300`}
              >
                Add Task
              </Link>
            )}
            <Link
              to="/"
              onClick={handleLogout}
              className="block text-white px-4 py-2 rounded-lg mt-2 lg:mt-0 bg-gray-600 hover:bg-gray-700 transition duration-300"
            >
              LogOut
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
