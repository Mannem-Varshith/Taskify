import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTABanner = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl mix-blend-overlay"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl mix-blend-overlay"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Ready to supercharge your team's productivity?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-indigo-100 mb-10"
        >
          Join thousands of teams already using Taskify to manage their work and hit their goals.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Link
            to="/register"
            className="px-8 py-4 text-lg font-bold text-indigo-600 bg-white rounded-full hover:bg-gray-50 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
