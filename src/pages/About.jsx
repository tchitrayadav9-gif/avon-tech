import React from 'react';
import {
  Code2,
  Terminal,
  Database,
  SearchCheck,
  TrendingUp,
  Cpu,
  Shield,
  Layers,
  HeartHandshake
} from 'lucide-react';

const About = () => {
  const departments = [
    { name: 'Frontend Development Team', desc: 'Crafts premium, responsive UI structures using React.js and modern JS libraries.', icon: Code2 },
    { name: 'Backend Development Team', desc: 'Designs scalable RESTful API services, JWT token authorization pools, and Mongoose controllers.', icon: Terminal },
    { name: 'QA & Verification Team', desc: 'Guarantees project delivery guidelines by enforcing testing protocols and client verification sprints.', icon: SearchCheck },
    { name: 'ERP/BaaN Consulting Team', desc: 'Maintains enterprise structures, migrations, and database linkages for Infor LN and BaaN IV grids.', icon: Database },
    { name: 'CRM Integration Team', desc: 'Deploys customized CRM systems, tracking deals, user pipelines, and sales analytics.', icon: Layers },
    { name: 'Mobile Application Team', desc: 'Builds native and cross-platform apps for mobile operations.', icon: Cpu },
    { name: 'HR & Administrative Ops', desc: 'Coordinates developer onboarding, performance statistics metrics, and general business tasks.', icon: Shield }
  ];

  const coreValues = [
    { title: 'Industry Expertise', desc: 'Specialized skills in database migration, cloud services, and custom ERP integration.', icon: Cpu },
    { title: 'Enterprise Solutions', desc: 'Building software designed to support massive data loads and high-traffic pipelines.', icon: Shield },
    { title: 'Skilled Developers', desc: 'A vetted group of engineers and consultants working in dedicated departments.', icon: Code2 },
    { title: 'Client-Centric Approach', desc: 'Role-based dashboards keep clients fully updated on milestones and progress bars.', icon: HeartHandshake },
    { title: 'Reliable Support', desc: 'Helpdesk ticket assignment ensuring that issues are tracked from creation to resolution.', icon: SearchCheck }
  ];

  const milestones = [
    { year: '2020', title: 'Company Foundation', desc: 'Avon Technologies established in Hyderabad, Telangana, providing web services and consulting.' },
    { year: '2022', title: 'ERP & BaaN Focus', desc: 'Onboarded dedicated teams for legacy BaaN migrations, scaling services to supply chain clients.' },
    { year: '2024', title: 'Global Clients Expansion', desc: 'Reached 40+ active enterprise clients across India and Asia with custom CRM and portal systems.' },
    { year: '2026', title: 'Enterprise Portal Launch', desc: 'Built the Smart Client & Employee Management Portal, syncing internal operations via AI FAQ assistance.' }
  ];

  return (
    <div className="py-12 space-y-20 max-w-7xl mx-auto px-6">
      {/* Overview Block */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-100 dark:bg-brand-950/50 px-3 py-1 rounded-full">
            Who We Are
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Avon Technologies (India) Pvt. Ltd.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Avon Technologies is a leading software solutions and technical consulting firm headquartered in HITEC City, Hyderabad, Telangana. We specialize in digital transformation, building enterprise-grade tools that bridge the gap between complex software databases and day-to-day corporate operations.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            With years of experience in ERP consulting, CRM architectures, mobile development, and business intelligence reporting, we empower companies to operate faster, coordinate teams efficiently, and maintain complete visibility over their technical assets.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-enterprise-800">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Our Mission</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Deliver scalable enterprise software and digital transformation solutions that drive real operational value and client growth.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Our Vision</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Empower global businesses through intelligent software innovations, setting the benchmark for integration reliability and support.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Department graphic */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl brand-gradient relative shadow-xl overflow-hidden min-h-[300px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Avon Tech Hub</h3>
            <p className="text-xs text-slate-400">Hyderabad, Telangana Operations</p>
          </div>

          <div className="space-y-3 pt-8">
            <div className="flex items-center space-x-3 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-300 truncate">ERP Integration Sprints - Active (3 Sprints)</span>
            </div>
            <div className="flex items-center space-x-3 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
              <span className="text-slate-300 truncate">CRM API Development - Active (Rahul, Priya)</span>
            </div>
            <div className="flex items-center space-x-3 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0" />
              <span className="text-slate-300 truncate">Support Queue - 100% SLA Resolution Rate</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-white/5 flex justify-between">
            <span>AVON-NET-SEC // LEVEL 4</span>
            <span>SYSTEM STABLE</span>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Choose Avon Technologies</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Our operational metrics and service standards separate us from generic development agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-xl space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="p-2.5 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-lg w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{val.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Departments Listing */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Enterprise Departments</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Avon is organized into specialized teams to provide continuous, high-quality development, support, and consulting services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-slate-50 dark:bg-enterprise-900/40 border border-slate-200/60 dark:border-enterprise-800/40 rounded-xl flex items-start space-x-4 hover:bg-white dark:hover:bg-enterprise-900 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400 rounded-lg shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 text-base">{dept.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dept.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Journey</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A history of technology integration, support scaling, and product launches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {milestones.map((ml, idx) => (
            <div key={idx} className="relative p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 font-mono tracking-widest">{ml.year}</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{ml.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ml.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
