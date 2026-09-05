/**
 * Employee Status, Employment Types, and related constants
 * Comprehensive definitions for all possible employee states and classifications
 */

const EMPLOYMENT_TYPES = {
  FULL_TIME: {
    id: 'emp_type_ft',
    code: 'FT',
    name: 'Full Time',
    description: 'Standard full-time employment with full benefits eligibility, typically 40 hours per week.',
    hoursPerWeek: 40,
    benefitsEligible: true,
    probationPeriodDays: 90,
    noticePeriodDays: 30,
    overtimeEligible: true,
    leaveEntitlementMultiplier: 1.0
  },
  PART_TIME: {
    id: 'emp_type_pt',
    code: 'PT',
    name: 'Part Time',
    description: 'Part-time employment with pro-rated benefits, typically less than 30 hours per week.',
    hoursPerWeek: 20,
    benefitsEligible: true,
    probationPeriodDays: 90,
    noticePeriodDays: 14,
    overtimeEligible: false,
    leaveEntitlementMultiplier: 0.5
  },
  CONTRACT: {
    id: 'emp_type_contract',
    code: 'CON',
    name: 'Contract',
    description: 'Fixed-term contract employment. Benefits and leave entitlements depend on contract terms.',
    hoursPerWeek: 40,
    benefitsEligible: false,
    probationPeriodDays: 30,
    noticePeriodDays: 14,
    overtimeEligible: true,
    leaveEntitlementMultiplier: 0.75
  },
  INTERN: {
    id: 'emp_type_intern',
    code: 'INT',
    name: 'Intern',
    description: 'Internship or temporary learning position, usually fixed duration with limited benefits.',
    hoursPerWeek: 40,
    benefitsEligible: false,
    probationPeriodDays: 14,
    noticePeriodDays: 7,
    overtimeEligible: false,
    leaveEntitlementMultiplier: 0.25
  },
  CONSULTANT: {
    id: 'emp_type_consultant',
    code: 'CONS',
    name: 'Consultant',
    description: 'External consultant engaged for specific projects or expertise. Usually no standard benefits.',
    hoursPerWeek: 40,
    benefitsEligible: false,
    probationPeriodDays: 0,
    noticePeriodDays: 7,
    overtimeEligible: false,
    leaveEntitlementMultiplier: 0
  },
  TEMPORARY: {
    id: 'emp_type_temp',
    code: 'TEMP',
    name: 'Temporary',
    description: 'Short-term temporary employment to cover peaks, leaves, or special projects.',
    hoursPerWeek: 40,
    benefitsEligible: false,
    probationPeriodDays: 14,
    noticePeriodDays: 7,
    overtimeEligible: true,
    leaveEntitlementMultiplier: 0.3
  }
};

const EMPLOYEE_STATUSES = {
  ACTIVE: {
    id: 'status_active',
    code: 'ACTIVE',
    name: 'Active',
    description: 'Currently employed and actively working.',
    isWorking: true,
    canLogin: true,
    appearsInReports: true,
    color: '#22c55e',
    badgeVariant: 'success'
  },
  ON_PROBATION: {
    id: 'status_probation',
    code: 'PROBATION',
    name: 'On Probation',
    description: 'New employee currently serving probation period.',
    isWorking: true,
    canLogin: true,
    appearsInReports: true,
    color: '#eab308',
    badgeVariant: 'warning'
  },
  ON_LEAVE: {
    id: 'status_on_leave',
    code: 'ON_LEAVE',
    name: 'On Leave',
    description: 'Currently on approved leave (annual, medical, parental, etc.).',
    isWorking: false,
    canLogin: true,
    appearsInReports: true,
    color: '#3b82f6',
    badgeVariant: 'info'
  },
  SUSPENDED: {
    id: 'status_suspended',
    code: 'SUSPENDED',
    name: 'Suspended',
    description: 'Temporarily suspended pending investigation or disciplinary action.',
    isWorking: false,
    canLogin: false,
    appearsInReports: true,
    color: '#f97316',
    badgeVariant: 'warning'
  },
  TERMINATED: {
    id: 'status_terminated',
    code: 'TERMINATED',
    name: 'Terminated',
    description: 'Employment has been terminated. No longer active.',
    isWorking: false,
    canLogin: false,
    appearsInReports: false,
    color: '#ef4444',
    badgeVariant: 'danger'
  },
  RESIGNED: {
    id: 'status_resigned',
    code: 'RESIGNED',
    name: 'Resigned',
    description: 'Employee has resigned and completed or is serving notice period.',
    isWorking: false,
    canLogin: false,
    appearsInReports: false,
    color: '#6b7280',
    badgeVariant: 'secondary'
  },
  RETIRED: {
    id: 'status_retired',
    code: 'RETIRED',
    name: 'Retired',
    description: 'Employee has retired from the organization.',
    isWorking: false,
    canLogin: false,
    appearsInReports: false,
    color: '#8b5cf6',
    badgeVariant: 'secondary'
  },
  NOTICE_PERIOD: {
    id: 'status_notice',
    code: 'NOTICE',
    name: 'Notice Period',
    description: 'Serving notice period after resignation or termination notice.',
    isWorking: true,
    canLogin: true,
    appearsInReports: true,
    color: '#f59e0b',
    badgeVariant: 'warning'
  }
};

