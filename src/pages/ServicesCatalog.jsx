import React, { useState } from 'react';
import {
  Briefcase,
  Globe,
  Smartphone,
  Award,
  Database,
  BarChart3,
  Server,
  Headphones,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

const ServicesCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Enterprise Software Solutions',
      category: 'Software Solutions',
      icon: Briefcase,
      desc: 'Robust customized architectures to manage complex workflow operations, logistics, supply chains, and industrial assets.',
      details: 'Our enterprise software solutions focus on streamlining operations, reducing process friction, and integrating diverse software pipelines. We build systems that are design-heavy, optimized for high load, and tailored to local industrial regulations.',
      features: ['Custom workflow automation', 'Distributed database synchronizations', 'Third-party API middleware systems', 'Airtight compliance features'],
      techStack: 'Node.js, Express, PostgreSQL/MongoDB, Docker, Redis'
    },
    {
      id: 2,
      title: 'Web Development',
      category: 'Web Services',
      icon: Globe,
      desc: 'Responsive, clean web apps utilizing React, Tailwind, and Node.js for corporate SaaS portals and dashboards.',
      details: 'We craft state-of-the-art web portals and dashboards. Every layout is built using clean code guidelines, featuring full responsive support, persistent state configurations, and animations utilizing Framer Motion.',
      features: ['Single Page Applications (SPAs)', 'Sleek dark/light toggles', 'Recharts business intelligence integrations', 'RESTful endpoint connections'],
      techStack: 'React.js, Vite, HTML5/CSS3, Tailwind CSS, Axios'
    },
    {
      id: 3,
      title: 'Mobile App Development',
      category: 'Mobile Solutions',
      icon: Smartphone,
      desc: 'Seamless, high-performance native iOS and Android apps and hybrid cross-platform solutions.',
      details: 'From field surveys to customer portals, our mobile applications ensure high availability and offline capabilities. We handle the entire deployment lifecycle on App Store and Google Play.',
      features: ['Offline data syncing', 'Real-time GPS coordination trackers', 'Biometric validation auth logins', 'Native push notifications'],
      techStack: 'React Native, Flutter, Swift, Kotlin, Firebase'
    },
    {
      id: 4,
      title: 'CRM Services',
      category: 'CRM Solutions',
      icon: Award,
      desc: 'Custom pipelines, deal trackers, and customer journey dashboards to enhance client relations and marketing analytics.',
      details: 'Manage customer lifecycle data under one dashboard. Our CRM services include building custom deal grids, automatic lead scoring workflows, sales funnel indicators, and email automation triggers.',
      features: ['Dynamic deal management pipelines', 'Lead capture & automatic assignments', 'Sales conversion charting metrics', 'Outlook/Gmail integrations'],
      techStack: 'Node.js, Express, MongoDB, SendGrid API, Chart.js'
    },
    {
      id: 5,
      title: 'ERP/BaaN Solutions',
      category: 'ERP/BaaN Services',
      icon: Database,
      desc: 'Legacy systems migration, integrations, and administration support for BaaN IV, Infor LN, and SQL databases.',
      details: 'As ERP specialists, we assist Hyderabad enterprises in managing legacy BaaN grids. We support database upgrades, schema adjustments, custom report writing, and integration with modern cloud microservices.',
      features: ['BaaN IV table mapping & migration', 'Infor CloudSuite integration layouts', 'Custom SQL database administration', 'Financial reporting audits'],
      techStack: 'BaaN IV, Infor LN, MS SQL Server, Crystal Reports'
    },
    {
      id: 6,
      title: 'BI Reporting Tools',
      category: 'Software Solutions',
      icon: BarChart3,
      desc: 'Custom charting dashboards, KPI analyzers, and reporting layouts utilizing advanced data analytics.',
      details: 'Make sense of operational datasets. We build BI reporting tools that aggregate database logs (tasks completion, tickets, sales) and draw beautiful widgets showing historical trends.',
      features: ['Interactive Recharts charting', 'PDF/Excel reporting downloads', 'Automatic Slack notification summaries', 'Data warehousing connectors'],
      techStack: 'Recharts, Chart.js, Python Pandas, Node.js, Express'
    },
    {
      id: 7,
      title: 'Enterprise Portals',
      category: 'Web Services',
      icon: Server,
      desc: 'Highly secure intranet structures, file sharing channels, and shared workspace employee portals.',
      details: 'A centralized portal for internal communications. We set up intranet networks, file sharing channels, permissions access matrices, and task assignment boards.',
      features: ['Role-based page authorization grids', 'Document uploads & versions control', 'Intranet announcement logs', 'Real-time corporate directories'],
      techStack: 'React, Node.js, Express, Multer, AWS S3 API'
    },
    {
      id: 8,
      title: 'Technical Support',
      category: 'Support Operations',
      icon: Headphones,
      desc: '24/7 client systems monitoring, cloud database maintenance, and prompt support ticketing resolutions.',
      details: 'Our technical support department guarantees 99.9% uptime SLA contracts. We manage helpdesk tickets, monitor error logs, run backups, and patch security loops.',
      features: ['SLA-guaranteed ticket responses', 'Cloud performance log audits', 'Automated db backups config', 'Emergency hotpatch releases'],
      techStack: 'AWS CloudWatch, PM2, GitHub Actions, Mongoose, Express'
    }
  ];

  const categories = ['All', 'Software Solutions', 'Web Services', 'Mobile Solutions', 'CRM Solutions', 'ERP/BaaN Services', 'Support Operations'];

  // Search & filter matching
  const filteredServices = services.filter(srv => {
    const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.techStack.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-100 dark:bg-brand-950/50 px-3 py-1 rounded-full">
          Services Catalog
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Technology Solutions</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Explore specialized services built and maintained by Avon Technologies. Search and filter to find specific tech offerings.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-enterprise-900 p-4 border border-slate-200 dark:border-enterprise-800 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services, tech stacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Filter Category */}
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 self-center hidden sm:block mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-50 dark:bg-enterprise-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-enterprise-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of services */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-enterprise-800 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No services found matching your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredServices.map(srv => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="p-6 bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-xl flex flex-col justify-between hover:shadow-lg transition group"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-lg w-fit group-hover:scale-105 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {srv.title}
                  </h3>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-enterprise-850 text-slate-600 dark:text-slate-400 rounded uppercase">
                    {srv.category}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(srv)}
                  className="mt-6 w-full py-2 text-xs font-bold bg-slate-50 hover:bg-slate-100 dark:bg-enterprise-850 dark:hover:bg-enterprise-800 text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  View Details & Tech Stack
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-enterprise-800 flex justify-between items-center bg-slate-50 dark:bg-enterprise-900/40">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-lg">
                  {React.createElement(activeModal.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{activeModal.title}</h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{activeModal.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-enterprise-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Overview</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{activeModal.details}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Service Deliverables</h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-enterprise-950 rounded-xl border border-slate-200 dark:border-enterprise-850 space-y-1">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Standard Tech Stack</h4>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{activeModal.techStack}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-enterprise-800 bg-slate-50 dark:bg-enterprise-900/40 flex justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-enterprise-800 dark:hover:bg-enterprise-750 text-slate-700 dark:text-slate-300 rounded-lg transition"
              >
                Close Details
              </button>
              <a
                href="mailto:contact@avontech.com?subject=Enquiry regarding Avon Services"
                className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
              >
                Enquire Service
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesCatalog;
