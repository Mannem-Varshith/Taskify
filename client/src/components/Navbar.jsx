import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
