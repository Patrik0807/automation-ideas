import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Lightbulb,
  Rocket,
  Target,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Zap,
  Shield,
  GitMerge,
  ChevronDown
} from 'lucide-react';

/* ─── Toyota Logo SVG ─────────────────────────────────────────── */
function ToyotaLogo({ className = 'w-10 h-10', color = '#EB0A1E' }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="30" rx="48" ry="28" stroke={color} strokeWidth="5" fill="none" />
      <ellipse cx="50" cy="30" rx="20" ry="28" stroke={color} strokeWidth="5" fill="none" />
      <ellipse cx="50" cy="14" rx="30" ry="10" stroke={color} strokeWidth="5" fill="none" />
    </svg>
  );
}

/* ─── Fade-in section wrapper ────────────────────────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section label pill ─────────────────────────────────────── */
function SectionLabel({ text }) {
  return (
    <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
      {text}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const handleCTA = (path) => {
    // Always send to login since this is a public page
    navigate('/login');
  };

  /* ── WHY cards data ─────────────────────────────────────────── */
  const whyCards = [
    {
      icon: Target,
      title: 'Reduce Manual Effort',
      desc: 'Identify repetitive manual tasks and replace them with streamlined, automated processes that free teams to focus on what matters.',
    },
    {
      icon: Zap,
      title: 'Increase Efficiency',
      desc: 'Transform every employee into an innovation contributor — submit ideas in minutes and watch them move through a structured pipeline.',
    },
    {
      icon: TrendingUp,
      title: 'Enable Automation',
      desc: 'Build and deploy solutions that scale across facilities with standardized governance, tracking, and outcome measurement.',
    },
  ];

  /* ── HOW steps ──────────────────────────────────────────────── */
  const howSteps = [
    {
      step: '01',
      title: 'Submit Idea',
      desc: 'Any employee can submit an automation idea through a structured form, describing the problem and expected impact.',
    },
    {
      step: '02',
      title: 'Review',
      desc: 'Leadership and department leads review submissions for feasibility, priority, and alignment with business goals.',
    },
    {
      step: '03',
      title: 'Implement',
      desc: 'Approved ideas are moved into active development where engineering teams build the automation solution.',
    },
    {
      step: '04',
      title: 'Track',
      desc: 'Monitor real-time status updates (Pending → Approved → In Progress → Implemented) directly from the platform.',
    },
  ];

  /* ── WHAT cards ─────────────────────────────────────────────── */
  const whatCards = [
    {
      icon: Lightbulb,
      title: 'Idea Management',
      desc: 'A centralized platform to submit, categorize, filter, and manage all automation ideas across the organization.',
      accent: 'bg-primary-100 text-primary-600',
    },
    {
      icon: CheckCircle2,
      title: 'Status Management',
      desc: 'Clear, unified status workflow ensuring that ideas are never lost in communication pipelines.',
      accent: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Actionable Insights',
      desc: 'Visual dashboards showing status distribution, category breakdown, and cumulative impact metrics.',
      accent: 'bg-blue-100 text-blue-600',
    },
  ];

  /* ── APPROACH stages (Vertical) ─────────────────────────────── */
  const approachStages = [
    { label: 'Ideation', desc: 'Capture and prioritize ideas from all levels.' },
    { label: 'Planning', desc: 'Design the workflow and architecture framework.' },
    { label: 'Build', desc: 'Engineering teams develop the requested solution.' },
    { label: 'Deploy', desc: 'Roll out and train across the target facilities.' },
    { label: 'Optimise', desc: 'Monitor, continuously measure, and improve.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden selection:bg-primary-100 selection:text-primary-900">

      {/* ═══════════════════ NAVBAR ═══════════════════════════════ */}
      <header className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 lg:h-28 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 group">
              <ToyotaLogo className="w-14 h-14 group-hover:opacity-90 transition-opacity" color="#EB0A1E" />
              <div className="leading-tight">
                <p className="text-slate-900 font-black text-xl tracking-tight leading-none mb-0.5">TOYOTA</p>
                <p className="text-primary-600 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase leading-none">Automated Logistics</p>
              </div>
            </div>

            {/* Nav links Removed as requested */}
            <nav className="hidden md:flex items-center gap-8"></nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-900 text-[17px] font-bold transition-colors hidden sm:block"
              >
                Log In
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-base font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-primary-500/20 active:scale-95"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ HERO ═════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Subtle background abstract elements */}
        <div className="absolute top-0 inset-x-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-[-10%] right-[-15%] w-[50%] h-[80%] bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[60%] bg-slate-300/20 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo emphasis */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200 border border-gray-100 rounded-3xl flex items-center justify-center">
                <ToyotaLogo className="w-12 h-12" color="#EB0A1E" />
              </div>
            </div>

            {/* Project Full Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Toyota Automated Logistics India <br />
              <span className="text-primary-600">Digitalisation & Automation</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A premium internal platform designed to capture and track automation ideas from the warehouse floor, transforming raw concepts into measurable business value.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleCTA('/insights')}
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600
                           text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-500/25
                           hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-base"
              >
                Explore Insights <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleCTA('/ideas')}
                className="flex items-center justify-center gap-2 border border-gray-200 bg-white
                           hover:bg-gray-50 text-slate-700 font-bold px-8 py-4 rounded-xl
                           hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-base shadow-sm"
              >
                Submit an Idea
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ WHY ══════════════════════════════════ */}
      <section id="why" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection className="text-center mb-16">
            <SectionLabel text="Why We Need This" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Driving Tangible Business Value
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className="group p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-300">
                      <Icon className="w-7 h-7 text-slate-700 group-hover:text-primary-600 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                </FadeSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW ══════════════════════════════════ */}
      <section id="how" className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection className="text-center mb-16">
            <SectionLabel text="How It works" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              A Seamless Transparent Process
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howSteps.map((item, i) => (
              <FadeSection key={i} delay={i * 0.1}>
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-primary-600 font-black text-lg flex items-center justify-center">
                      {item.step}
                    </div>
                    {/* Connector arrow (not on last) */}
                    {i < howSteps.length - 1 && (
                      <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 hidden lg:block" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHAT ═════════════════════════════════ */}
      <section id="what" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection className="text-center mb-16">
            <SectionLabel text="What The System Does" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Platform Features
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeSection key={i} delay={i * 0.12}>
                  <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className={`${card.accent} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                </FadeSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ APPROACH (Vertical Flowchart) ═════════════════════ */}
      <section id="approach" className="py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection className="text-center mb-20">
            <SectionLabel text="The Approach" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Vertical Execution Lifecycle
            </h2>
            <p className="mt-6 text-slate-500 text-xl max-w-2xl mx-auto">
              How we take automation ideas systematically from concept to rollout.
            </p>
          </FadeSection>

          {/* Vertical Flowchart layout */}
          <div className="relative pl-4 sm:pl-0">
            {/* The continuous vertical line */}
            <div className="absolute left-[39px] sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary-500/10 via-slate-200 to-transparent sm:-translate-x-1/2 rounded-full" />

            <div className="space-y-12">
              {approachStages.map((stage, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className={`relative flex items-center justify-between gap-6 sm:gap-12
                    ${i % 2 === 0 ? 'sm:flex-row-reverse' : 'sm:flex-row'}
                  `}>

                    {/* Ghost column for spacing on alternating sides (desktop) */}
                    <div className="hidden sm:block sm:w-1/2" />

                    {/* Central Node */}
                    <div className={`absolute left-0 sm:left-1/2 w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg bg-white z-10 sm:-translate-x-1/2
                      ${i === 0 ? 'border-primary-500' : 'border-gray-200'}
                    `}>
                      <span className={`text-2xl font-black ${i === 0 ? 'text-primary-600' : 'text-slate-400'}`}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Content Card */}
                    <div className="w-full sm:w-1/2 pl-28 sm:pl-0 bg-white">
                      <div className={`p-6 rounded-3xl border border-gray-100 shadow-sm bg-gray-50 hover:shadow-md transition-shadow
                        ${i % 2 === 0 ? 'sm:ml-12 text-left' : 'sm:mr-12 sm:text-right text-left'}
                      `}>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{stage.label}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>

                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════════════ */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <FadeSection>
            <h2 className="text-4xl font-black text-slate-900 mb-6">
              Ready to submit a new idea?
            </h2>
            <p className="text-slate-500 text-lg mb-10 mx-auto">
              Join the platform today and help us automate our logistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleCTA('/register')}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-10 py-4 rounded-xl
                          hover:bg-slate-800 transition-colors shadow-lg active:scale-95 text-base"
              >
                Create Account
              </button>
              <button
                onClick={() => handleCTA('/login')}
                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white font-bold px-10 py-4 rounded-xl
                          hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 active:scale-95 text-base"
              >
                Log In <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════════════════ */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <ToyotaLogo className="w-8 h-8" color="#EB0A1E" />
              <div>
                <p className="text-slate-900 font-black text-sm tracking-tight">TOYOTA</p>
                <p className="text-primary-600 text-[10px] font-bold tracking-[0.2em] uppercase">Automated Logistics</p>
              </div>
            </div>

            {/* Nav */}
            <div className="flex gap-6 text-sm font-semibold text-slate-500">
              <Link to="/login" className="hover:text-primary-600 transition-colors">Dashboard</Link>
              <Link to="/login" className="hover:text-primary-600 transition-colors">Submit Idea</Link>
              <Link to="/login" className="hover:text-primary-600 transition-colors">Admin Login</Link>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} Toyota Automated Logistics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
