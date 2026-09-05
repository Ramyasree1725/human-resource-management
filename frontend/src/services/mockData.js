export const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rudra', 'Ananya',
  'Diya', 'Gauri', 'Isha', 'Kavya', 'Khushi', 'Mira', 'Navya', 'Pari', 'Prisha', 'Riya',
  'Saanvi', 'Sarah', 'Siya', 'Tanvi', 'Vanya', 'Avani', 'Myra', 'Ahana', 'Anvi', 'Anika',
  'Rahul', 'Rohit', 'Suresh', 'Ramesh', 'Vikram', 'Pooja', 'Sneha', 'Deepika', 'Manish', 'Neha'
];

export const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bhatia', 'Mehta', 'Chopra', 'Kapoor', 'Reddy', 'Patel',
  'Rao', 'Nair', 'Menon', 'Pillai', 'Iyer', 'Iyengar', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Ghosh',
  'Deshmukh', 'Kulkarni', 'Joshi', 'Patil', 'Pawar', 'Singh', 'Kaur', 'Chauhan', 'Rathore', 'Yadav'
];

export const DESIGNATIONS = {
  dept_eng_001: ['Lead Software Engineer', 'Senior Backend Engineer', 'Frontend Specialist', 'DevOps Architect', 'Full Stack Developer', 'QA Automation Engineer', 'Mobile App Developer', 'Cloud Infrastructure Engineer'],
  dept_hr_001: ['Senior Talent Partner', 'HR Business Partner', 'People Operations Specialist', 'Learning & Development Lead', 'Compensation & Benefits Analyst'],
  dept_fin_001: ['Senior Financial Analyst', 'Lead Accountant', 'Treasury Manager', 'Tax Consultant', 'FP&A Specialist'],
  dept_sales_001: ['Enterprise Account Executive', 'Global Sales Director', 'Mid-Market Account Manager', 'Sales Solutions Engineer', 'Customer Success Manager'],
  dept_mkt_001: ['Growth Marketing Manager', 'Brand Strategist', 'Content Marketing Lead', 'SEO & Performance Specialist', 'Digital Campaigns Director'],
  dept_prod_001: ['Principal Product Manager', 'Senior UX/UI Designer', 'Lead Product Owner', 'User Experience Researcher', 'Design Systems Architect'],
  dept_ops_001: ['Head of Facilities', 'Senior Procurement Specialist', 'Operations Manager', 'Workplace Coordinator'],
  dept_cs_001: ['Tier 2 Technical Specialist', 'Customer Support Team Lead', 'Customer Success Associate', 'Knowledge Operations Analyst'],
  dept_legal_001: ['Senior Legal Counsel', 'Contracts Manager', 'Compliance & Privacy Officer'],
  dept_res_001: ['Principal AI Scientist', 'Machine Learning Research Engineer', 'Data Science Fellow', 'Applied Systems Researcher']
};

export const SKILLS_POOL = [
  'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'PostgreSQL',
  'MongoDB', 'Tailwind CSS', 'Redux', 'System Architecture', 'Figma', 'UI/UX Design', 'Agile/Scrum',
  'Talent Acquisition', 'Payroll Administration', 'Financial Modeling', 'Budgeting', 'Tax Planning',
  'Salesforce', 'CRM', 'B2B Sales', 'Negotiation', 'SEO', 'Content Strategy', 'Google Analytics',
  'Machine Learning', 'PyTorch', 'TensorFlow', 'Data Science', 'Compliance', 'Contract Negotiation'
];

