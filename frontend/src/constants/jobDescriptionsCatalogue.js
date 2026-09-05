/**
 * Comprehensive Job Descriptions & Career Competency Catalogue
 * Defines organizational job families, levels (IC1 to IC6 / M1 to M4),
 * core responsibilities, key performance indicators (KPIs), and skill benchmarks.
 */

export const JOB_LEVELS_FRAMEWORK = {
  IC1: { code: 'IC1', band: 'Associate / Junior', expRangeYears: '0 - 2 Years', expectations: 'Executes defined tasks under supervision; learning core domain workflows.' },
  IC2: { code: 'IC2', band: 'Mid-Level Specialist', expRangeYears: '2 - 5 Years', expectations: 'Autonomous execution of complex deliverables; participates in technical design reviews.' },
  IC3: { code: 'IC3', band: 'Senior Specialist', expRangeYears: '5 - 8 Years', expectations: 'Domain authority; drives end-to-end project architecture and cross-team collaboration.' },
  IC4: { code: 'IC4', band: 'Staff / Lead Specialist', expRangeYears: '8 - 12 Years', expectations: 'Sets organizational standards; leads high-impact architecture and mentors talent.' },
  IC5: { code: 'IC5', band: 'Principal Specialist', expRangeYears: '12 - 16 Years', expectations: 'Strategic technical leadership; influences company-wide product & technology roadmap.' },
  IC6: { code: 'IC6', band: 'Distinguished Fellow', expRangeYears: '16+ Years', expectations: 'Industry luminary; shapes multi-year research and breakthrough innovations.' },
  M1: { code: 'M1', band: 'Team Lead / Associate Manager', expRangeYears: '5 - 8 Years', expectations: 'Day-to-day sprint delivery, 1-on-1 coaching, and operational project tracking.' },
  M2: { code: 'M2', band: 'Engineering / Department Manager', expRangeYears: '8 - 12 Years', expectations: 'Quarterly roadmap execution, hiring, performance reviews, and budget calibration.' },
  M3: { code: 'M3', band: 'Director / Head of Division', expRangeYears: '12 - 16 Years', expectations: 'Strategic business unit leadership, P&L ownership, and executive stakeholder alignment.' },
  M4: { code: 'M4', band: 'Vice President / Executive Officer', expRangeYears: '16+ Years', expectations: 'Enterprise strategy, board governance, organizational culture and investor relations.' }
};

