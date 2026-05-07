import { motion } from 'framer-motion';
import { Layout, Users, Zap, BarChart3, Shield, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Project Management',
      description: 'Organize projects logically with customized boards and clear milestones.',
      icon: <Layout className="w-6 h-6 text-indigo-500" />,
      gradient: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/20'
    },
    {
      title: 'Team Collaboration',
      description: 'Invite members and work together seamlessly in real-time.',
      icon: <Users className="w-6 h-6 text-purple-500" />,
      gradient: 'from-purple-500/10 to-pink-500/10 border-purple-500/20'
    },
    {
      title: 'Real-Time Updates',
      description: 'See task movements and status changes instantly across all your devices.',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20'
    },
    {
      title: 'Smart Analytics',
      description: 'Visual dashboards to track team performance and identify bottlenecks.',
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      gradient: 'from-green-500/10 to-emerald-500/10 border-green-500/20'
    },
    {
      title: 'Role-Based Access',
      description: 'Secure your projects with admin controls and member restrictions.',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      gradient: 'from-red-500/10 to-rose-500/10 border-red-500/20'
    },
    {
      title: 'Deadline Tracking',
      description: 'Never miss a due date again with automatic visual indicators.',
      icon: <Clock className="w-6 h-6 text-cyan-500" />,
      gradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Everything you need to ship faster
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Powerful features built for modern teams without the bloat. 
            Simplicity meets enterprise-grade productivity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`}></div>
              
              <div className="relative z-10">
                <div className="bg-gray-50 dark:bg-gray-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
