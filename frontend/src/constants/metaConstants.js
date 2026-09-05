export const DEPARTMENTS = [
  {
    id: 'dept_eng_001',
    code: 'ENG',
    name: 'Engineering',
    fullName: 'Software Engineering & Technology',
    headTitle: 'Chief Technology Officer',
    headName: 'Dr. Vikram Sharma',
    budgetCode: 'BUD-ENG-2026',
    location: 'Building A - Floors 3-7',
    color: '#3b82f6',
    employeeCountTarget: 450,
    subDepartments: [
      { id: 'sub_eng_be', name: 'Backend Engineering', code: 'ENG-BE' },
      { id: 'sub_eng_fe', name: 'Frontend Engineering', code: 'ENG-FE' },
      { id: 'sub_eng_mobile', name: 'Mobile Engineering', code: 'ENG-MOB' },
      { id: 'sub_eng_qa', name: 'Quality Assurance', code: 'ENG-QA' },
      { id: 'sub_eng_devops', name: 'DevOps & SRE', code: 'ENG-DEVOPS' },
      { id: 'sub_eng_data', name: 'Data Engineering', code: 'ENG-DATA' }
    ]
  },
  {
    id: 'dept_hr_001',
    code: 'HR',
    name: 'Human Resources',
    fullName: 'People Operations & HR Management',
    headTitle: 'Chief People Officer',
    headName: 'Priya Sundaram',
    budgetCode: 'BUD-HR-2026',
    location: 'Building B - Floor 2',
    color: '#ec4899',
    employeeCountTarget: 85,
    subDepartments: [
      { id: 'sub_hr_ta', name: 'Talent Acquisition', code: 'HR-TA' },
      { id: 'sub_hr_ops', name: 'HR Operations', code: 'HR-OPS' },
      { id: 'sub_hr_ld', name: 'Learning & Development', code: 'HR-LD' },
      { id: 'sub_hr_comp', name: 'Compensation & Benefits', code: 'HR-COMP' }
    ]
  },
  {
    id: 'dept_fin_001',
    code: 'FIN',
    name: 'Finance',
    fullName: 'Finance, Accounting & Planning',
    headTitle: 'Chief Financial Officer',
    headName: 'Rajesh Nair',
    budgetCode: 'BUD-FIN-2026',
    location: 'Building B - Floor 4',
    color: '#10b981',
    employeeCountTarget: 120,
    subDepartments: [
      { id: 'sub_fin_acc', name: 'Accounting', code: 'FIN-ACC' },
      { id: 'sub_fin_fpa', name: 'Financial Planning & Analysis', code: 'FIN-FPA' },
      { id: 'sub_fin_treas', name: 'Treasury & Risk', code: 'FIN-TREAS' },
      { id: 'sub_fin_tax', name: 'Tax Compliance', code: 'FIN-TAX' }
    ]
  },
  {
    id: 'dept_sales_001',
    code: 'SALES',
    name: 'Sales',
    fullName: 'Global Sales & Revenue',
    headTitle: 'Chief Revenue Officer',
    headName: 'Anil Kapoor',
    budgetCode: 'BUD-SALES-2026',
    location: 'Building C - Floors 1-3',
    color: '#f59e0b',
    employeeCountTarget: 280,
    subDepartments: [
      { id: 'sub_sales_ent', name: 'Enterprise Sales', code: 'SALES-ENT' },
      { id: 'sub_sales_mm', name: 'Mid-Market Sales', code: 'SALES-MM' },
      { id: 'sub_sales_cs', name: 'Customer Success', code: 'SALES-CS' },
      { id: 'sub_sales_se', name: 'Sales Engineering', code: 'SALES-SE' }
    ]
  },
  {
    id: 'dept_mkt_001',
    code: 'MKT',
    name: 'Marketing',
    fullName: 'Brand, Digital & Demand Generation',
    headTitle: 'Chief Marketing Officer',
    headName: 'Deepa Verma',
    budgetCode: 'BUD-MKT-2026',
    location: 'Building C - Floor 5',
    color: '#8b5cf6',
    employeeCountTarget: 95,
    subDepartments: [
      { id: 'sub_mkt_brand', name: 'Brand Marketing', code: 'MKT-BRAND' },
      { id: 'sub_mkt_demand', name: 'Demand Generation', code: 'MKT-DEMAND' },
      { id: 'sub_mkt_content', name: 'Content Strategy', code: 'MKT-CONTENT' },
      { id: 'sub_mkt_digital', name: 'Digital Growth', code: 'MKT-DIGITAL' }
    ]
  },
  {
    id: 'dept_prod_001',
    code: 'PROD',
    name: 'Product',
    fullName: 'Product Management & Design',
    headTitle: 'Chief Product Officer',
    headName: 'Karthik Rao',
    budgetCode: 'BUD-PROD-2026',
    location: 'Building A - Floor 2',
    color: '#06b6d4',
    employeeCountTarget: 65,
    subDepartments: [
      { id: 'sub_prod_mgmt', name: 'Product Management', code: 'PROD-MGMT' },
      { id: 'sub_prod_design', name: 'Product Design & UX', code: 'PROD-DESIGN' },
      { id: 'sub_prod_research', name: 'User Research', code: 'PROD-RES' }
    ]
  },
  {
    id: 'dept_ops_001',
    code: 'OPS',
    name: 'Operations',
    fullName: 'Business Operations & Facilities',
    headTitle: 'Chief Operating Officer',
    headName: 'Sunita Reddy',
    budgetCode: 'BUD-OPS-2026',
    location: 'Building B - Floor 1',
    color: '#64748b',
    employeeCountTarget: 70,
    subDepartments: [
      { id: 'sub_ops_fac', name: 'Facilities & Workplace', code: 'OPS-FAC' },
      { id: 'sub_ops_proc', name: 'Procurement', code: 'OPS-PROC' },
      { id: 'sub_ops_admin', name: 'Administration', code: 'OPS-ADMIN' }
    ]
  },
  {
    id: 'dept_cs_001',
    code: 'CS',
    name: 'Customer Support',
    fullName: 'Customer Experience & Support Operations',
    headTitle: 'VP Customer Experience',
    headName: 'Manoj Kumar',
    budgetCode: 'BUD-CS-2026',
    location: 'Building D - Floors 1-2',
    color: '#14b8a6',
    employeeCountTarget: 180,
    subDepartments: [
      { id: 'sub_cs_l1', name: 'Tier 1 Support', code: 'CS-L1' },
      { id: 'sub_cs_l2', name: 'Tier 2 Technical Support', code: 'CS-L2' },
      { id: 'sub_cs_kb', name: 'Knowledge Operations', code: 'CS-KB' }
    ]
  },
  {
    id: 'dept_legal_001',
    code: 'LEGAL',
    name: 'Legal & Compliance',
    fullName: 'Corporate Legal, Governance & Compliance',
    headTitle: 'General Counsel',
    headName: 'Adv. Sneha Menon',
    budgetCode: 'BUD-LEGAL-2026',
    location: 'Building B - Floor 5',
    color: '#78716c',
    employeeCountTarget: 25,
    subDepartments: [
      { id: 'sub_legal_comm', name: 'Commercial Contracts', code: 'LEGAL-COMM' },
      { id: 'sub_legal_comp', name: 'Compliance & Data Privacy', code: 'LEGAL-COMP' }
    ]
  },
  {
    id: 'dept_res_001',
    code: 'RES',
    name: 'Research & AI',
    fullName: 'Applied AI & Advanced Technologies',
    headTitle: 'Chief Research Scientist',
    headName: 'Dr. Arvind Swaminathan',
    budgetCode: 'BUD-RES-2026',
    location: 'Building A - Floor 8',
    color: '#a855f7',
    employeeCountTarget: 40,
    subDepartments: [
      { id: 'sub_res_ai', name: 'AI & Machine Learning', code: 'RES-AI' },
      { id: 'sub_res_sys', name: 'Distributed Systems', code: 'RES-SYS' }
    ]
  }
];

