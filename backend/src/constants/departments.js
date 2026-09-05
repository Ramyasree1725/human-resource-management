/**
 * Department Constants and Metadata
 * Extensive list of departments with detailed descriptions, codes, and hierarchy information
 * This file is intentionally large to support comprehensive employee management features
 */

const DEPARTMENTS = {
  ENGINEERING: {
    id: 'dept_eng_001',
    code: 'ENG',
    name: 'Engineering',
    fullName: 'Software Engineering and Technology Development',
    description: 'Responsible for software development, system architecture, infrastructure, quality assurance, DevOps, and technical innovation across all product lines. Handles backend services, frontend applications, mobile platforms, cloud infrastructure, and emerging technologies research.',
    headTitle: 'Chief Technology Officer',
    budgetCode: 'BUD-ENG-2026',
    location: 'Building A - Floors 3 to 7',
    costCenter: 'CC-1001',
    employeeCountTarget: 450,
    subDepartments: [
      { id: 'sub_eng_be', name: 'Backend Engineering', code: 'ENG-BE', focus: 'API development, microservices, databases, scalability' },
      { id: 'sub_eng_fe', name: 'Frontend Engineering', code: 'ENG-FE', focus: 'User interfaces, React/Vue applications, accessibility, performance' },
      { id: 'sub_eng_mobile', name: 'Mobile Engineering', code: 'ENG-MOB', focus: 'iOS, Android, cross-platform solutions, app store releases' },
      { id: 'sub_eng_qa', name: 'Quality Assurance', code: 'ENG-QA', focus: 'Test automation, manual testing, performance testing, security testing' },
      { id: 'sub_eng_devops', name: 'DevOps & SRE', code: 'ENG-DEVOPS', focus: 'CI/CD, infrastructure as code, monitoring, incident response' },
      { id: 'sub_eng_arch', name: 'Architecture', code: 'ENG-ARCH', focus: 'System design, technical strategy, standards, reviews' },
      { id: 'sub_eng_data', name: 'Data Engineering', code: 'ENG-DATA', focus: 'ETL pipelines, data warehouses, analytics infrastructure' },
      { id: 'sub_eng_sec', name: 'Security Engineering', code: 'ENG-SEC', focus: 'Application security, penetration testing, compliance, threat modeling' }
    ],
    skillsRequired: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'React', 'Node.js',
      'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'PostgreSQL', 'MongoDB',
      'Redis', 'Kafka', 'GraphQL', 'REST APIs', 'Microservices', 'System Design',
      'CI/CD', 'Monitoring', 'Logging', 'Security Best Practices', 'Agile Methodologies'
    ],
    performanceMetrics: [
      'Sprint velocity', 'Code quality scores', 'Bug escape rate', 'Deployment frequency',
      'Mean time to recovery', 'System uptime', 'API response times', 'Test coverage percentage'
    ]
  },
  HUMAN_RESOURCES: {
    id: 'dept_hr_001',
    code: 'HR',
    name: 'Human Resources',
    fullName: 'People Operations and Human Resources Management',
    description: 'Manages the complete employee lifecycle including recruitment, onboarding, performance management, learning and development, compensation and benefits, employee relations, compliance, diversity and inclusion initiatives, and organizational culture development.',
    headTitle: 'Chief People Officer',
    budgetCode: 'BUD-HR-2026',
    location: 'Building B - Floor 2',
    costCenter: 'CC-2001',
    employeeCountTarget: 85,
    subDepartments: [
      { id: 'sub_hr_ta', name: 'Talent Acquisition', code: 'HR-TA', focus: 'Recruiting, sourcing, interviewing, employer branding' },
      { id: 'sub_hr_ops', name: 'HR Operations', code: 'HR-OPS', focus: 'Onboarding, offboarding, HRIS, employee records' },
      { id: 'sub_hr_ld', name: 'Learning & Development', code: 'HR-LD', focus: 'Training programs, career development, leadership training' },
      { id: 'sub_hr_comp', name: 'Compensation & Benefits', code: 'HR-COMP', focus: 'Salary bands, equity, benefits administration, payroll coordination' },
      { id: 'sub_hr_er', name: 'Employee Relations', code: 'HR-ER', focus: 'Conflict resolution, investigations, engagement, retention' },
      { id: 'sub_hr_dei', name: 'Diversity Equity Inclusion', code: 'HR-DEI', focus: 'DEI programs, inclusive hiring, employee resource groups' }
    ],
    skillsRequired: [
      'HR Policies', 'Employment Law', 'Recruitment', 'Interviewing', 'Performance Management',
      'Compensation Analysis', 'Benefits Administration', 'Conflict Resolution', 'Coaching',
      'HRIS Systems', 'Data Analytics', 'Communication', 'Empathy', 'Confidentiality',
      'Organizational Development', 'Change Management', 'Talent Management'
    ],
    performanceMetrics: [
      'Time to fill', 'Offer acceptance rate', 'Employee satisfaction score', 'Turnover rate',
      'Training completion rates', 'Internal mobility rate', 'Diversity hiring metrics', 'Engagement scores'
    ]
  },
  FINANCE: {
    id: 'dept_fin_001',
    code: 'FIN',
    name: 'Finance',
    fullName: 'Finance, Accounting and Financial Planning',
    description: 'Oversees all financial operations including accounting, financial planning and analysis, budgeting, treasury, tax, audit, accounts payable and receivable, financial reporting, investor relations support, and strategic financial guidance for business decisions.',
    headTitle: 'Chief Financial Officer',
    budgetCode: 'BUD-FIN-2026',
    location: 'Building B - Floor 4',
    costCenter: 'CC-3001',
    employeeCountTarget: 120,
    subDepartments: [
      { id: 'sub_fin_acc', name: 'Accounting', code: 'FIN-ACC', focus: 'General ledger, financial statements, month-end close, compliance' },
      { id: 'sub_fin_fpa', name: 'Financial Planning & Analysis', code: 'FIN-FPA', focus: 'Budgeting, forecasting, variance analysis, business partnering' },
      { id: 'sub_fin_treas', name: 'Treasury', code: 'FIN-TREAS', focus: 'Cash management, banking, investments, risk management' },
      { id: 'sub_fin_tax', name: 'Tax', code: 'FIN-TAX', focus: 'Tax compliance, planning, transfer pricing, audits' },
      { id: 'sub_fin_ap', name: 'Accounts Payable', code: 'FIN-AP', focus: 'Vendor payments, invoice processing, expense management' },
      { id: 'sub_fin_ar', name: 'Accounts Receivable', code: 'FIN-AR', focus: 'Customer billing, collections, credit management' }
    ],
    skillsRequired: [
      'Financial Accounting', 'GAAP', 'IFRS', 'Financial Modeling', 'Excel Advanced',
      'Budgeting', 'Forecasting', 'Variance Analysis', 'ERP Systems', 'SAP', 'Oracle',
      'Tax Knowledge', 'Audit', 'Internal Controls', 'Treasury Management', 'Analytical Skills'
    ],
    performanceMetrics: [
      'Close cycle time', 'Forecast accuracy', 'Budget variance', 'Days sales outstanding',
      'Cash conversion cycle', 'Audit findings', 'Cost savings identified', 'Process automation rate'
    ]
  },
  SALES: {
    id: 'dept_sales_001',
    code: 'SALES',
    name: 'Sales',
    fullName: 'Sales and Revenue Generation',
    description: 'Drives revenue growth through customer acquisition, account management, pipeline development, sales strategy execution, partnership development, and market expansion across enterprise, mid-market, and SMB segments.',
    headTitle: 'Chief Revenue Officer',
    budgetCode: 'BUD-SALES-2026',
    location: 'Building C - Floors 1 to 3',
    costCenter: 'CC-4001',
    employeeCountTarget: 280,
    subDepartments: [
      { id: 'sub_sales_ent', name: 'Enterprise Sales', code: 'SALES-ENT', focus: 'Large enterprise accounts, complex deals, strategic selling' },
      { id: 'sub_sales_mm', name: 'Mid-Market Sales', code: 'SALES-MM', focus: 'Mid-sized company acquisitions and growth' },
      { id: 'sub_sales_smb', name: 'SMB Sales', code: 'SALES-SMB', focus: 'Small business volume sales, high velocity' },
      { id: 'sub_sales_cs', name: 'Customer Success', code: 'SALES-CS', focus: 'Retention, expansion, onboarding, health scores' },
      { id: 'sub_sales_se', name: 'Sales Engineering', code: 'SALES-SE', focus: 'Technical demos, proof of concepts, solution design' },
      { id: 'sub_sales_ops', name: 'Sales Operations', code: 'SALES-OPS', focus: 'CRM, process optimization, analytics, enablement' }
    ],
    skillsRequired: [
      'Consultative Selling', 'Negotiation', 'CRM (Salesforce)', 'Pipeline Management',
      'Account Planning', 'Presentation Skills', 'Product Knowledge', 'Objection Handling',
      'Forecasting', 'Relationship Building', 'Business Acumen', 'Closing Techniques'
    ],
    performanceMetrics: [
      'Quota attainment', 'Pipeline coverage', 'Win rate', 'Average deal size',
      'Sales cycle length', 'Customer acquisition cost', 'Net revenue retention', 'Churn rate'
    ]
  },
  MARKETING: {
    id: 'dept_mkt_001',
    code: 'MKT',
    name: 'Marketing',
    fullName: 'Marketing, Brand and Demand Generation',
    description: 'Builds brand awareness, generates demand, creates content, manages digital channels, runs campaigns, analyzes marketing performance, supports product launches, and drives market positioning and competitive intelligence.',
    headTitle: 'Chief Marketing Officer',
    budgetCode: 'BUD-MKT-2026',
    location: 'Building C - Floor 5',
    costCenter: 'CC-5001',
    employeeCountTarget: 95,
    subDepartments: [
      { id: 'sub_mkt_brand', name: 'Brand Marketing', code: 'MKT-BRAND', focus: 'Brand strategy, messaging, visual identity, storytelling' },
      { id: 'sub_mkt_demand', name: 'Demand Generation', code: 'MKT-DEMAND', focus: 'Lead generation, campaigns, nurture programs, events' },
      { id: 'sub_mkt_content', name: 'Content Marketing', code: 'MKT-CONTENT', focus: 'Blog, whitepapers, videos, SEO content, case studies' },
      { id: 'sub_mkt_digital', name: 'Digital Marketing', code: 'MKT-DIGITAL', focus: 'Paid media, SEO, social, email, website optimization' },
      { id: 'sub_mkt_prod', name: 'Product Marketing', code: 'MKT-PROD', focus: 'Positioning, competitive analysis, launch planning, enablement' },
      { id: 'sub_mkt_ops', name: 'Marketing Operations', code: 'MKT-OPS', focus: 'Martech stack, analytics, attribution, process' }
    ],
    skillsRequired: [
      'Brand Strategy', 'Content Creation', 'SEO', 'SEM', 'Social Media Marketing',
      'Email Marketing', 'Marketing Automation', 'Analytics (Google Analytics)', 'Copywriting',
      'Campaign Management', 'A/B Testing', 'Graphic Design Basics', 'Storytelling'
    ],
    performanceMetrics: [
      'Marketing qualified leads', 'Cost per lead', 'Conversion rates', 'Brand awareness scores',
      'Website traffic', 'Engagement rates', 'Campaign ROI', 'Pipeline influenced'
    ]
  },
  PRODUCT: {
    id: 'dept_prod_001',
    code: 'PROD',
    name: 'Product',
    fullName: 'Product Management and Strategy',
    description: 'Defines product vision, strategy, and roadmap. Conducts user research, prioritizes features, works closely with engineering and design, manages product lifecycle, analyzes product metrics, and ensures products deliver customer and business value.',
    headTitle: 'Chief Product Officer',
    budgetCode: 'BUD-PROD-2026',
    location: 'Building A - Floor 2',
    costCenter: 'CC-6001',
    employeeCountTarget: 65,
    subDepartments: [
      { id: 'sub_prod_mgmt', name: 'Product Management', code: 'PROD-MGMT', focus: 'Roadmap, prioritization, stakeholder management, discovery' },
      { id: 'sub_prod_design', name: 'Product Design', code: 'PROD-DESIGN', focus: 'UX research, UI design, prototyping, design systems' },
      { id: 'sub_prod_research', name: 'User Research', code: 'PROD-RES', focus: 'User interviews, usability testing, surveys, insights' },
      { id: 'sub_prod_analytics', name: 'Product Analytics', code: 'PROD-ANALYTICS', focus: 'Metrics, experimentation, data-informed decisions' }
    ],
    skillsRequired: [
      'Product Strategy', 'Roadmapping', 'User Research', 'Prioritization Frameworks',
      'Agile/Scrum', 'Data Analysis', 'A/B Testing', 'Wireframing', 'Stakeholder Management',
      'Technical Understanding', 'Market Analysis', 'Customer Empathy', 'Communication'
    ],
    performanceMetrics: [
      'Feature adoption rates', 'User satisfaction (NPS/CSAT)', 'Time to market',
      'Product revenue contribution', 'Experimentation velocity', 'Roadmap delivery rate'
    ]
  },
  OPERATIONS: {
    id: 'dept_ops_001',
    code: 'OPS',
    name: 'Operations',
    fullName: 'Business Operations and Administration',
    description: 'Ensures smooth day-to-day operations including facilities management, procurement, vendor management, office administration, business process optimization, legal coordination, compliance support, and internal tools and systems management.',
    headTitle: 'Chief Operating Officer',
    budgetCode: 'BUD-OPS-2026',
    location: 'Building B - Floor 1',
    costCenter: 'CC-7001',
    employeeCountTarget: 70,
    subDepartments: [
      { id: 'sub_ops_fac', name: 'Facilities', code: 'OPS-FAC', focus: 'Office space, maintenance, security, workplace experience' },
      { id: 'sub_ops_proc', name: 'Procurement', code: 'OPS-PROC', focus: 'Vendor selection, contracts, purchasing, cost optimization' },
      { id: 'sub_ops_admin', name: 'Administration', code: 'OPS-ADMIN', focus: 'Office management, travel, events, executive support' },
      { id: 'sub_ops_legal', name: 'Legal Coordination', code: 'OPS-LEGAL', focus: 'Contract review support, compliance, policy' }
    ],
    skillsRequired: [
      'Process Optimization', 'Vendor Management', 'Contract Negotiation', 'Project Management',
      'Budget Management', 'Facilities Knowledge', 'Communication', 'Organization',
      'Problem Solving', 'Attention to Detail', 'Stakeholder Management'
    ],
    performanceMetrics: [
      'Operational efficiency scores', 'Cost savings', 'Vendor performance', 'Employee workplace satisfaction',
      'Process cycle times', 'Compliance audit results'
    ]
  },
  CUSTOMER_SUPPORT: {
    id: 'dept_cs_001',
    code: 'CS',
    name: 'Customer Support',
    fullName: 'Customer Support and Success Operations',
    description: 'Provides world-class customer support through multiple channels, resolves technical and product issues, manages escalations, maintains knowledge bases, measures customer satisfaction, and feeds insights back to product and engineering teams.',
    headTitle: 'VP of Customer Experience',
    budgetCode: 'BUD-CS-2026',
    location: 'Building D - Floors 1 to 2',
    costCenter: 'CC-8001',
    employeeCountTarget: 180,
    subDepartments: [
      { id: 'sub_cs_l1', name: 'Tier 1 Support', code: 'CS-L1', focus: 'First response, common issues, ticket triage' },
      { id: 'sub_cs_l2', name: 'Tier 2 Support', code: 'CS-L2', focus: 'Complex technical issues, advanced troubleshooting' },
      { id: 'sub_cs_l3', name: 'Tier 3 / Escalations', code: 'CS-L3', focus: 'Critical issues, engineering collaboration, root cause' },
      { id: 'sub_cs_kb', name: 'Knowledge Management', code: 'CS-KB', focus: 'Help center, documentation, training materials' }
    ],
    skillsRequired: [
      'Customer Service', 'Technical Troubleshooting', 'Product Knowledge', 'Communication',
      'Empathy', 'Ticketing Systems (Zendesk/Freshdesk)', 'Problem Solving', 'Patience',
      'Documentation', 'Escalation Management', 'Time Management'
    ],
    performanceMetrics: [
      'First response time', 'Resolution time', 'Customer satisfaction (CSAT)', 'Ticket volume',
      'First contact resolution rate', 'Escalation rate', 'Knowledge base usage'
    ]
  },
  LEGAL: {
    id: 'dept_legal_001',
    code: 'LEGAL',
    name: 'Legal',
    fullName: 'Legal Affairs and Compliance',
    description: 'Provides legal counsel on commercial contracts, intellectual property, employment matters, corporate governance, regulatory compliance, litigation management, data privacy, and risk mitigation across all business activities.',
    headTitle: 'General Counsel',
    budgetCode: 'BUD-LEGAL-2026',
    location: 'Building B - Floor 5',
    costCenter: 'CC-9001',
    employeeCountTarget: 25,
    subDepartments: [
      { id: 'sub_legal_comm', name: 'Commercial Legal', code: 'LEGAL-COMM', focus: 'Contracts, partnerships, vendor agreements' },
      { id: 'sub_legal_ip', name: 'Intellectual Property', code: 'LEGAL-IP', focus: 'Patents, trademarks, copyrights, trade secrets' },
      { id: 'sub_legal_emp', name: 'Employment Legal', code: 'LEGAL-EMP', focus: 'Employment agreements, disputes, policies' },
      { id: 'sub_legal_comp', name: 'Compliance & Privacy', code: 'LEGAL-COMP', focus: 'GDPR, CCPA, regulatory compliance, audits' }
    ],
    skillsRequired: [
      'Contract Law', 'Corporate Law', 'Intellectual Property', 'Employment Law',
      'Data Privacy Regulations', 'Negotiation', 'Risk Assessment', 'Legal Research',
      'Litigation Management', 'Regulatory Knowledge'
    ],
    performanceMetrics: [
      'Contract turnaround time', 'Legal risk incidents', 'Compliance audit scores',
      'Litigation outcomes', 'Policy adoption rates'
    ]
  },
  RESEARCH: {
    id: 'dept_res_001',
    code: 'RES',
    name: 'Research & Innovation',
    fullName: 'Research, Innovation and Advanced Technology',
    description: 'Explores emerging technologies, conducts applied research, prototypes new ideas, collaborates with academic institutions, files patents, and helps translate research breakthroughs into product opportunities and competitive advantages.',
    headTitle: 'Chief Research Officer',
    budgetCode: 'BUD-RES-2026',
    location: 'Building A - Floor 8 (Innovation Lab)',
    costCenter: 'CC-10001',
    employeeCountTarget: 40,
    subDepartments: [
      { id: 'sub_res_ai', name: 'AI Research', code: 'RES-AI', focus: 'Machine learning, deep learning, generative AI, NLP' },
      { id: 'sub_res_sys', name: 'Systems Research', code: 'RES-SYS', focus: 'Distributed systems, performance, novel architectures' },
      { id: 'sub_res_proto', name: 'Prototyping', code: 'RES-PROTO', focus: 'Rapid prototyping, proof of concepts, demos' }
    ],
    skillsRequired: [
      'Research Methodology', 'Machine Learning', 'Deep Learning', 'Statistics',
      'Python', 'Academic Writing', 'Experiment Design', 'Patent Knowledge',
      'Collaboration', 'Creativity', 'Critical Thinking'
    ],
    performanceMetrics: [
      'Research papers published', 'Patents filed', 'Prototypes delivered',
      'Technology transfer success', 'External collaborations'
    ]
  }
};