export const JOB_DESCRIPTIONS_CATALOGUE = [
  {
    roleId: 'role_eng_lead',
    title: 'Lead Software Engineer',
    department: 'Engineering',
    level: 'IC4',
    summary: 'Architects distributed enterprise cloud systems, leads code reviews, and sets software engineering excellence standards.',
    keyResponsibilities: [
      'Architect highly scalable microservices handling millions of transactional events daily.',
      'Establish CI/CD deployment pipelines, automated test suites, and zero-downtime release strategies.',
      'Lead cross-functional engineering pods with product managers, QA, and security auditors.',
      'Conduct rigorous system design reviews and optimize database queries for low-latency query throughput.'
    ],
    technicalSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'System Architecture'],
    kpiMetrics: ['System Uptime > 99.95%', 'P99 Latency < 120ms', 'Code Review Turnaround < 24 Hours', 'Sprint Velocity Stability']
  },
  {
    roleId: 'role_prod_pm',
    title: 'Principal Product Manager',
    department: 'Product',
    level: 'IC5',
    summary: 'Defines multi-year product roadmap, translates customer insights into PRDs, and drives metrics-driven feature adoption.',
    keyResponsibilities: [
      'Define product vision, competitive differentiation, and quarterly OKR milestones.',
      'Synthesize customer interviews, NPS telemetry, and usage funnels to build high-ROI product features.',
      'Collaborate with UX researchers to design frictionless enterprise user workflows.',
      'Manage product backlog prioritization utilizing RICE (Reach, Impact, Confidence, Effort) scoring.'
    ],
    technicalSkills: ['Product Strategy', 'UI/UX Design', 'User Research', 'SQL Analytics', 'Figma', 'A/B Testing', 'Roadmap Planning'],
    kpiMetrics: ['Monthly Active Users (MAU) Growth', 'Feature Adoption Rate > 65%', 'Net Promoter Score (NPS) > 60', 'On-Time Release Index']
  },
  {
    roleId: 'role_hr_bp',
    title: 'Senior HR Business Partner',
    department: 'Human Resources',
    level: 'IC3',
    summary: 'Strategic talent advisor to engineering and business leadership, managing performance cycles and employee engagement.',
    keyResponsibilities: [
      'Partner with department heads to execute headcount forecasting, talent calibration, and promotions.',
      'Facilitate conflict resolution, employee grievances, and ensure strict compliance with labor policies.',
      'Design tailored leadership development programs and high-potential retention strategies.',
      'Analyze employee turnover telemetry and champion workplace diversity, equity, and inclusion initiatives.'
    ],
    technicalSkills: ['Talent Acquisition', 'HR Strategy', 'Labor Law Compliance', 'Performance Calibration', 'Conflict Resolution', 'Employee Engagement'],
    kpiMetrics: ['Annual Attrition Rate < 8%', 'Employee Engagement Index > 85%', 'Time-to-Fill Critical Roles < 45 Days', 'Appraisal Completion 100%']
  },
  {
    roleId: 'role_fin_controller',
    title: 'Corporate Financial Controller',
    department: 'Finance',
    level: 'IC4',
    summary: 'Oversees financial accounting, statutory audit compliance, payroll ledger balancing, and regulatory tax filings.',
    keyResponsibilities: [
      'Manage monthly financial book closure, balance sheet reconciliations, and P&L variance analysis.',
      'Coordinate external statutory and internal tax audits with Big 4 advisory firms.',
      'Supervise payroll taxation, GST compliance, TDS returns, and corporate advance tax projections.',
      'Implement robust internal financial controls (IFC) and treasury cash flow management systems.'
    ],
    technicalSkills: ['Financial Modeling', 'Corporate Accounting', 'Tax Planning', 'Statutory Audit', 'GST & TDS Filing', 'ERP Systems (SAP/Oracle)'],
    kpiMetrics: ['Book Closure by 4th of Month', 'Zero Audit Discrepancies', '100% On-Time Statutory Filings', 'Variance Accuracy < 2%']
  },
  {
    roleId: 'role_mkt_director',
    title: 'Growth Marketing Director',
    department: 'Marketing',
    level: 'M3',
    summary: 'Leads digital acquisition, enterprise demand generation, brand positioning, and customer lifetime value optimization.',
    keyResponsibilities: [
      'Lead omni-channel performance marketing, paid acquisition, and organic SEO growth strategies.',
      'Manage annual marketing budget allocation across PPC, webinars, content, and industry conferences.',
      'Optimize sales pipeline conversion funnels in close collaboration with the enterprise sales leadership.',
      'Define corporate brand identity, public relations narratives, and thought leadership positioning.'
    ],
    technicalSkills: ['Growth Marketing', 'SEO Strategy', 'Content Strategy', 'Google Analytics', 'HubSpot/Marketo', 'B2B Demand Gen'],
    kpiMetrics: ['Pipeline Generated (MQL to SQL)', 'Customer Acquisition Cost (CAC) Reduction', 'Organic Search Traffic Growth +40%', 'Brand Share of Voice']
  },
  {
    roleId: 'role_sales_dir',
    title: 'Global Sales Director',
    department: 'Sales',
    level: 'M3',
    summary: 'Drives enterprise software revenue, oversees account executives, and negotiates multi-million ARR contracts.',
    keyResponsibilities: [
      'Lead global enterprise sales team to consistently surpass quarterly and annual ARR targets.',
      'Structure high-value SaaS commercial agreements, MSAs, and SLA contracts with Fortune 500 clients.',
      'Implement MEDDIC sales qualification methodology and rigorous CRM pipeline forecasting.',
      'Recruit, coach, and scale high-performing account executives across domestic and international territories.'
    ],
    technicalSkills: ['Enterprise B2B Sales', 'Contract Negotiation', 'MEDDIC Methodology', 'Salesforce CRM', 'Revenue Forecasting', 'Executive Pitching'],
    kpiMetrics: ['Annual Recurring Revenue (ARR) Quota Attainment', 'Average Deal Size Growth', 'Win Rate > 35%', 'Sales Cycle Velocity']
  }
];
