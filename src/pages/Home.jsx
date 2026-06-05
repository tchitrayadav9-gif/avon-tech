import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Globe,
  Smartphone,
  Award,
  Database,
  BarChart3,
  Server,
  Headphones,
  CheckCircle,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const servicesList = [
    {
      title: 'Enterprise Software Solutions',
      desc: 'Robust customized architectures to manage complex workflow operations, supply chains, and industrial assets.',
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
    },
    {
      title: 'Web Services & Development',
      desc: 'Responsive, clean web apps utilizing React, Tailwind, and Node.js for corporate SaaS portals.',
      icon: Globe,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30'
    },
    {
      title: 'Mobile Application Solutions',
      desc: 'Seamless, high-performance native iOS and Android apps and hybrid cross-platform solutions.',
      icon: Smartphone,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      title: 'CRM Solutions',
      desc: 'Custom pipelines, tracking engines, and marketing automation systems to enhance customer satisfaction.',
      icon: Award,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
    },
    {
      title: 'ERP/BaaN Services',
      desc: 'Legacy systems migration, integrations, and administration support for BaaN IV, Infor LN, and SQL databases.',
      icon: Database,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
    },
    {
      title: 'Business Intelligence Tools',
      desc: 'Custom charting dashboards, KPI analyzers, and reporting layouts utilizing advanced data analytics.',
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30'
    },
    {
      title: 'Cloud & Enterprise Portals',
      desc: 'Highly secure intranet structures, file sharing channels, and shared workspace employee portals.',
      icon: Server,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30'
    },
    {
      title: 'Technical Consulting & Support',
      desc: '24/7 client systems monitoring, cloud database maintenance, and prompt bug resolutions.',
      icon: Headphones,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30'
    }
  ];

  const stats = [
    { value: '150+', label: 'Total Employees', icon: Users },
    { value: '45+', label: 'Active Clients', icon: ShieldCheck },
    { value: '120+', label: 'Ongoing Projects', icon: Briefcase },
    { value: '98%', label: 'Project Success Rate', icon: TrendingUp },
    { value: '2,400+', label: 'Tickets Resolved', icon: CheckCircle }
  ];

  const testimonials = [
    {
      quote: "Avon Technologies has completely revolutionized our supply chain tracking with their ERP migration services. The Infor LN dashboard integrations are seamless.",
      name: "Suresh Rao",
      role: "Operations Director, Hyderabad Logistics"
    },
    {
      quote: "Their CRM solutions allowed us to scale sales pipeline automation by 40% in just two quarters. Support ticketing resolutions are highly responsive.",
      name: "Karan Singh",
      role: "VP of Product, TechCorp India"
    },
    {
      quote: "The cloud portal built by Avon provides our distributed team with an airtight, collaborative workspace. Security levels are enterprise-grade.",
      name: "Ananya Reddy",
      role: "IT Infrastructure Head, Veda Capital"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-slate-900 text-white brand-gradient">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <span className="px-3 py-1 text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full uppercase tracking-wider">
              Avon Enterprise Suite
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Smart Enterprise Management for Clients, Employees & IT Operations
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              A centralized business platform for Avon Technologies to manage software projects, employee operations, enterprise services, and client workflows.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center space-x-2 transition shadow-lg shadow-brand-900/40"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg transition"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Illustration Container */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md p-6 glass-panel rounded-2xl border border-white/10 shadow-2xl relative">
              <div className="absolute -top-4 -left-4 p-3 bg-brand-600 rounded-xl text-white shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400 font-mono pl-2">avon-enterprise-monitor v2.6</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-16 bg-white/5 rounded w-full flex items-center justify-between px-4 text-xs font-mono text-cyan-400">
                    <span>$ npm run start:dev<br />&gt; server listening on port 5000...</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-10 bg-white/5 rounded flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400">Memory</span>
                      <span className="text-xs font-bold text-emerald-400">12%</span>
                    </div>
                    <div className="h-10 bg-white/5 rounded flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400">Database</span>
                      <span className="text-xs font-bold text-cyan-400">Online</span>
                    </div>
                    <div className="h-10 bg-white/5 rounded flex flex-col items-center justify-center">
                      <span className="text-[10px] text-slate-400">CPU</span>
                      <span className="text-xs font-bold text-brand-400">1.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-100 dark:bg-brand-950/50 px-3 py-1 rounded-full">
            Our Core Competencies
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Professional IT Company Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Avon Technologies delivers premium specialized solutions designed to power, integrate, and scale digital operations across corporate ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg w-fit ${srv.color} transition-transform group-hover:scale-110 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-slate-900 text-white brand-gradient border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="space-y-2 flex flex-col items-center">
                <div className="p-3 bg-white/5 rounded-xl mb-1 text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">{st.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Client Success Testimonials
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Read stories from directors and managers of enterprises utilizing our custom solutions and ERP support engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-50 dark:bg-enterprise-900/40 border border-slate-200/60 dark:border-enterprise-800/40 rounded-xl relative shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-6xl text-brand-600/10 absolute top-4 left-4 font-serif">“</span>
              <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed relative z-10">
                {t.quote}
              </p>
              <div className="flex flex-col border-t border-slate-200 dark:border-enterprise-800 pt-4">
                <span className="font-bold text-slate-800 dark:text-slate-200">{t.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="p-8 md:p-12 premium-gradient text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold">Ready to align your operations?</h3>
            <p className="text-indigo-50 leading-relaxed text-sm md:text-base">
              Onboard your clients, coordinate developers, build sprint trackers, and access AI support assistance in one enterprise-grade space.
            </p>
          </div>
          <Link
            to="/login"
            className="px-6 py-3.5 font-bold bg-white text-brand-700 hover:bg-slate-50 rounded-lg flex items-center space-x-2 transition shadow-lg shrink-0"
          >
            <span>Access Portal Dashboard</span>
            <ArrowRight className="w-4 h-4 text-brand-700" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
