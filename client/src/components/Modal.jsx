import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
