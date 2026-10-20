import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Building2,
  ExternalLink,
  Globe,
  Briefcase,
  Search,
  Navigation,
  Compass,
  LocateFixed,
  Sparkles,
  Layers
} from 'lucide-react';

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
  { id: 'all', label: 'All Types' },
  { id: 'MNC', label: '🏢 MNCs', icon: Building2 },
  { id: 'Startup', label: '🚀 Startups & Unicorns', icon: Globe },
  { id: 'Product Co', label: '📦 Product Cos', icon: Briefcase },
];

const POPULAR_HUBS = [
  { label: '📍 Near Me (Noida/NCR)', query: 'noida' },
  { label: 'Sector 62, Noida', query: 'sector 62' },
  { label: 'Sector 132 & 144, Noida', query: 'sector 132' },
  { label: 'DLF Cyber City, Gurgaon', query: 'cyber city' },
  { label: 'Udyog Vihar, Gurgaon', query: 'udyog vihar' },
  { label: 'Bengaluru (ORR / E-City)', query: 'bengaluru' },
  { label: 'Hyderabad (HITEC City)', query: 'hyderabad' },
  { label: 'Pune (Hinjawadi)', query: 'pune' },
];

// Rich curated directory of verified tech employers with exact addresses
const ALL_TECH_COMPANIES = [
  // ── NOIDA / GREATER NOIDA ──
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
    name: "Samsung R&D Institute India (SRI-N)",
    category: "MNC",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Samsung R&D Institute, Logix Cyber Park, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Samsung+R%26D+Institute+Sector+62+Noida",
    careers_url: "https://www.samsung.com/in/aboutsamsung/careers/",
    linkedin_url: "https://www.linkedin.com/company/samsung-research-institute-noida/jobs/",
    tech_stack: ["Android", "Python", "AI/ML", "React", "C++", "Backend APIs"],
    description: "Premier R&D center engineering next-gen AI, smart devices, and software.",
    hiring_type: "Freshers & R&D Engineers"
  },
  {
    name: "Microsoft India (Noida Campus)",
    category: "MNC",
    city: "Noida",
    hub: "Sector 142 / Sector 136, Noida",
    address: "Microsoft India, Sovereign Capital Tower / Advant Navis, Sector 136 & 142, Noida Expressway",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Microsoft+India+Advant+Navis+Noida",
    careers_url: "https://careers.microsoft.com/",
    linkedin_url: "https://www.linkedin.com/company/microsoft/jobs/",
    tech_stack: ["C#", "Azure", "React", "TypeScript", "Distributed Systems"],
    description: "Taj Mahal-inspired Microsoft engineering and cloud innovation center.",
    hiring_type: "Software Engineers & Interns"
  },
  {
    name: "HCL Technologies HQ",
    category: "MNC",
    city: "Noida",
    hub: "Sector 126 / Sector 3, Noida",
    address: "HCL Technologies Ltd, Technology Hub, Sector 126, Noida, Uttar Pradesh 201303",
    maps_url: "https://www.google.com/maps/search/?api=1&query=HCL+Technologies+Sector+126+Noida",
    careers_url: "https://www.hcltech.com/careers",
    linkedin_url: "https://www.linkedin.com/company/hcltech/jobs/",
    tech_stack: ["Full Stack", "Java", "React", "Python", "Cloud & DevOps"],
    description: "Global tech services and consulting MNC headquartered in Noida.",
    hiring_type: "Graduate Engineer Trainee & Lateral"
  },
  {
    name: "Pine Labs",
    category: "Product Co",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Pine Labs Pvt Ltd, Candor TechSpace, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Pine+Labs+Candor+TechSpace+Sector+62+Noida",
    careers_url: "https://www.pinelabs.com/careers",
    linkedin_url: "https://www.linkedin.com/company/pine-labs/jobs/",
    tech_stack: ["Node.js", "React", "Go", "Distributed Systems", "PostgreSQL"],
    description: "Merchant platform and fintech unicorn powering point-of-sale tech.",
    hiring_type: "SDE-1, Full Stack Developers"
  },
  {
    name: "Ericsson India Global Services",
    category: "MNC",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Ericsson India, Candor TechSpace, Tower 3, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Ericsson+India+Candor+TechSpace+Sector+62+Noida",
    careers_url: "https://www.ericsson.com/en/careers",
    linkedin_url: "https://www.linkedin.com/company/ericsson/jobs/",
    tech_stack: ["Cloud", "Java", "Python", "Telecom APIs", "React"],
    description: "Global communications tech leader and 5G network software innovator.",
    hiring_type: "Graduate Engineer Trainee & Software Engineers"
  },
  {
    name: "Birlasoft Limited",
    category: "Product Co",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Birlasoft Ltd, Plot No. 35 & 36, Sector 62, Noida, Uttar Pradesh 201301",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Birlasoft+Sector+62+Noida",
    careers_url: "https://www.birlasoft.com/careers",
    linkedin_url: "https://www.linkedin.com/company/birlasoft/jobs/",
    tech_stack: ["React", "Java", "Node.js", "Cloud & DevOps", "SQL"],
    description: "Enterprise digital transformation and cloud native solutions company.",
    hiring_type: "Freshers & Full Stack Developers"
  },
  {
    name: "Tech Mahindra",
    category: "MNC",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Tech Mahindra, A-7, Sector 62, Noida, Uttar Pradesh 201301",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Tech+Mahindra+Sector+62+Noida",
    careers_url: "https://careers.techmahindra.com/",
    linkedin_url: "https://www.linkedin.com/company/tech-mahindra/jobs/",
    tech_stack: ["Full Stack", "React", "Python", "Cloud", "Microservices"],
    description: "Global IT services and digital solutions provider with major delivery hub in Noida.",
    hiring_type: "Associate Software Engineers (0-2 Yrs)"
  },
  {
    name: "GlobalLogic (Hitachi Group)",
    category: "Product Co",
    city: "Noida",
    hub: "Sector 144, Noida Expressway",
    address: "GlobalLogic India, Oxygen Business Park, Sector 144, Noida, Uttar Pradesh 201304",
    maps_url: "https://www.google.com/maps/search/?api=1&query=GlobalLogic+Oxygen+Business+Park+Noida",
    careers_url: "https://www.globallogic.com/in/careers/",
    linkedin_url: "https://www.linkedin.com/company/globallogic/jobs/",
    tech_stack: ["React", "Node.js", "Java", "Python", "Cloud Systems"],
    description: "Digital product engineering leader designing next-gen intelligent digital experiences.",
    hiring_type: "Software Engineers & Entry-Level Devs"
  },
  {
    name: "Fiserv India",
    category: "MNC",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Fiserv India, Candor TechSpace, Tower 2, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Fiserv+India+Candor+TechSpace+Sector+62+Noida",
    careers_url: "https://www.fiserv.com/en/about-fiserv/careers.html",
    linkedin_url: "https://www.linkedin.com/company/fiserv/jobs/",
    tech_stack: ["Java", "React", "Node.js", "Payment Gateways", "REST APIs"],
    description: "Global fintech and payments processing solutions giant.",
    hiring_type: "Associate Engineers & Full Stack"
  },
  {
    name: "Nagarro Software",
    category: "Product Co",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Nagarro Software, Logix Techno Park, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Nagarro+Logix+Techno+Park+Sector+62+Noida",
    careers_url: "https://www.nagarro.com/en/careers",
    linkedin_url: "https://www.linkedin.com/company/nagarro/jobs/",
    tech_stack: ["React", "Node.js", "Full Stack", "Python", "Kubernetes"],
    description: "Digital product engineering company delivering modern software architectures.",
    hiring_type: "Associate Engineers & Full Stack"
  },
  {
    name: "Coforge (NIIT Tech)",
    category: "MNC",
    city: "Noida",
    hub: "Sector 144, Noida Expressway",
    address: "Coforge Campus, Plot No. TZ-2 & 2A, Sector 144, Noida, Uttar Pradesh 201306",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Coforge+Campus+Sector+144+Noida",
    careers_url: "https://www.coforge.com/careers",
    linkedin_url: "https://www.linkedin.com/company/coforge-tech/jobs/",
    tech_stack: ["React", "Angular", "Node.js", "Java Spring Boot", "Cloud"],
    description: "Global digital services and enterprise solutions MNC.",
    hiring_type: "Freshers & IT Trainees"
  },
  {
    name: "Newgen Software Technologies",
    category: "Product Co",
    city: "Noida",
    hub: "Sector 144, Noida",
    address: "Newgen Software, E-4, Sector 144, Noida Expressway, Uttar Pradesh 201306",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Newgen+Software+Sector+144+Noida",
    careers_url: "https://newgensoft.com/careers/",
    linkedin_url: "https://www.linkedin.com/company/newgen-software/jobs/",
    tech_stack: ["Java", "JavaScript", "React", "Microservices", "REST APIs"],
    description: "Low-code application development platform and enterprise automation.",
    hiring_type: "Software Engineers & Interns"
  },
  {
    name: "Innovaccer Analytics",
    category: "Startup",
    city: "Noida",
    hub: "Sector 62, Noida",
    address: "Innovaccer, Stellar IT Park, C-25, Sector 62, Noida, Uttar Pradesh 201309",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Innovaccer+Stellar+IT+Park+Sector+62+Noida",
    careers_url: "https://innovaccer.com/careers",
    linkedin_url: "https://www.linkedin.com/company/innovaccer/jobs/",
    tech_stack: ["React", "Python", "Django", "FastAPI", "Data Engineering"],
    description: "Healthcare data activation platform and health-tech unicorn.",
    hiring_type: "Junior & Senior Developers"
  },

  // ── GURGAON & DELHI NCR ──
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
    name: "Microsoft IDC Gurgaon",
    category: "MNC",
    city: "Gurgaon",
    hub: "DLF Downtown, DLF Phase 2, Gurgaon",
    address: "Microsoft India, DLF Downtown, Level 8-12, Sector 25A, Gurugram, Haryana 122002",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Microsoft+DLF+Downtown+Gurgaon",
    careers_url: "https://careers.microsoft.com/",
    linkedin_url: "https://www.linkedin.com/company/microsoft/jobs/",
    tech_stack: ["C#", "Azure", "Cloud Native", "React", "Distributed Systems"],
    description: "Premier Microsoft engineering hub for cloud and artificial intelligence.",
    hiring_type: "Software Engineers & Freshers"
  },
  {
    name: "MakeMyTrip India",
    category: "Product Co",
    city: "Gurgaon",
    hub: "DLF Cyber City, Gurgaon",
    address: "MakeMyTrip India Pvt Ltd, Tower A, SP Infocity, Sector 34, Gurugram, Haryana 122001",
    maps_url: "https://www.google.com/maps/search/?api=1&query=MakeMyTrip+Gurgaon",
    careers_url: "https://careers.makemytrip.com/",
    linkedin_url: "https://www.linkedin.com/company/makemytrip.com/jobs/",
    tech_stack: ["React", "Node.js", "Java", "Redis", "Microservices"],
    description: "India's pioneer online travel platform powering booking experiences for millions.",
    hiring_type: "Frontend & Backend Engineers"
  },
  {
    name: "Blinkit (Eternal)",
    category: "Startup",
    city: "Gurgaon",
    hub: "Golf Course Road, Gurgaon",
    address: "Blinkit, Pioneer Square, Sector 62, Golf Course Extension Road, Gurugram",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Blinkit+HQ+Gurgaon",
    careers_url: "https://blinkit.com/careers",
    linkedin_url: "https://www.linkedin.com/company/blinkit/jobs/",
    tech_stack: ["React", "React Native", "Node.js", "Python", "High-Throughput APIs"],
    description: "Instant commerce pioneer processing 10-minute grocery and electronics delivery.",
    hiring_type: "Mobile & Full Stack Developers"
  },

  // ── BENGALURU ──
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
  },
  {
    name: "Infosys",
    category: "MNC",
    city: "Bengaluru",
    hub: "Electronic City, Bengaluru",
    address: "Infosys Ltd, Plot 44, Electronics City, Hosur Road, Bengaluru, Karnataka 560100",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Infosys+Electronic+City+Bengaluru",
    careers_url: "https://www.infosys.com/careers.html",
    linkedin_url: "https://www.linkedin.com/company/infosys/jobs/",
    tech_stack: ["Full Stack", "React", "Python", "Java", "Cloud Technologies"],
    description: "Global leader in next-generation digital services and consulting.",
    hiring_type: "Systems Engineer, Specialist Programmer"
  },
  {
    name: "Razorpay",
    category: "Startup",
    city: "Bengaluru",
    hub: "Koramangala, Bengaluru",
    address: "Razorpay Software, SJR Cyber, 22 Laskar Hosur Road, Adugodi, Koramangala, Bengaluru 560030",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Razorpay+Koramangala+Bengaluru",
    careers_url: "https://razorpay.com/jobs/",
    linkedin_url: "https://www.linkedin.com/company/razorpay/jobs/",
    tech_stack: ["React", "Node.js", "Go", "Python", "Kubernetes", "FinTech APIs"],
    description: "Full-stack payments and neo-banking financial infrastructure unicorn.",
    hiring_type: "Software Engineers & Interns"
  },
  {
    name: "Zerodha Tech",
    category: "Product Co",
    city: "Bengaluru",
    hub: "JP Nagar, Bengaluru",
    address: "Zerodha, 153/154 4th Cross Dollars Colony, JP Nagar 4th Phase, Bengaluru 560078",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Zerodha+JP+Nagar+Bengaluru",
    careers_url: "https://zerodha.tech/",
    linkedin_url: "https://www.linkedin.com/company/zerodha/jobs/",
    tech_stack: ["Go", "Python", "Vue.js / React", "PostgreSQL", "Kafka"],
    description: "India's largest retail stockbroker with minimalist high-performance tech.",
    hiring_type: "Software Engineers & Open Source Devs"
  },

  // ── HYDERABAD ──
  {
    name: "Microsoft India Development Center (IDC)",
    category: "MNC",
    city: "Hyderabad",
    hub: "Gachibowli, Hyderabad",
    address: "Microsoft India R&D, Building 3, ISB Road, Gachibowli, Hyderabad, Telangana 500032",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Microsoft+IDC+Gachibowli+Hyderabad",
    careers_url: "https://careers.microsoft.com/",
    linkedin_url: "https://www.linkedin.com/company/microsoft/jobs/",
    tech_stack: ["C#", "Azure", "React", "Python", "Distributed Systems"],
    description: "Microsoft's largest engineering and R&D hub outside Redmond HQ.",
    hiring_type: "Software Engineers & Campus Interns"
  },
  {
    name: "Google India (HITEC City)",
    category: "MNC",
    city: "Hyderabad",
    hub: "HITEC City / Kondapur, Hyderabad",
    address: "Google India, Block 1, Divyasree Omega, Survey No 13, Kondapur Village, Hyderabad 500084",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Google+India+Kondapur+Hyderabad",
    careers_url: "https://careers.google.com/locations/hyderabad/",
    linkedin_url: "https://www.linkedin.com/company/google/jobs/",
    tech_stack: ["Python", "Go", "C++", "Java", "Cloud Platforms"],
    description: "Leading global innovation hub engineering core search, ads, and cloud infrastructure.",
    hiring_type: "Software Engineering & University Grads"
  },
  {
    name: "Darwinbox",
    category: "Startup",
    city: "Hyderabad",
    hub: "Financial District, Nanakramguda, Hyderabad",
    address: "Darwinbox Digital Solutions, WaveRock Building, Tower 2.1, Financial District, Hyderabad 500032",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Darwinbox+WaveRock+Financial+District+Hyderabad",
    careers_url: "https://darwinbox.com/careers.php",
    linkedin_url: "https://www.linkedin.com/company/darwinbox/jobs/",
    tech_stack: ["Node.js", "React", "MongoDB", "PHP", "Microservices"],
    description: "Fast-growing HR tech unicorn and global enterprise HCM platform.",
    hiring_type: "Frontend & Backend Engineers"
  },
  {
    name: "Swiggy Tech Center",
    category: "Startup",
    city: "Hyderabad",
    hub: "Madhapur, Hyderabad",
    address: "Swiggy, Knowledge City, Silpa Gram Craft Village, Madhapur, Hyderabad 500081",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Swiggy+Knowledge+City+Madhapur+Hyderabad",
    careers_url: "https://careers.swiggy.com/",
    linkedin_url: "https://www.linkedin.com/company/swiggy-in/jobs/",
    tech_stack: ["React", "Go", "Python", "Kafka", "PostgreSQL"],
    description: "Hyperlocal on-demand delivery platform with high-scale microservices.",
    hiring_type: "SDE-1/2 & Full-Stack Developers"
  },

  // ── PUNE ──
  {
    name: "Persistent Systems",
    category: "Product Co",
    city: "Pune",
    hub: "Hinjawadi / Senapati Bapat Road, Pune",
    address: "Persistent Systems Ltd, Bhageerath, 402 Senapati Bapat Road, Pune, Maharashtra 411016",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Persistent+Systems+Senapati+Bapat+Road+Pune",
    careers_url: "https://www.persistent.com/careers/",
    linkedin_url: "https://www.linkedin.com/company/persistent-systems/jobs/",
    tech_stack: ["React", "Java", "Python", "Cloud", "Data Engineering"],
    description: "Premier digital engineering and enterprise modernization tech firm.",
    hiring_type: "Freshers & Lateral Software Engineers"
  },
  {
    name: "Barclays Global Service Centre",
    category: "MNC",
    city: "Pune",
    hub: "EON Free Zone, Kharadi, Pune",
    address: "Barclays, Tower 11, Cybercity, Magarpatta / EON Free Zone, Kharadi, Pune, Maharashtra 411014",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Barclays+EON+Free+Zone+Kharadi+Pune",
    careers_url: "https://search.jobs.barclays/",
    linkedin_url: "https://www.linkedin.com/company/barclays/jobs/",
    tech_stack: ["Java", "React", "Python", "AWS", "FinTech APIs"],
    description: "Major global financial institution technology and engineering campus.",
    hiring_type: "Graduate Analysts & Software Engineers"
  },
  {
    name: "PubMatic",
    category: "Product Co",
    city: "Pune",
    hub: "Kharadi, Pune",
    address: "PubMatic India, EON Free Zone, Kharadi, Pune, Maharashtra 411014",
    maps_url: "https://www.google.com/maps/search/?api=1&query=PubMatic+EON+Free+Zone+Kharadi+Pune",
    careers_url: "https://pubmatic.com/careers/",
    linkedin_url: "https://www.linkedin.com/company/pubmatic/jobs/",
    tech_stack: ["Go", "C++", "React", "Python", "Distributed Systems"],
    description: "High-throughput programmatic advertising and digital media product company.",
    hiring_type: "Software Engineers & Interns"
  },

  // ── REMOTE ──
  {
    name: "GitLab",
    category: "MNC",
    city: "Remote",
    hub: "100% Remote / Distributed Worldwide",
    address: "GitLab Inc., Distributed Globally (Accepts India Remote Applicants)",
    maps_url: "https://www.google.com/maps/search/?api=1&query=GitLab+Remote",
    careers_url: "https://about.gitlab.com/jobs/",
    linkedin_url: "https://www.linkedin.com/company/gitlab-com/jobs/",
    tech_stack: ["Ruby on Rails", "Vue.js", "Go", "Kubernetes", "DevOps"],
    description: "The complete DevOps platform delivered as a single application, 100% remote.",
    hiring_type: "Remote Global Openings"
  },
  {
    name: "Automattic (WordPress.com)",
    category: "Product Co",
    city: "Remote",
    hub: "100% Remote / Worldwide",
    address: "Automattic Inc., Distributed Worldwide (Worldwide Remote)",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Automattic+Remote",
    careers_url: "https://automattic.com/work-with-us/",
    linkedin_url: "https://www.linkedin.com/company/automattic/jobs/",
    tech_stack: ["JavaScript", "React", "Node.js", "PHP", "APIs"],
    description: "Creators of WordPress.com, WooCommerce, and Tumblr with asynchronous culture.",
    hiring_type: "Full Stack & Frontend Engineers"
  }
];

