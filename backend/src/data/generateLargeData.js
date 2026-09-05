/**
 * Large Scale Mock Data Generator
 * Generates thousands of realistic employee records, leaves, and attendance data
 * for the in-memory Employee Management System.
 */

const store = require('./store');
const {
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  LAST_NAMES,
  MIDDLE_NAMES,
  EMAIL_DOMAINS,
  STREET_NAMES,
  CITIES,
  SKILLS_POOL,
  JOB_TITLES
} = require('./names');

const { DEPARTMENTS, DEPARTMENT_LIST } = require('../constants/departments');
const {
  EMPLOYMENT_TYPES,
  EMPLOYEE_STATUSES,
  WORK_LOCATIONS,
  GENDERS,
  MARITAL_STATUSES,
  BLOOD_GROUPS,
  EDUCATION_LEVELS,
  LEAVE_TYPES
} = require('../constants/employeeStatus');

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear = 2015, endYear = 2026) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
}

function generatePhone() {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85'];
  return `+91 ${randomItem(prefixes)}${randomInt(10000000, 99999999)}`;
}

function generateEmail(firstName, lastName, employeeId) {
  const domain = randomItem(EMAIL_DOMAINS);
  const styles = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 99)}`,
    `${employeeId.toLowerCase()}`
  ];
  return `${randomItem(styles)}@${domain}`;
}

function generateAddress() {
  return {
    street: `${randomInt(1, 999)}, ${randomItem(STREET_NAMES)}`,
    city: randomItem(CITIES),
    state: randomItem(['Karnataka', 'Telangana', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'Haryana', 'Gujarat', 'West Bengal']),
    pincode: String(randomInt(110001, 860001)),
    country: 'India'
  };
}

function generateSkills(count = 5) {
  const shuffled = [...SKILLS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEmployee(index) {
  const isMale = Math.random() > 0.42;
  const firstName = isMale ? randomItem(FIRST_NAMES_MALE) : randomItem(FIRST_NAMES_FEMALE);
  const lastName = randomItem(LAST_NAMES);
  const middleName = Math.random() > 0.6 ? randomItem(MIDDLE_NAMES) : '';
  const gender = isMale ? 'M' : (Math.random() > 0.95 ? 'NB' : 'F');

  const deptKeys = Object.keys(DEPARTMENTS);
  const deptKey = randomItem(deptKeys);
  const department = DEPARTMENTS[deptKey];
  const subDept = department.subDepartments && department.subDepartments.length
    ? randomItem(department.subDepartments)
    : null;

  const titles = JOB_TITLES[deptKey] || JOB_TITLES.ENGINEERING;
  const jobTitle = randomItem(titles);

  const employmentTypeKeys = Object.keys(EMPLOYMENT_TYPES);
  // Weight towards full-time
  let employmentType;
  const r = Math.random();
  if (r < 0.78) employmentType = 'FULL_TIME';
  else if (r < 0.88) employmentType = 'CONTRACT';
  else if (r < 0.94) employmentType = 'PART_TIME';
  else if (r < 0.98) employmentType = 'INTERN';
  else employmentType = 'TEMPORARY';

  const statusKeys = Object.keys(EMPLOYEE_STATUSES);
  let status;
  const sr = Math.random();
  if (sr < 0.82) status = 'ACTIVE';
  else if (sr < 0.88) status = 'ON_PROBATION';
  else if (sr < 0.93) status = 'ON_LEAVE';
  else if (sr < 0.96) status = 'NOTICE_PERIOD';
  else if (sr < 0.98) status = 'SUSPENDED';
  else status = randomItem(['TERMINATED', 'RESIGNED', 'RETIRED']);

  const locationKeys = Object.keys(WORK_LOCATIONS);
  const workLocationId = randomItem(locationKeys);

  const joinDate = randomDate(2016, 2026);
  const dobYear = randomInt(1975, 2003);
  const dateOfBirth = `${dobYear}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`;

  // Temporary employeeId for email generation
  const tempId = `EMP${1000 + index}`;

  const salaryBase = {
    ENGINEERING: randomInt(600000, 4500000),
    HUMAN_RESOURCES: randomInt(400000, 2200000),
    FINANCE: randomInt(500000, 2800000),
    SALES: randomInt(450000, 3500000),
    MARKETING: randomInt(400000, 2500000),
    PRODUCT: randomInt(700000, 4000000),
    OPERATIONS: randomInt(350000, 1800000),
    CUSTOMER_SUPPORT: randomInt(300000, 1200000),
    LEGAL: randomInt(800000, 3500000),
    RESEARCH: randomInt(900000, 4000000)
  };

  const salary = salaryBase[deptKey] || randomInt(400000, 2000000);

  const employee = {
    firstName,
    middleName,
    lastName,
    fullName: middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName, tempId),
    phone: generatePhone(),
    alternatePhone: Math.random() > 0.7 ? generatePhone() : null,
    gender,
    dateOfBirth,
    bloodGroup: randomItem(BLOOD_GROUPS),
    maritalStatus: randomItem(MARITAL_STATUSES).code,
    nationality: 'Indian',
    address: generateAddress(),
    emergencyContact: {
      name: `${randomItem(isMale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE)} ${lastName}`,
      relation: randomItem(['Spouse', 'Parent', 'Sibling', 'Friend']),
      phone: generatePhone()
    },
    departmentId: department.id,
    departmentCode: department.code,
    departmentName: department.name,
    subDepartmentId: subDept ? subDept.id : null,
    subDepartmentName: subDept ? subDept.name : null,
    jobTitle,
    employmentType,
    status,
    workLocationId,
    workLocationName: WORK_LOCATIONS[workLocationId].name,
    joinDate,
    confirmationDate: status !== 'ON_PROBATION' ? joinDate : null,
    probationEndDate: status === 'ON_PROBATION' ? null : null,
    salary,
    currency: 'INR',
    skills: generateSkills(randomInt(4, 12)),
    education: {
      level: randomItem(EDUCATION_LEVELS).id,
      degree: randomItem(['B.Tech', 'B.E', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'B.Com', 'M.Com', 'BA', 'MA', 'PhD']),
      institution: randomItem([
        'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
        'NIT Trichy', 'NIT Surathkal', 'BITS Pilani', 'IIIT Hyderabad', 'Delhi University',
        'Mumbai University', 'Pune University', 'Anna University', 'Osmania University',
        'Bangalore University', 'Manipal University', 'VIT', 'SRM', 'Amrita', 'Other'
      ]),
      yearOfPassing: randomInt(1998, 2025)
    },
    bankDetails: {
      accountNumber: String(randomInt(10000000000, 99999999999)),
      ifsc: `HDFC0${randomInt(100000, 999999)}`,
      bankName: randomItem(['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank']),
      accountHolderName: `${firstName} ${lastName}`
    },
    managerId: null, // will be linked later
    role: randomItem(['EMPLOYEE', 'EMPLOYEE', 'EMPLOYEE', 'MANAGER', 'EMPLOYEE']),
    isActive: ['ACTIVE', 'ON_PROBATION', 'ON_LEAVE', 'NOTICE_PERIOD'].includes(status),
    profileImage: null,
    bio: null,
    linkedinUrl: Math.random() > 0.5 ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}` : null,
    yearsOfExperience: randomInt(0, 25),
    lastPromotionDate: Math.random() > 0.6 ? randomDate(2018, 2025) : null,
    performanceRating: randomItem([5, 4, 4, 3, 3, 3, 2, 1]),
    tags: []
  };

  return employee;
}