export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockEmployees(count = 80) {
  const employees = [];
  const deptIds = [
    'dept_eng_001', 'dept_hr_001', 'dept_fin_001', 'dept_sales_001',
    'dept_mkt_001', 'dept_prod_001', 'dept_ops_001', 'dept_cs_001',
    'dept_legal_001', 'dept_res_001'
  ];
  const locations = ['loc_hq', 'loc_hyd', 'loc_pune', 'loc_chn', 'loc_mum', 'loc_del', 'loc_remote', 'loc_hybrid'];
  const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ON_PROBATION', 'ON_LEAVE', 'NOTICE_PERIOD', 'INACTIVE', 'TERMINATED'];
  const empTypes = ['FULL_TIME', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT'];
  const genders = ['Male', 'Female', 'Non-Binary'];

  // Guarantee at least 3 employees per department, per status, per type, per location
  for (let i = 1; i <= Math.max(count, deptIds.length * 5); i++) {
    const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    // Even round-robin for departments and locations to guarantee full coverage
    const deptId = deptIds[(i - 1) % deptIds.length];
    const deptTitles = DESIGNATIONS[deptId] || ['Associate Specialist'];
    const title = deptTitles[(i - 1) % deptTitles.length];
    const gender = genders[(i - 1) % genders.length];
    const locationId = locations[(i - 1) % locations.length];
    const status = statuses[(i - 1) % statuses.length];
    const employmentType = empTypes[(i - 1) % empTypes.length];
    const idNum = String(1000 + i).padStart(5, '0');
    const employeeId = `EMP${idNum}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 25 ? i : ''}@technova.com`;
    const phone = `+91 ${getRandomInt(70000, 99999)} ${getRandomInt(10000, 99999)}`;
    const joinYear = getRandomInt(2020, 2025);
    const joinMonth = String(getRandomInt(1, 12)).padStart(2, '0');
    const joinDay = String(getRandomInt(1, 28)).padStart(2, '0');
    const joiningDate = `${joinYear}-${joinMonth}-${joinDay}`;
    const salary = getRandomInt(650000, 3400000);
    const rating = getRandomInt(3, 5);

    // Pick 3-5 random skills
    const skillsCount = getRandomInt(3, 6);
    const skills = [...SKILLS_POOL].sort(() => 0.5 - Math.random()).slice(0, skillsCount);

    employees.push({
      id: `emp_${i}_${Date.now().toString(36)}_${i}`,
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      departmentId: deptId,
      designation: title,
      gender,
      employmentType,
      status,
      workLocationId: locationId,
      joiningDate,
      salary,
      performanceRating: rating,
      skills,
      managerId: i > 5 ? 'EMP01001' : null,
      address: `${getRandomInt(1, 99)}, Tech Residency, Sector ${getRandomInt(1, 25)}`,
      emergencyContact: {
        name: `${getRandomItem(FIRST_NAMES)} ${lastName}`,
        relation: getRandomItem(['Spouse', 'Parent', 'Sibling']),
        phone: `+91 ${getRandomInt(70000, 99999)} ${getRandomInt(10000, 99999)}`
      },
      createdAt: joiningDate,
      updatedAt: new Date().toISOString()
    });
  }

  return employees;
}

export function generateInitialLeaves(employees) {
  const leaves = [];
  const leaveTypes = ['ANNUAL', 'SICK', 'CASUAL', 'COMP_OFF'];
  const statuses = ['APPROVED', 'PENDING', 'REJECTED', 'APPROVED'];

  employees.slice(0, 20).forEach((emp, idx) => {
    const type = leaveTypes[idx % leaveTypes.length];
    const status = statuses[idx % statuses.length];
    const startDay = getRandomInt(1, 20);
    const duration = getRandomInt(1, 4);

    leaves.push({
      id: `lv_${idx + 1}_${Date.now().toString(36)}`,
      leaveId: `LV00${5000 + idx}`,
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      departmentId: emp.departmentId,
      leaveType: type,
      startDate: `2026-09-${String(startDay).padStart(2, '0')}`,
      endDate: `2026-09-${String(startDay + duration).padStart(2, '0')}`,
      days: duration + 1,
      reason: getRandomItem([
        'Family vacation and travel',
        'Viral fever and doctor consultation',
        'Personal urgent commitment',
        'Attending family wedding ceremony',
        'Medical recovery',
        'Home renovation and relocation'
      ]),
      status,
      appliedAt: '2026-08-25T10:30:00Z',
      managerNotes: status === 'APPROVED' ? 'Approved. Please ensure handoff.' : status === 'REJECTED' ? 'High sprint priority during these dates.' : ''
    });
  });

  return leaves;
}

export function generateAttendanceForEmployeesAndDate(employees, date) {
  const records = [];
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'REMOTE', 'HALF_DAY', 'ON_LEAVE'];
  const validEmployees = employees.filter(e => e.status !== 'TERMINATED' && e.status !== 'INACTIVE');

  validEmployees.forEach((emp, idx) => {
    // Generate deterministic yet natural attendance based on employee index and date
    const hash = (emp.firstName.charCodeAt(0) + (date ? date.charCodeAt(date.length - 1) : 0) + idx) % statuses.length;
    let status = emp.status === 'ON_LEAVE' ? 'ON_LEAVE' : statuses[hash];
    const checkInTime = status === 'ON_LEAVE' ? '--' : `09:${String(15 + (idx % 30)).padStart(2, '0')} AM`;
    const checkOutTime = status === 'ON_LEAVE' ? '--' : (status === 'HALF_DAY' ? '02:00 PM' : '06:30 PM');
    const hoursWorked = status === 'PRESENT' ? 8.5 : status === 'REMOTE' ? 8.0 : status === 'HALF_DAY' ? 4.5 : 0;
    const workLocation = emp.workLocationId === 'loc_remote' || status === 'REMOTE' ? 'Remote (WFH)' : 'Office';

    records.push({
      id: `att_${date}_${emp.employeeId}`,
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      departmentId: emp.departmentId,
      date: date || new Date().toISOString().split('T')[0],
      status,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      workLocation,
      hoursWorked
    });
  });

  return records;
}