const DEPARTMENT_LIST = Object.values(DEPARTMENTS);

const DEPARTMENT_CODES = Object.keys(DEPARTMENTS).reduce((acc, key) => {
  acc[DEPARTMENTS[key].code] = DEPARTMENTS[key];
  return acc;
}, {});

const DEPARTMENT_IDS = Object.keys(DEPARTMENTS).reduce((acc, key) => {
  acc[DEPARTMENTS[key].id] = DEPARTMENTS[key];
  return acc;
}, {});

const ALL_SUB_DEPARTMENTS = DEPARTMENT_LIST.flatMap(dept => 
  (dept.subDepartments || []).map(sub => ({
    ...sub,
    parentDepartmentId: dept.id,
    parentDepartmentName: dept.name,
    parentDepartmentCode: dept.code
  }))
);

const DEPARTMENT_HIERARCHY = DEPARTMENT_LIST.map(dept => ({
  id: dept.id,
  name: dept.name,
  code: dept.code,
  children: (dept.subDepartments || []).map(s => ({
    id: s.id,
    name: s.name,
    code: s.code
  }))
}));

function getDepartmentById(id) {
  return DEPARTMENT_IDS[id] || null;
}

function getDepartmentByCode(code) {
  return DEPARTMENT_CODES[code] || null;
}

function getSubDepartmentById(id) {
  return ALL_SUB_DEPARTMENTS.find(s => s.id === id) || null;
}

function getDepartmentsForSelect() {
  return DEPARTMENT_LIST.map(d => ({
    value: d.id,
    label: d.name,
    code: d.code,
    employeeCountTarget: d.employeeCountTarget
  }));
}

function getAllSkillsAcrossDepartments() {
  const skillsSet = new Set();
  DEPARTMENT_LIST.forEach(dept => {
    (dept.skillsRequired || []).forEach(skill => skillsSet.add(skill));
  });
  return Array.from(skillsSet).sort();
}

function getDepartmentPerformanceMetrics(deptId) {
  const dept = getDepartmentById(deptId);
  return dept ? dept.performanceMetrics : [];
}

module.exports = {
  DEPARTMENTS,
  DEPARTMENT_LIST,
  DEPARTMENT_CODES,
  DEPARTMENT_IDS,
  ALL_SUB_DEPARTMENTS,
  DEPARTMENT_HIERARCHY,
  getDepartmentById,
  getDepartmentByCode,
  getSubDepartmentById,
  getDepartmentsForSelect,
  getAllSkillsAcrossDepartments,
  getDepartmentPerformanceMetrics
};
