import { motion } from 'framer-motion';
import { Zap, Target, Users } from 'lucide-react';

export default function Motive() {
  const managerVision = [
    {
      label: 'Why',
      title: 'Our Purpose',
      content: 'To enhance customer satisfaction by enabling automation in business processes and making our solutions scalable, flexible, effective and cost optimized.',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      label: 'How',
      title: 'Our Strategy',
      content: 'Define roadmap of collecting ideas, evaluate business impact, collaborate with technical teams for implementation and define a mechanism to monitor progress.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'What',
      title: 'Our Outcome',
      content: 'Achieve lower operational cost through automation and resource optimization. Deliver fast, scalable, flexible and efficient solutions to customers while staying competitive.',
      gradient: 'from-emerald-500 to-emerald-600'
    }
  ];

  const motives = [
    {
      title: 'Reducing Manual Effort',
      description: 'By identifying repetitive tasks, we aim to automate time-consuming processes, freeing up valuable time for strategic work.',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Improving Efficiency',
      description: 'Streamlined workflows lead to faster turnaround times, cost savings, and higher quality outputs across all departments.',
      icon: Target,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Encouraging Ideas',
      description: 'We believe the best automation ideas come from the people executing the tasks. This platform empowers you to share those insights.',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black text-slate-800 mb-6 tracking-tight">The Core Motive</h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
          Driving innovation through structured automation and resource optimization.
        </p>
      </motion.div>

      {/* Manager Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {managerVision.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-10 flex flex-col items-start"
          >
            <span className={`px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${item.gradient} mb-6`}>
              {item.label}
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h2>
            <p className="text-slate-600 leading-relaxed">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-slate-200/50 pt-16 mb-12">
        <h3 className="text-2xl font-bold text-slate-800 text-center mb-12">Key Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {motives.map((motive, index) => {
            const Icon = motive.icon;
            return (
              <motion.div
                key={motive.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50 flex flex-col items-center text-center group transition-all hover:bg-white"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${motive.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${motive.color}`} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{motive.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {motive.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