function generateLeavesForEmployee(employee, count = 3) {
  const leaves = [];
  const leaveTypeKeys = Object.keys(LEAVE_TYPES);
  for (let i = 0; i < count; i++) {
    const leaveType = randomItem(leaveTypeKeys);
    const start = randomDate(2024, 2026);
    const days = randomInt(1, 8);
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + days);

    leaves.push({
      employeeId: employee.id,
      employeeEmployeeId: employee.employeeId,
      employeeName: employee.fullName,
      leaveType,
      leaveTypeName: LEAVE_TYPES[leaveType].name,
      startDate: start,
      endDate: endDate.toISOString().split('T')[0],
      days,
      reason: randomItem([
        'Personal work', 'Family function', 'Medical appointment', 'Vacation',
        'Not feeling well', 'Travel', 'Home renovation', 'Exam preparation',
        'Wedding in family', 'Child school event'
      ]),
      status: randomItem(['PENDING', 'APPROVED', 'APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED']),
      appliedOn: start,
      approverId: null,
      comments: ''
    });
  }
  return leaves;
}

function generateAttendanceForEmployee(employee, days = 30) {
  const records = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends

    const dateStr = d.toISOString().split('T')[0];
    const statusRoll = Math.random();
    let status, checkIn, checkOut;

    if (statusRoll < 0.85) {
      status = 'PRESENT';
      checkIn = `09:${String(randomInt(15, 45)).padStart(2, '0')}`;
      checkOut = `18:${String(randomInt(20, 50)).padStart(2, '0')}`;
    } else if (statusRoll < 0.92) {
      status = 'HALF_DAY';
      checkIn = `09:${String(randomInt(20, 40)).padStart(2, '0')}`;
      checkOut = `13:${String(randomInt(0, 30)).padStart(2, '0')}`;
    } else if (statusRoll < 0.97) {
      status = 'ABSENT';
      checkIn = null;
      checkOut = null;
    } else {
      status = 'WORK_FROM_HOME';
      checkIn = `09:${String(randomInt(0, 30)).padStart(2, '0')}`;
      checkOut = `18:${String(randomInt(0, 40)).padStart(2, '0')}`;
    }

    records.push({
      employeeId: employee.id,
      employeeEmployeeId: employee.employeeId,
      date: dateStr,
      status,
      checkIn,
      checkOut,
      workLocation: status === 'WORK_FROM_HOME' ? 'Remote' : employee.workLocationName
    });
  }
  return records;
}

