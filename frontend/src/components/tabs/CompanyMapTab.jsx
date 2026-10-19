import React, { useState, useMemo } from 'react';
import { MapPin, Building2, ExternalLink, Globe, Briefcase, Search, Navigation } from 'lucide-react';

const CITIES = [
  { id: 'all', label: 'All Cities' },
  { id: 'noida', label: 'Noida' },
  { id: 'gurgaon', label: 'Gurgaon / NCR' },
  { id: 'bengaluru', label: 'Bengaluru' },
  { id: 'hyderabad', label: 'Hyderabad' },
  { id: 'pune', label: 'Pune' },
  { id: 'remote', label: 'Remote / Global' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'MNC', label: 'MNCs', icon: Building2 },
  { id: 'Startup', label: 'Startups & Unicorns', icon: Globe },
  { id: 'Product Co', label: 'Software Product Cos', icon: Briefcase },
];

export default function CompanyMapTab({ companies = [] }) {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback default companies if backend has not run yet
  const displayList = companies && companies.length > 0 ? companies : [
    {
      name: "Paytm / One97 Communications",
      category: "Startup",
      city: "Noida",
      hub: "Sector 62, Noida",
      address: "One97 Communications, Skymark One, Sector 62, Noida, Uttar Pradesh 201309",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Paytm+Sector+62+Noida",
      careers_url: "https://paytm.com/careers",
      linkedin_url: "https://www.linkedin.com/company/paytm/jobs/",
      tech_stack: ["Node.js", "React", "Java", "MERN", "AWS", "Microservices"],
      description: "India's leading digital payments and financial technology unicorn.",
      hiring_type: "Freshers & Experienced (0-3 Yrs)"
    },
    {
      name: "InfoEdge India (Naukri, Jeevansathi)",
      category: "Product Co",
      city: "Noida",
      hub: "Sector 132, Noida Expressway",
      address: "Info Edge India Ltd, B-8, Sector 132, Noida, Uttar Pradesh 201304",
      maps_url: "https://www.google.com/maps/search/?api=1&query=InfoEdge+Sector+132+Noida",
      careers_url: "https://www.infoedge.in/careers",
      linkedin_url: "https://www.linkedin.com/company/info-edge-india-ltd/jobs/",
      tech_stack: ["React", "Node.js", "Python", "MongoDB", "Elasticsearch"],
      description: "Internet product powerhouse operating India's top classifieds platforms.",
      hiring_type: "Campus & Off-Campus Hiring"
    },
    {
      name: "Adobe Systems India",
      category: "MNC",
      city: "Noida",
      hub: "Sector 132 / Sector 25A, Noida",
      address: "Adobe Systems India Pvt Ltd, Advant Navis Business Park, Sector 142 / Sector 132, Noida",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Adobe+Systems+Noida",
      careers_url: "https://www.adobe.com/careers.html",
      linkedin_url: "https://www.linkedin.com/company/adobe/jobs/",
      tech_stack: ["React", "C++", "Java", "Cloud", "Machine Learning"],
      description: "Global software giant building digital media and creative cloud solutions.",
      hiring_type: "Internships, Freshers & SDE-1"
    },
    {
      name: "Google India (Cyber City)",
      category: "MNC",
      city: "Gurgaon",
      hub: "DLF Cyber City, Gurgaon",
      address: "Google India, Signature Tower / Cyber City Phase II, Sector 24, Gurgaon, Haryana 122002",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Google+India+Cyber+City+Gurgaon",
      careers_url: "https://careers.google.com/locations/gurgaon/",
      linkedin_url: "https://www.linkedin.com/company/google/jobs/",
      tech_stack: ["Python", "C++", "Go", "Distributed Systems", "Cloud"],
      description: "Global technology leader in search, cloud, AI, and advertising software.",
      hiring_type: "Software Engineers (L3/L4) & University Grads"
    },
    {
      name: "Zomato HQ",
      category: "Startup",
      city: "Gurgaon",
      hub: "Udyog Vihar Phase 5, Gurgaon",
      address: "Zomato HQ, Ground Floor, 12A, 94 Meghdoot, Udyog Vihar Phase 5, Gurugram",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Zomato+HQ+Gurgaon",
      careers_url: "https://www.zomato.com/careers",
      linkedin_url: "https://www.linkedin.com/company/zomato/jobs/",
      tech_stack: ["React", "Node.js", "Python", "Go", "PostgreSQL", "Kafka"],
      description: "Leading Indian food-tech and quick-commerce platform.",
      hiring_type: "SDE-1 & Full Stack Developers"
    },
    {
      name: "Flipkart",
      category: "Startup",
      city: "Bengaluru",
      hub: "Embassy Tech Village, Outer Ring Road, Bengaluru",
      address: "Flipkart Internet Pvt Ltd, Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Bengaluru 560103",
      maps_url: "https://www.google.com/maps/search/?api=1&query=Flipkart+Embassy+Tech+Village+Bengaluru",
      careers_url: "https://www.flipkartcareers.com/",
      linkedin_url: "https://www.linkedin.com/company/flipkart/jobs/",
      tech_stack: ["React", "Node.js", "Java", "Kafka", "Distributed Databases"],
      description: "India's homegrown e-commerce marketplace and technology leader.",
      hiring_type: "SDE-1, Frontend, Backend Engineers"
    }
  ];

  // Filtering logic
  const filteredCompanies = useMemo(() => {
    return displayList.filter((comp) => {
      // City filter
      if (selectedCity !== 'all') {
        const compCity = (comp.city || '').toLowerCase();
        if (selectedCity === 'gurgaon') {
          if (!compCity.includes('gurgaon') && !compCity.includes('gurugram')) return false;
        } else if (selectedCity === 'bengaluru') {
          if (!compCity.includes('bengaluru') && !compCity.includes('bangalore')) return false;
        } else if (!compCity.includes(selectedCity)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (comp.category !== selectedCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (comp.name || '').toLowerCase().includes(q);
        const matchesHub = (comp.hub || '').toLowerCase().includes(q);
        const matchesAddress = (comp.address || '').toLowerCase().includes(q);
        const matchesStack = (comp.tech_stack || []).some((st) => st.toLowerCase().includes(q));
        if (!matchesName && !matchesHub && !matchesAddress && !matchesStack) return false;
      }

      return true;
    });
  }, [displayList, selectedCity, selectedCategory, searchQuery]);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'MNC':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Startup':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Product Co':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Tech Companies & Office Hubs
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
              Google Maps Listed
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Discover tech companies, tech parks, and corporate offices near your location with direct Google Maps directions and careers portals.
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, sector, stack..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-2.5">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">City:</span>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                selectedCity === city.id
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-700'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">Type:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-zinc-100 text-black font-semibold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-xs text-zinc-500 ml-auto font-mono">
            {filteredCompanies.length} companies listed
          </span>
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((comp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Title & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {comp.name}
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-medium ${getCategoryBadgeClass(
                      comp.category
                    )}`}
                  >
                    {comp.category}
                  </span>
                </div>

                {/* Hub / Sector & Address */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                    <Navigation className="w-3 h-3 shrink-0" />
                    <span>{comp.hub}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {comp.address}
                  </p>
                </div>

                {/* Hiring Focus */}
                {comp.hiring_type && (
                  <div className="text-[11px] text-zinc-300 flex items-center gap-1.5 pt-1">
                    <span className="text-zinc-500 font-mono">Hiring:</span>
                    <span>{comp.hiring_type}</span>
                  </div>
                )}

                {/* Tech Stack Tags */}
                {comp.tech_stack && comp.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {comp.tech_stack.map((st, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                )}

                {/* Short Description */}
                {comp.description && (
                  <p className="text-[11px] text-zinc-400 italic pt-1">
                    "{comp.description}"
                  </p>
                )}
              </div>

              {/* Action Buttons: Google Maps & Careers */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between gap-2">
                <a
                  href={comp.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comp.name + ' ' + (comp.address || comp.hub))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs font-medium flex items-center gap-1 transition-all"
                  title="View on Google Maps"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Google Maps</span>
                </a>

                <div className="flex items-center gap-1.5">
                  {comp.careers_url && (
                    <a
                      href={comp.careers_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Careers</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {comp.linkedin_url && (
                    <a
                      href={comp.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all"
                      title="LinkedIn Jobs"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <MapPin className="w-6 h-6 mx-auto text-zinc-600" />
          <p className="text-xs text-zinc-400">
            No companies found matching the current filters.
          </p>
          <button
            onClick={() => {
              setSelectedCity('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 text-xs font-medium border border-zinc-750"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