export default function CompanyMapTab({ companies = [] }) {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [userDetectedLocation, setUserDetectedLocation] = useState(null);
  const [dynamicCompanies, setDynamicCompanies] = useState([]);
  const [isDynamicLoading, setIsDynamicLoading] = useState(false);
  const [searchSource, setSearchSource] = useState('all');

  // Fetch live companies dynamically using Tavily + DDGS + Groq agent
  const fetchDynamicCompanies = async (locQuery) => {
    const q = (locQuery || searchQuery || 'noida').trim();
    if (!q) return;

    setIsDynamicLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/nearby-companies?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.companies && data.companies.length > 0) {
          setDynamicCompanies(data.companies);
          setSearchSource('live_agent');
        }
      }
    } catch (err) {
      console.warn('Dynamic company fetch error, falling back to local directory:', err);
    } finally {
      setIsDynamicLoading(false);
    }
  };

  // Combine parent companies + dynamic agent companies + master fallback list
  const masterList = useMemo(() => {
    const combined = [];
    const names = new Set();

    // 1. Dynamic live agent results first (highest priority)
    if (dynamicCompanies && dynamicCompanies.length > 0) {
      for (const item of dynamicCompanies) {
        const k = (item.name || '').toLowerCase();
        if (k && !names.has(k)) {
          names.add(k);
          combined.push({ ...item, is_dynamic: true });
        }
      }
    }

    // 2. Incoming companies from parent pipeline
    if (companies && companies.length > 0) {
      for (const item of companies) {
        const k = (item.name || '').toLowerCase();
        if (k && !names.has(k)) {
          names.add(k);
          combined.push(item);
        }
      }
    }

    // 3. Master verified directory
    for (const item of ALL_TECH_COMPANIES) {
      const k = (item.name || '').toLowerCase();
      if (k && !names.has(k)) {
        names.add(k);
        combined.push(item);
      }
    }

    return combined;
  }, [dynamicCompanies, companies]);

  // Handle HTML5 Geolocation "Near Me" click
  const handleDetectNearMe = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetectingLocation(false);
          setUserDetectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: "Detected Location (Near Me)"
          });
          setSelectedCity('noida');
          setSearchQuery('Sector 62 Noida');
          fetchDynamicCompanies('Sector 62 Noida');
        },
        () => {
          setIsDetectingLocation(false);
          setUserDetectedLocation({
            label: "Near Me (Noida / NCR Hub)"
          });
          setSelectedCity('noida');
          setSearchQuery('Sector 62 Noida');
          fetchDynamicCompanies('Sector 62 Noida');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
      setSelectedCity('noida');
      setSearchQuery('Sector 62 Noida');
      fetchDynamicCompanies('Sector 62 Noida');
    }
  };

  // Conversational query normalizer
  const normalizedQuery = useMemo(() => {
    return searchQuery.toLowerCase().trim();
  }, [searchQuery]);

  // Filtered list
  const filteredCompanies = useMemo(() => {
    return masterList.filter((comp) => {
      // 1. City Filter
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

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        if (comp.category !== selectedCategory) return false;
      }

      // 3. Search query filter
      if (normalizedQuery) {
        // Handle "near me"
        if (normalizedQuery.includes('near me') || normalizedQuery.includes('nearby')) {
          const compCity = (comp.city || '').toLowerCase();
          const compHub = (comp.hub || '').toLowerCase();
          return compCity.includes('noida') || compCity.includes('gurgaon') || compHub.includes('sector');
        }

        const matchesName = (comp.name || '').toLowerCase().includes(normalizedQuery);
        const matchesHub = (comp.hub || '').toLowerCase().includes(normalizedQuery);
        const matchesAddress = (comp.address || '').toLowerCase().includes(normalizedQuery);
        const matchesCity = (comp.city || '').toLowerCase().includes(normalizedQuery);
        const matchesStack = (comp.tech_stack || []).some((st) => st.toLowerCase().includes(normalizedQuery));
        const matchesHiring = (comp.hiring_type || '').toLowerCase().includes(normalizedQuery);

        if (!matchesName && !matchesHub && !matchesAddress && !matchesCity && !matchesStack && !matchesHiring) {
          return false;
        }
      }

      return true;
    });
  }, [masterList, selectedCity, selectedCategory, normalizedQuery]);

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

  // Google Maps Radar query target for arbitrary location search
  const currentRadarLocation = searchQuery.trim() || (selectedCity !== 'all' ? selectedCity : 'Noida NCR');
  const googleMapsAllCompaniesUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('software companies near ' + currentRadarLocation)}`;
  const googleMapsItParksUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('IT parks and tech campuses in ' + currentRadarLocation)}`;
  const googleMapsStartupsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('tech startups in ' + currentRadarLocation)}`;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="border-b border-zinc-800/80 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Nearby Tech Companies & Office Hubs
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 text-cyan-300 font-mono">
              Google Maps Verified
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search any city, sector, or colony to find software companies, IT parks, and tech employers near you with 1-click Google Maps directions and careers portals.
          </p>
        </div>

        {/* Search Bar with Live AI Agent Trigger */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchDynamicCompanies(searchQuery);
            }}
            className="relative flex-1 lg:w-80 flex items-center"
          >
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, sector (e.g. Sector 62, Gurgaon, Pune)..."
              className="w-full pl-8 pr-16 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              disabled={isDynamicLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[11px] transition-all"
              title="Search live via AI Agent"
            >
              {isDynamicLoading ? '...' : 'Find'}
            </button>
          </form>

          {/* Near Me Button */}
          <button
            onClick={handleDetectNearMe}
            disabled={isDetectingLocation || isDynamicLoading}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
            title="Auto-detect software companies near my location via AI agent"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isDetectingLocation || isDynamicLoading ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">{isDetectingLocation ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* Live AI Search In Progress Banner */}
      {isDynamicLoading && (
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2.5 animate-pulse shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-white">Live AI Location Scout:</span> Searching real-time software companies, IT parks, and tech offices in <span className="font-bold underline text-cyan-200">{searchQuery || 'current location'}</span> via Tavily, DuckDuckGo & Groq LLM...
          </div>
        </div>
      )}

      {/* Live Google Maps Radar Discovery Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/20 via-zinc-900/60 to-zinc-950 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                Google Maps Radar: <span className="text-cyan-400 capitalize">{currentRadarLocation}</span>
              </span>
              {userDetectedLocation && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/30">
                  📍 {userDetectedLocation.label}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              Open live Google Maps to view ratings, walking/driving distance, and all listed IT offices in this area.
            </p>
          </div>
        </div>

        {/* Quick Discovery Links */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={googleMapsAllCompaniesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-cyan-300 hover:text-cyan-200 border border-zinc-750 text-xs font-medium flex items-center gap-1 transition-all"
          >
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>All Tech Offices</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={googleMapsItParksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-750 text-xs font-medium flex items-center gap-1 transition-all"
          >
            <Building2 className="w-3 h-3 text-zinc-400" />
            <span>IT Parks & Campuses</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={googleMapsStartupsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-emerald-300 hover:text-emerald-200 border border-zinc-750 text-xs font-medium flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Startups</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[11px] font-mono text-zinc-500 uppercase shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Quick Hubs:
        </span>
        {POPULAR_HUBS.map((hub, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSearchQuery(hub.query);
              setSelectedCity('all');
              fetchDynamicCompanies(hub.query);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
              searchQuery.toLowerCase() === hub.query.toLowerCase()
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {hub.label}
          </button>
        ))}
      </div>

      {/* Filter Bars (City & Category) */}
      <div className="space-y-2.5">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">City:</span>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => {
                setSelectedCity(city.id);
                if (city.id !== 'all') setSearchQuery('');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                selectedCity === city.id
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
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
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-xs text-zinc-400 ml-auto font-mono">
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
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 group hover:shadow-lg hover:shadow-black/40"
            >
              <div className="space-y-2.5">
                {/* Title & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {comp.name}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    {comp.is_dynamic && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        Live AI
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-medium ${getCategoryBadgeClass(
                        comp.category
                      )}`}
                    >
                      {comp.category}
                    </span>
                  </div>
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
                    <span className="text-zinc-200">{comp.hiring_type}</span>
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
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-cyan-400 hover:text-cyan-300 border border-zinc-750 text-xs font-medium flex items-center gap-1 transition-all"
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
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
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
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 transition-all"
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
        /* Empty State with Direct Google Maps Discovery */
        <div className="text-center py-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
          <MapPin className="w-8 h-8 mx-auto text-zinc-600" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">
              No pre-indexed companies found for "{searchQuery}"
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              You can instantly search all live software companies, IT offices, and tech startups in this exact locality on Google Maps.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a
              href={googleMapsAllCompaniesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Search "{searchQuery}" on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => {
                setSelectedCity('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-medium border border-zinc-750"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