export function generateInitialAttendance(employees) {
  const today = '2026-08-31';
  return generateAttendanceForEmployeesAndDate(employees, today);
}

export function generateInitialWorkReports(employees) {
  const reports = [];
  const today = new Date().toISOString().split('T')[0];
  const sampleEmps = employees.slice(0, 15);

  sampleEmps.forEach((emp, idx) => {
    // 1. Morning to Afternoon submission (Slot 1)
    reports.push({
      id: `wr_${today}_m_${emp.employeeId}`,
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      departmentId: emp.departmentId,
      designation: emp.designation,
      date: today,
      slot: 'MORNING_TO_AFTERNOON',
      slotLabel: 'Morning to Afternoon (First Half)',
      timeWindow: '09:30 AM - 01:30 PM',
      taskTitle: idx % 3 === 0 ? 'Core Sprint Feature Implementation & Unit Testing' : idx % 3 === 1 ? 'Client Deliverables & Data Pipeline Validation' : 'Cross-Team Architecture Sync & Code Review',
      taskDescription: `Completed primary morning milestones for sprint module #${100 + idx}. Conducted test coverage checks and resolved 2 blocking lint issues.`,
      deliverables: `PR #${400 + idx} submitted on GitHub, documentation updated.`,
      hoursSpent: 4.0,
      status: 'COMPLETED',
      blockers: 'None',
      submittedAt: `${today}T13:35:00Z`,
      managerReview: {
        status: idx % 2 === 0 ? 'REVIEWED' : 'PENDING',
        feedback: idx % 2 === 0 ? 'Good velocity on the PR. Proceed with integration testing.' : '',
        reviewedBy: idx % 2 === 0 ? 'Office Head' : ''
      }
    });

    // 2. Afternoon to Evening submission (Slot 2 for a subset)
    if (idx < 8) {
      reports.push({
        id: `wr_${today}_e_${emp.employeeId}`,
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        departmentId: emp.departmentId,
        designation: emp.designation,
        date: today,
        slot: 'AFTERNOON_TO_EOD',
        slotLabel: 'Afternoon to Evening / EOD (Second Half)',
        timeWindow: '02:00 PM - 06:30 PM',
        taskTitle: 'Performance Profiling, Release Verification & EOD Handover',
        taskDescription: 'Benchmarked database query latency under simulated load, resolved memory leak in caching layer, and documented tomorrow\'s deployment roadmap.',
        deliverables: 'Staging deployment verified. 0 regression failures.',
        hoursSpent: 4.5,
        status: 'COMPLETED',
        blockers: 'None',
        submittedAt: `${today}T18:30:00Z`,
        managerReview: {
          status: 'PENDING',
          feedback: '',
          reviewedBy: ''
        }
      });
    }
  });

  return reports;
}