function generateLargeDataset(employeeCount = 2500) {
  console.log(`Generating ${employeeCount} employees...`);
  store.clearAllData();

  const employees = [];
  for (let i = 0; i < employeeCount; i++) {
    const empData = generateEmployee(i);
    const emp = store.addEmployee(empData);
    employees.push(emp);

    if ((i + 1) % 500 === 0) {
      console.log(`  Generated ${i + 1} employees...`);
    }
  }

  // Assign some managers
  const potentialManagers = employees.filter(e =>
    ['ACTIVE', 'ON_PROBATION'].includes(e.status) && e.role === 'MANAGER'
  );
  employees.forEach(emp => {
    if (emp.role === 'EMPLOYEE' && potentialManagers.length > 0 && Math.random() > 0.3) {
      const mgr = randomItem(potentialManagers);
      if (mgr.departmentId === emp.departmentId) {
        store.updateEmployee(emp.id, { managerId: mgr.id, managerName: mgr.fullName });
      }
    }
  });

  // Generate leaves
  console.log('Generating leave records...');
  employees.forEach(emp => {
    if (Math.random() > 0.3) {
      const leaves = generateLeavesForEmployee(emp, randomInt(1, 6));
      leaves.forEach(l => store.addLeave(l));
    }
  });

  // Generate attendance (sample for recent period)
  console.log('Generating attendance records...');
  const sampleForAttendance = employees.filter(e => e.isActive).slice(0, Math.min(800, employees.length));
  sampleForAttendance.forEach(emp => {
    const records = generateAttendanceForEmployee(emp, 45);
    records.forEach(r => store.addAttendance(r));
  });

  // Create default admin user
  store.addUser({
    email: 'admin@technova.com',
    password: 'Admin@123', // In real app this would be hashed
    role: 'SUPER_ADMIN',
    name: 'System Administrator',
    employeeId: null,
    isActive: true
  });

  store.addUser({
    email: 'hr@technova.com',
    password: 'Hr@12345',
    role: 'HR_ADMIN',
    name: 'HR Administrator',
    employeeId: null,
    isActive: true
  });

  console.log('Data generation complete.');
  console.log(`Employees: ${store.employees.length}`);
  console.log(`Leaves: ${store.leaves.length}`);
  console.log(`Attendance records: ${store.attendance.length}`);
  console.log(`Users: ${store.users.length}`);

  return {
    employees: store.employees.length,
    leaves: store.leaves.length,
    attendance: store.attendance.length,
    users: store.users.length
  };
}

// If run directly
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 2500;
  generateLargeDataset(count);
}

module.exports = { generateLargeDataset, generateEmployee };
