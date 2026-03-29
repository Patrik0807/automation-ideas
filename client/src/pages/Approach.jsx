import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Search, 
  Code, 
  CloudUpload, 
  TrendingUp,
  Layout,
  Workflow
} from 'lucide-react';

export default function Approach() {
  const flowchart = [
    {
      stage: 'Stage 1',
      title: 'Ideation & Prioritization',
      description: 'Submit raw ideas and evaluate them based on business impact, feasibility, and alignment with organizational goals.',
      icon: Lightbulb,
      color: 'bg-orange-500 shadow-orange-200',
      active: true
    },
    {
      stage: 'Stage 2',
      title: 'Planning & Design',
      description: 'Detail the process workflow, define technical requirements, and design the automation architecture.',
      icon: Layout,
      color: 'bg-blue-500 shadow-blue-200',
      active: true
    },
    {
      stage: 'Stage 3',
      title: 'Development & Execution',
      description: 'Engineering teams build the automation scripts or software using modern technology stacks.',
      icon: Code,
      color: 'bg-indigo-500 shadow-indigo-200',
      active: true
    },
    {
      stage: 'Stage 4',
      title: 'Deployment & Implementation',
      description: 'Roll out the solution to production, provide training, and ensure a smooth transition to automated processes.',
      icon: CloudUpload,
      color: 'bg-emerald-500 shadow-emerald-200',
      active: true
    },
    {
      stage: 'Stage 5',
      title: 'Evaluation & Optimization',
      description: 'Monitor performance, gather feedback, and continuously refine the automation for maximum efficiency.',
      icon: TrendingUp,
      color: 'bg-slate-700 shadow-slate-200',
      active: true
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white">
          <Workflow className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Our Method</span>
        </div>
        <h1 className="text-5xl font-black text-slate-800 mb-6 tracking-tight">Execution Approach</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          From a spark of an idea to a scaled implementation, our transparent process ensures excellence at every step.
        </p>
      </motion.div>

      <div className="relative">
        {/* The Connector line */}
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-blue-400 to-slate-400 opacity-20 hidden md:block" />

        <div className="space-y-12 md:space-y-24">
          {flowchart.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-center justify-between md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Stage Info (Side) */}
                <div className="hidden md:block w-[42%] text-right pr-12">
                  {isEven && (
                    <div className="text-left">
                      <span className="text-primary-500 font-bold text-sm mb-2 block">{step.stage}</span>
                      <h3 className="text-2xl font-black text-slate-800 mb-4">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-base">{step.description}</p>
                    </div>
                  )}
                </div>

                {/* Central Icon / Bubble */}
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-full ${step.color} shadow-lg flex items-center justify-center text-white ring-8 ring-white/50 backdrop-blur-md`}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-[42%] pl-8 md:pl-12 text-left">
                  {!isEven && (
                    <div className="hidden md:block">
                      <span className="text-blue-500 font-bold text-sm mb-2 block">{step.stage}</span>
                      <h3 className="text-2xl font-black text-slate-800 mb-4">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-base">{step.description}</p>
                    </div>
                  )}
                  {/* Mobile Content Display */}
                  <div className="md:hidden p-6 premium-card">
                    <span className="text-primary-500 font-bold text-sm mb-2 block">{step.stage}</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
