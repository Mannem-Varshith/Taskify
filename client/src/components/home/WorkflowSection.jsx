import { motion } from 'framer-motion';

const WorkflowSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Create a Project',
      description: 'Set up your workspace in seconds. Define goals, attach documentation, and establish a clear timeline for your team.'
    },
    {
      number: '02',
      title: 'Assign Tasks',
      description: 'Break work down into manageable pieces. Assign owners, set priorities, and keep everyone accountable.'
    },
    {
      number: '03',
      title: 'Track Progress',
      description: 'Watch tasks move across the board. Monitor analytics and celebrate when projects hit 100% completion.'
    }
  ];

  return (
    <section id="workflow" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            >
              A workflow designed for momentum
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-12"
            >
              Stop wasting time fighting your tools. Taskify's intuitive layout means your team spends less time organizing work and more time actually doing it.
            </motion.p>

            <div className="space-y-12">
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="flex"
                >
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{step.number}</span>
                    </div>
                    {idx !== steps.length - 1 && (
                      <div className="w-px h-full bg-gray-200 dark:bg-gray-800 mx-auto mt-4"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full">
            {/* Visual presentation of workflow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-gray-200 dark:border-gray-800 p-8 shadow-2xl h-[500px]"
            >
              {/* Floating elements inside to simulate UI */}
              <motion.div 
                className="absolute top-12 right-12 w-64 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-3 bg-indigo-100 dark:bg-indigo-900/50 rounded mb-3"></div>
                <div className="w-3/4 h-3 bg-gray-100 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white dark:border-gray-800"></div>
                    <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">In Progress</div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute top-48 left-8 w-72 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">JD</span>
                  </div>
                  <div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-16 right-20 w-56 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-between items-end h-16 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-6 rounded-t-sm ${i === 4 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ height: `${20 + i * 15}%` }}></div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
