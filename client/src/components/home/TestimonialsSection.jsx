import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Product Manager at TechFlow',
      image: 'SJ',
      color: 'bg-blue-100 text-blue-700',
      text: "Taskify completely transformed how our product team operates. The real-time updates and intuitive Kanban boards saved us hours of meeting time every week."
    },
    {
      name: 'Marcus Chen',
      role: 'Engineering Lead at StartupX',
      image: 'MC',
      color: 'bg-green-100 text-green-700',
      text: "We tried Jira, Asana, and Trello. Taskify is the perfect middle ground—powerful enough for engineering, but simple enough for marketing to use."
    },
    {
      name: 'Elena Rodriguez',
      role: 'Founder & CEO',
      image: 'ER',
      color: 'bg-purple-100 text-purple-700',
      text: "The dashboard analytics give me a bird's-eye view of my entire company's productivity at a glance. It's the first thing I check every morning."
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Loved by productive teams
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Don't just take our word for it. See what our users have to say.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
              <div className="flex mb-4 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 flex-1 italic mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center mt-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${testimonial.color}`}>
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
