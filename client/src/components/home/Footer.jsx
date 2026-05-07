import { CheckSquare, Globe, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group inline-flex">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Taskify
              </span>
            </Link>
            <p className="text-sm mb-6">
              The modern collaborative workspace for high-performing teams to manage tasks and projects.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