const WORK_LOCATIONS = {
  HQ: {
    id: 'loc_hq',
    code: 'HQ',
    name: 'Headquarters',
    address: '100 Innovation Drive, Tech Park, Bangalore 560001',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  HYDERABAD: {
    id: 'loc_hyd',
    code: 'HYD',
    name: 'Hyderabad Office',
    address: 'Plot 45, HITEC City, Hyderabad 500081',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  PUNE: {
    id: 'loc_pune',
    code: 'PUNE',
    name: 'Pune Office',
    address: 'Survey No. 12, Baner, Pune 411045',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  CHENNAI: {
    id: 'loc_chn',
    code: 'CHN',
    name: 'Chennai Office',
    address: 'OMR Road, Sholinganallur, Chennai 600119',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  MUMBAI: {
    id: 'loc_mum',
    code: 'MUM',
    name: 'Mumbai Office',
    address: 'Bandra Kurla Complex, Mumbai 400051',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  DELHI: {
    id: 'loc_del',
    code: 'DEL',
    name: 'Delhi NCR Office',
    address: 'Cyber City, Gurugram 122002',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  REMOTE: {
    id: 'loc_remote',
    code: 'REMOTE',
    name: 'Fully Remote',
    address: 'Work From Anywhere',
    city: 'Remote',
    state: 'N/A',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  },
  HYBRID: {
    id: 'loc_hybrid',
    code: 'HYBRID',
    name: 'Hybrid',
    address: 'Combination of Office and Remote',
    city: 'Multiple',
    state: 'N/A',
    country: 'India',
    timezone: 'Asia/Kolkata',
    isRemoteEligible: true
  }
};

const GENDERS = [
  { id: 'gender_male', code: 'M', name: 'Male' },
  { id: 'gender_female', code: 'F', name: 'Female' },
  { id: 'gender_non_binary', code: 'NB', name: 'Non-Binary' },
  { id: 'gender_prefer_not', code: 'PNTS', name: 'Prefer Not To Say' }
];

const MARITAL_STATUSES = [
  { id: 'marital_single', code: 'SINGLE', name: 'Single' },
  { id: 'marital_married', code: 'MARRIED', name: 'Married' },
  { id: 'marital_divorced', code: 'DIVORCED', name: 'Divorced' },
  { id: 'marital_widowed', code: 'WIDOWED', name: 'Widowed' },
  { id: 'marital_separated', code: 'SEPARATED', name: 'Separated' }
];

const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const EDUCATION_LEVELS = [
  { id: 'edu_highschool', name: 'High School' },
  { id: 'edu_diploma', name: 'Diploma' },
  { id: 'edu_bachelors', name: 'Bachelor\'s Degree' },
  { id: 'edu_masters', name: 'Master\'s Degree' },
  { id: 'edu_phd', name: 'Doctorate (PhD)' },
  { id: 'edu_professional', name: 'Professional Certification' }
];

const PERFORMANCE_RATINGS = {
  OUTSTANDING: { value: 5, label: 'Outstanding', description: 'Consistently exceeds all expectations and delivers exceptional results.' },
  EXCEEDS: { value: 4, label: 'Exceeds Expectations', description: 'Frequently exceeds expectations in most areas.' },
  MEETS: { value: 3, label: 'Meets Expectations', description: 'Consistently meets all job requirements and expectations.' },
  NEEDS_IMPROVEMENT: { value: 2, label: 'Needs Improvement', description: 'Meets some expectations but requires improvement in key areas.' },
  UNSATISFACTORY: { value: 1, label: 'Unsatisfactory', description: 'Does not meet minimum expectations. Performance improvement plan required.' }
};

const LEAVE_TYPES = {
  ANNUAL: {
    id: 'leave_annual',
    code: 'AL',
    name: 'Annual Leave',
    description: 'Paid annual vacation leave.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 24,
    carryForwardAllowed: true,
    maxCarryForwardDays: 5,
    color: '#3b82f6'
  },
  SICK: {
    id: 'leave_sick',
    code: 'SL',
    name: 'Sick Leave',
    description: 'Leave for illness or medical appointments.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 12,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#ef4444'
  },
  CASUAL: {
    id: 'leave_casual',
    code: 'CL',
    name: 'Casual Leave',
    description: 'Short notice leave for personal reasons.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 8,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#8b5cf6'
  },
  MATERNITY: {
    id: 'leave_maternity',
    code: 'ML',
    name: 'Maternity Leave',
    description: 'Leave for childbirth and recovery.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 180,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#ec4899'
  },
  PATERNITY: {
    id: 'leave_paternity',
    code: 'PL',
    name: 'Paternity Leave',
    description: 'Leave for new fathers.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 15,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#06b6d4'
  },
  UNPAID: {
    id: 'leave_unpaid',
    code: 'UL',
    name: 'Unpaid Leave',
    description: 'Leave without pay for extended personal reasons.',
    isPaid: false,
    requiresApproval: true,
    maxDaysPerYear: 30,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#6b7280'
  },
  COMP_OFF: {
    id: 'leave_compoff',
    code: 'CO',
    name: 'Compensatory Off',
    description: 'Time off in lieu of working on holidays or weekends.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 10,
    carryForwardAllowed: true,
    maxCarryForwardDays: 3,
    color: '#14b8a6'
  },
  BEREAVEMENT: {
    id: 'leave_bereavement',
    code: 'BL',
    name: 'Bereavement Leave',
    description: 'Leave due to death of immediate family member.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 5,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#78716c'
  },
  STUDY: {
    id: 'leave_study',
    code: 'STL',
    name: 'Study Leave',
    description: 'Leave for examinations or professional development courses.',
    isPaid: true,
    requiresApproval: true,
    maxDaysPerYear: 10,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    color: '#a855f7'
  }
};

const ROLES = {
  SUPER_ADMIN: {
    id: 'role_super_admin',
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Full system access including configuration and all employee data.',
    permissions: ['*']
  },
  HR_ADMIN: {
    id: 'role_hr_admin',
    code: 'HR_ADMIN',
    name: 'HR Admin',
    description: 'Full HR access: manage employees, leaves, attendance, reports.',
    permissions: [
      'employees:read', 'employees:write', 'employees:delete',
      'leaves:read', 'leaves:write', 'leaves:approve',
      'attendance:read', 'attendance:write',
      'reports:read', 'reports:export',
      'departments:read', 'departments:write'
    ]
  },
  HR_MANAGER: {
    id: 'role_hr_manager',
    code: 'HR_MANAGER',
    name: 'HR Manager',
    description: 'Manage employees and approve leaves within their scope.',
    permissions: [
      'employees:read', 'employees:write',
      'leaves:read', 'leaves:write', 'leaves:approve',
      'attendance:read',
      'reports:read'
    ]
  },
  DEPARTMENT_HEAD: {
    id: 'role_dept_head',
    code: 'DEPT_HEAD',
    name: 'Department Head',
    description: 'View and manage employees in their own department. Approve leaves.',
    permissions: [
      'employees:read:own_dept',
      'leaves:read:own_dept', 'leaves:approve:own_dept',
      'attendance:read:own_dept',
      'reports:read:own_dept'
    ]
  },
  MANAGER: {
    id: 'role_manager',
    code: 'MANAGER',
    name: 'Manager',
    description: 'Manage direct reports, approve their leaves and view their attendance.',
    permissions: [
      'employees:read:direct_reports',
      'leaves:read:direct_reports', 'leaves:approve:direct_reports',
      'attendance:read:direct_reports'
    ]
  },
  EMPLOYEE: {
    id: 'role_employee',
    code: 'EMPLOYEE',
    name: 'Employee',
    description: 'Standard employee access: view own profile, apply leave, view own attendance.',
    permissions: [
      'profile:read:own', 'profile:write:own',
      'leaves:read:own', 'leaves:write:own',
      'attendance:read:own'
    ]
  }
};

module.exports = {
  EMPLOYMENT_TYPES,
  EMPLOYEE_STATUSES,
  WORK_LOCATIONS,
  GENDERS,
  MARITAL_STATUSES,
  BLOOD_GROUPS,
  EDUCATION_LEVELS,
  PERFORMANCE_RATINGS,
  LEAVE_TYPES,
  ROLES
};