export const EMPLOYEE_STATUSES = {
  ACTIVE: { label: 'Active', color: '#10b981', bg: '#d1fae5', text: '#065f46' },
  ON_PROBATION: { label: 'On Probation', color: '#f59e0b', bg: '#fef3c7', text: '#92400e' },
  ON_LEAVE: { label: 'On Leave', color: '#3b82f6', bg: '#dbeafe', text: '#1e40af' },
  NOTICE_PERIOD: { label: 'Notice Period', color: '#f97316', bg: '#ffedd5', text: '#9a3412' },
  INACTIVE: { label: 'Inactive', color: '#6b7280', bg: '#f3f4f6', text: '#374151' },
  TERMINATED: { label: 'Terminated', color: '#ef4444', bg: '#fee2e2', text: '#991b1b' }
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: { label: 'Full Time', code: 'FT' },
  PART_TIME: { label: 'Part Time', code: 'PT' },
  CONTRACT: { label: 'Contract', code: 'CON' },
  INTERN: { label: 'Intern', code: 'INT' },
  CONSULTANT: { label: 'Consultant', code: 'CONS' }
};

export const WORK_LOCATIONS = [
  { id: 'loc_hq', name: 'Bangalore (HQ)', city: 'Bangalore', type: 'Office' },
  { id: 'loc_hyd', name: 'Hyderabad Office', city: 'Hyderabad', type: 'Office' },
  { id: 'loc_pune', name: 'Pune Office', city: 'Pune', type: 'Office' },
  { id: 'loc_chn', name: 'Chennai Office', city: 'Chennai', type: 'Office' },
  { id: 'loc_mum', name: 'Mumbai Office', city: 'Mumbai', type: 'Office' },
  { id: 'loc_del', name: 'Delhi NCR Office', city: 'Gurugram', type: 'Office' },
  { id: 'loc_remote', name: 'Remote / Work From Home', city: 'Remote', type: 'Remote' },
  { id: 'loc_hybrid', name: 'Hybrid (Office + Remote)', city: 'Multiple', type: 'Hybrid' }
];

export const LEAVE_TYPES = {
  ANNUAL: { label: 'Annual Leave', maxDays: 24, color: '#3b82f6' },
  SICK: { label: 'Sick Leave', maxDays: 12, color: '#ef4444' },
  CASUAL: { label: 'Casual Leave', maxDays: 8, color: '#8b5cf6' },
  MATERNITY: { label: 'Maternity Leave', maxDays: 180, color: '#ec4899' },
  PATERNITY: { label: 'Paternity Leave', maxDays: 15, color: '#06b6d4' },
  COMP_OFF: { label: 'Compensatory Off', maxDays: 10, color: '#10b981' },
  UNPAID: { label: 'Unpaid Leave', maxDays: 30, color: '#6b7280' }
};

export const ROLES = [
  { id: 'role_admin', name: 'Super Admin', permissions: ['all'] },
  { id: 'role_hr', name: 'HR Manager', permissions: ['employees', 'leaves', 'attendance', 'payroll', 'reports'] },
  { id: 'role_manager', name: 'Team Manager', permissions: ['employees:view', 'leaves:approve', 'attendance:view'] },
  { id: 'role_emp', name: 'Employee', permissions: ['self:view', 'leaves:apply', 'attendance:mark'] }
];
