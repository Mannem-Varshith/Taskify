import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Taskify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-3 px-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="w-full text-center px-5 py-3 text-base font-medium text-white bg-indigo-600 rounded-xl"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center px-5 py-3 text-base font-medium text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-xl"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center px-5 py-3 text-base font-medium text-white bg-indigo-600 rounded-xl"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
