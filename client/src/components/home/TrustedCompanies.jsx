import { motion } from 'framer-motion';
import { Briefcase, Building2, Coffee, Command, Cpu, Hexagon } from 'lucide-react';

const TrustedCompanies = () => {
  const companies = [
    { icon: <Command className="w-8 h-8" />, name: 'Acme Corp' },
    { icon: <Building2 className="w-8 h-8" />, name: 'Globex' },
    { icon: <Coffee className="w-8 h-8" />, name: 'Stark Ind' },
    { icon: <Hexagon className="w-8 h-8" />, name: 'Initech' },
    { icon: <Briefcase className="w-8 h-8" />, name: 'Soylent' },
    { icon: <Cpu className="w-8 h-8" />, name: 'Massive Dynamic' },
  ];

  return (
    <section className="py-10 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 tracking-wide uppercase">
          Trusted by productive teams worldwide
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {companies.map((company, idx) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors grayscale hover:grayscale-0 cursor-default"
            >
              {company.icon}
              <span className="text-xl font-bold font-serif">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
