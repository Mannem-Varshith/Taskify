import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 dark:bg-pink-600/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mb-6 border border-indigo-100 dark:border-indigo-800">
              <span className="flex w-2 h-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
              Taskify 2.0 is now live
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Manage Team Tasks <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Smarter & Faster
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The ultimate collaborative workspace for modern teams. Streamline your workflow, track progress in real-time, and hit your deadlines without the chaos.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to={user ? "/dashboard" : "/register"}
              className="px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> Easy setup</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> Real-time collaboration</span>
          </motion.div>
        </div>

        {/* Dashboard Mockup Image */}
        <motion.div
          className="mt-20 relative mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative rounded-2xl bg-gray-900/5 p-2 sm:p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-900 via-transparent to-transparent z-10 bottom-0 h-1/3 pointer-events-none"></div>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl relative">
              {/* Browser Header Mockup */}
              <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto bg-white dark:bg-gray-800 px-3 py-1 text-xs text-gray-500 rounded-md w-1/3 text-center truncate">
                  taskify-production-live.up.railway.app/dashboard
                </div>
              </div>
              
              {/* Mockup Content (SVG/Image placeholder) */}
              <div className="aspect-[16/9] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Abstract dashboard representation */}
                <div className="w-full h-full flex gap-6">
                  {/* Sidebar mock */}
                  <div className="w-48 bg-white dark:bg-gray-800 rounded-lg hidden md:flex flex-col p-4 space-y-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                    <div className="space-y-3 pt-4">
                      <div className="w-3/4 h-4 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                      <div className="w-1/2 h-4 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                      <div className="w-2/3 h-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-md"></div>
                    </div>
                  </div>
                  
                  {/* Main content mock */}
                  <div className="flex-1 flex flex-col gap-6">
                    {/* Top cards */}
                    <div className="flex gap-4 h-24">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30"></div>
                          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                      ))}
                    </div>
                    {/* Kanban board mock */}
                    <div className="flex-1 flex gap-4">
                      {['To Do', 'In Progress', 'Done'].map((col, i) => (
                        <div key={col} className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3 border border-gray-50 dark:border-gray-700/50">
                          <div className="w-1/3 h-5 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                          {[1, 2].map(j => (
                             <motion.div 
                              key={j} 
                              className="w-full h-20 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 p-3"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 + j * 0.2 }}
                             >
                                <div className="w-1/4 h-3 bg-indigo-100 dark:bg-indigo-900/50 rounded mb-3"></div>
                                <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                             </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
