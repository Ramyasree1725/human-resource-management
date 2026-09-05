/**
 * Large collection of first names, last names, and related data for generating realistic employee records
 * Intentionally extensive to support large-scale mock data generation
 */

const FIRST_NAMES_MALE = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharva', 'Advik', 'Pranav', 'Advaith', 'Aryan', 'Dhruv', 'Kabir', 'Ritvik', 'Aarush',
  'Kian', 'Darsh', 'Veer', 'Rohan', 'Yash', 'Om', 'Rudra', 'Ansh', 'Laksh', 'Dev',
  'Ayaan', 'Virat', 'Kartik', 'Harsh', 'Siddharth', 'Rahul', 'Amit', 'Raj', 'Suresh', 'Vikram',
  'Anil', 'Sunil', 'Ramesh', 'Mahesh', 'Sanjay', 'Ajay', 'Vijay', 'Ravi', 'Prakash', 'Manoj',
  'Deepak', 'Naveen', 'Kiran', 'Ashok', 'Gopal', 'Hari', 'Mohan', 'Sohan', 'Pavan', 'Nitin',
  'Sachin', 'Rohit', 'Gaurav', 'Abhishek', 'Nikhil', 'Varun', 'Tarun', 'Arun', 'Karun', 'Suraj',
  'Akash', 'Prashant', 'Vishal', 'Kunal', 'Mayank', 'Saurabh', 'Ankit', 'Rishabh', 'Shubham', 'Aakash',
  'Hitesh', 'Jatin', 'Parth', 'Yuvraj', 'Manish', 'Dinesh', 'Rakesh', 'Lokesh', 'Rajesh', 'Naresh',
  'Umesh', 'Bhavesh', 'Chirag', 'Dhruv', 'Eshan', 'Farhan', 'Ganesh', 'Hemant', 'Ishan', 'Jayant',
  'Karan', 'Lalit', 'Madhav', 'Naman', 'Omkar', 'Pranay', 'Qadir', 'Raghav', 'Samar', 'Tushar',
  'Uday', 'Vedant', 'Wasim', 'Xavier', 'Yogesh', 'Zayan', 'Aakash', 'Bhavya', 'Chaitanya', 'Darshan',
  'Eklavya', 'Faisal', 'Girish', 'Harshil', 'Inder', 'Jignesh', 'Kaushik', 'Luv', 'Manan', 'Nilesh',
  'Onkar', 'Puneet', 'Qutub', 'Rajat', 'Siddhant', 'Tejas', 'Utkarsh', 'Vivek', 'Waseem', 'Yashas',
  'Zain', 'Abeer', 'Brijesh', 'Chetan', 'Devansh', 'Eshan', 'Firoz', 'Gaurang', 'Hardik', 'Irfan',
  'Jaspreet', 'Kamal', 'Laxman', 'Mitesh', 'Nirav', 'Ojas', 'Pratham', 'Qasim', 'Ranveer', 'Surya',
  'Tanmay', 'Ujjwal', 'Vatsal', 'Waris', 'Yuvan', 'Zaheer', 'Aaditya', 'Bharat', 'Chandan', 'Daksh',
  'Ekansh', 'Fahad', 'Gagan', 'Hrithik', 'Imran', 'Javed', 'Kshitij', 'Laxmikant', 'Mohit', 'Nakul',
  'Omprakash', 'Piyush', 'Qamar', 'Rishi', 'Shlok', 'Taran', 'Udit', 'Vinay', 'Waman', 'Yatin',
  'Zubair', 'Aarnav', 'Bhuvan', 'Charan', 'Dhruva', 'Eeshan', 'Farid', 'Gokul', 'Hemanth', 'Ishanvi',
  'Jatin', 'Krish', 'Lakshya', 'Manav', 'Nishant', 'Oviyan', 'Paras', 'Qadir', 'Reyansh', 'Samarth'
];

const FIRST_NAMES_FEMALE = [
  'Aadhya', 'Saanvi', 'Aanya', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Angel', 'Diya',
  'Myra', 'Sara', 'Iraa', 'Ahana', 'Prisha', 'Riya', 'Anvi', 'Kiara', 'Amaira', 'Aisha',
  'Ishita', 'Shanaya', 'Atharva', 'Vanya', 'Kashvi', 'Khushi', 'Mahika', 'Nitya', 'Pihu', 'Rhea',
  'Siya', 'Tanya', 'Urvi', 'Veda', 'Zara', 'Aditi', 'Bhavya', 'Chitra', 'Divya', 'Esha',
  'Fatima', 'Gayatri', 'Harshita', 'Isha', 'Janhvi', 'Kavya', 'Lavanya', 'Meera', 'Naina', 'Ojasvi',
  'Pooja', 'Qurat', 'Radha', 'Sneha', 'Tanvi', 'Uma', 'Vidya', 'Wafa', 'Yamini', 'Zoya',
  'Anjali', 'Bhavana', 'Charu', 'Deepa', 'Ekta', 'Falguni', 'Geeta', 'Heena', 'Indira', 'Jyoti',
  'Komal', 'Lata', 'Madhuri', 'Neha', 'Oviya', 'Priya', 'Queenie', 'Rani', 'Sunita', 'Trisha',
  'Usha', 'Vandana', 'Wahida', 'Yashoda', 'Zainab', 'Aishwarya', 'Bhumika', 'Chandni', 'Disha', 'Eshita',
  'Fiza', 'Garima', 'Hiral', 'Ipsita', 'Jaya', 'Kirti', 'Lekha', 'Manisha', 'Nidhi', 'Pallavi',
  'Rachna', 'Shweta', 'Trupti', 'Urvashi', 'Vaishali', 'Yukta', 'Aarohi', 'Bhakti', 'Chaitali', 'Devika',
  'Eshani', 'Falguni', 'Gargi', 'Himani', 'Ishani', 'Jhanvi', 'Kajal', 'Lata', 'Mitali', 'Nupur',
  'Oorja', 'Pragya', 'Ritika', 'Sakshi', 'Tanisha', 'Uttara', 'Vibha', 'Wamika', 'Yuvika', 'Zoya',
  'Aarushi', 'Bhavya', 'Chhavi', 'Dhriti', 'Eesha', 'Faria', 'Gul', 'Hamsika', 'Inaaya', 'Jasmyn',
  'Kritika', 'Lavesh', 'Mahima', 'Nandini', 'Ojaswini', 'Parul', 'Riddhi', 'Suhana', 'Tia', 'Urmi',
  'Vrishti', 'Warda', 'Yashvi', 'Zoya', 'Aanya', 'Bela', 'Charvi', 'Drishti', 'Ela', 'Fenna',
  'Gauri', 'Hita', 'Ira', 'Jia', 'Kaira', 'Liya', 'Mira', 'Nyra', 'Ovi', 'Pia',
  'Ria', 'Sia', 'Tiya', 'Una', 'Via', 'Wia', 'Yia', 'Zia', 'Aaradhya', 'Bhavika'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Rao', 'Nair', 'Iyer',
  'Menon', 'Pillai', 'Joshi', 'Desai', 'Mehta', 'Shah', 'Kapoor', 'Malhotra', 'Khanna', 'Chopra',
  'Agarwal', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Das', 'Bose', 'Sen', 'Ghosh', 'Roy', 'Dutta',
  'Sinha', 'Mishra', 'Tiwari', 'Pandey', 'Dubey', 'Yadav', 'Chauhan', 'Rathore', 'Solanki', 'Jadeja',
  'Thakur', 'Rajput', 'Bhat', 'Shetty', 'Hegde', 'Kamath', 'Pai', 'Shenoy', 'Kulkarni', 'Joshi',
  'Deshmukh', 'Patil', 'Jadhav', 'More', 'Shinde', 'Pawar', 'Gaikwad', 'Chavan', 'Kadam', 'Bhosale',
  'Naidu', 'Raju', 'Krishna', 'Prasad', 'Murthy', 'Ranganathan', 'Subramanian', 'Venkatesh', 'Srinivasan', 'Balaji',
  'Gowda', 'Shetty', 'Hegde', 'Rai', 'Bhandari', 'Kothari', 'Jain', 'Soni', 'Bansal', 'Goel',
  'Mittal', 'Goyal', 'Arora', 'Bhatia', 'Sethi', 'Anand', 'Saxena', 'Trivedi', 'Shukla', 'Dwivedi',
  'Pathak', 'Upadhyay', 'Chaturvedi', 'Bhargava', 'Kaul', 'Raina', 'Zutshi', 'Dhar', 'Koul', 'Pandita',
  'Lal', 'Choudhary', 'Ahlawat', 'Dahiya', 'Hooda', 'Malik', 'Rana', 'Tomar', 'Bisht', 'Negi',
  'Rawat', 'Gusain', 'Bargoti', 'Purohit', 'Dave', 'Trivedi', 'Bhatt', 'Pandya', 'Vyas', 'Joshi',
  'Acharya', 'Dixit', 'Nanda', 'Kohli', 'Bedi', 'Grewal', 'Gill', 'Sandhu', 'Dhillon', 'Brar',
  'Sidhu', 'Ahuja', 'Chawla', 'Oberoi', 'Khurana', 'Sodhi', 'Talwar', 'Walia', 'Bajaj', 'Mahajan',
  'Sood', 'Dua', 'Seth', 'Bakshi', 'Sahni', 'Tandon', 'Vohra', 'Grover', 'Dhawan', 'Luthra'
];

const MIDDLE_NAMES = [
  'Kumar', 'Prasad', 'Chandra', 'Lal', 'Singh', 'Devi', 'Bai', 'Rani', 'Nath', 'Das',
  'Raj', 'Dev', 'Prakash', 'Kant', 'Mohan', 'Suresh', 'Anand', 'Kishore', 'Bhushan', 'Vardhan'
];

const EMAIL_DOMAINS = [
  'company.com', 'techcorp.in', 'innovate.io', 'globaltech.com', 'nextgen.in'
];

const STREET_NAMES = [
  'MG Road', 'Residency Road', 'Church Street', 'Brigade Road', 'Commercial Street',
  'Indiranagar 100 Feet Road', 'Koramangala 4th Block', 'HSR Layout Sector 2', 'Whitefield Main Road',
  'Electronic City Phase 1', 'Bannerghatta Road', 'Outer Ring Road', 'Sarjapur Road', 'Bellandur',
  'Marathahalli Bridge', 'Old Airport Road', 'CV Raman Nagar', 'Hebbal Flyover', 'Yelahanka New Town',
  'Jayanagar 4th Block', 'Basavanagudi', 'Malleshwaram', 'Rajajinagar', 'Vijayanagar', 'Banashankari',
  'JP Nagar', 'BTM Layout', 'Silk Board', 'Bommanahalli', 'Hosur Road', 'Mysore Road',
  'Tumkur Road', 'Airport Road', 'Hebbal', 'Devanahalli', 'Yeshwanthpur', 'Peenya', 'Dasarahalli'
];

const CITIES = [
  'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi', 'Gurugram', 'Noida',
  'Ahmedabad', 'Kolkata', 'Jaipur', 'Chandigarh', 'Coimbatore', 'Kochi', 'Trivandrum',
  'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Warangal', 'Vizag', 'Vijayawada', 'Nagpur',
  'Indore', 'Bhopal', 'Lucknow', 'Kanpur', 'Patna', 'Ranchi', 'Bhubaneswar'
];

const SKILLS_POOL = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'Spring Boot',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'GitHub Actions',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Neo4j',
  'Kafka', 'RabbitMQ', 'GraphQL', 'REST APIs', 'gRPC', 'Microservices', 'System Design', 'Data Structures',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'Pandas', 'NumPy', 'Data Analysis', 'ETL', 'Spark', 'Hadoop', 'Airflow', 'dbt',
  'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Figma', 'Adobe XD',
  'Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'JUnit', 'pytest', 'TestNG',
  'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Project Management', 'Leadership', 'Mentoring',
  'Communication', 'Problem Solving', 'Critical Thinking', 'Teamwork', 'Time Management', 'Presentation Skills',
  'SalesForce', 'HubSpot', 'SEO', 'SEM', 'Google Analytics', 'Content Writing', 'Copywriting', 'Social Media Marketing',
  'Financial Modeling', 'Excel', 'Power BI', 'Tableau', 'SQL', 'Accounting', 'Budgeting', 'Forecasting',
  'Recruitment', 'Talent Acquisition', 'Performance Management', 'Employee Relations', 'HRIS', 'Compensation',
  'Contract Negotiation', 'Legal Research', 'Compliance', 'Risk Management', 'Intellectual Property'
];

const JOB_TITLES = {
  ENGINEERING: [
    'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer', 'Principal Engineer',
    'Engineering Manager', 'Senior Engineering Manager', 'Director of Engineering', 'VP of Engineering',
    'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Mobile Engineer', 'iOS Engineer',
    'Android Engineer', 'DevOps Engineer', 'SRE', 'Site Reliability Engineer', 'Cloud Engineer',
    'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Security Engineer', 'QA Engineer',
    'Senior QA Engineer', 'Test Automation Engineer', 'Architect', 'Solutions Architect', 'Technical Lead'
  ],
  HUMAN_RESOURCES: [
    'HR Executive', 'HR Generalist', 'Senior HR Generalist', 'HR Business Partner', 'Senior HRBP',
    'Talent Acquisition Specialist', 'Senior Recruiter', 'Talent Acquisition Manager', 'HR Manager',
    'HR Director', 'Compensation Analyst', 'Benefits Specialist', 'Learning & Development Specialist',
    'L&D Manager', 'Employee Relations Specialist', 'HR Operations Manager', 'Chief People Officer'
  ],
  FINANCE: [
    'Accountant', 'Senior Accountant', 'Financial Analyst', 'Senior Financial Analyst', 'FP&A Analyst',
    'Finance Manager', 'Controller', 'Senior Controller', 'Treasury Analyst', 'Tax Analyst',
    'Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Internal Auditor', 'CFO'
  ],
  SALES: [
    'Sales Development Representative', 'Account Executive', 'Senior Account Executive', 'Enterprise Account Executive',
    'Sales Manager', 'Regional Sales Manager', 'Director of Sales', 'VP of Sales', 'Customer Success Manager',
    'Senior Customer Success Manager', 'Sales Engineer', 'Solutions Consultant', 'Sales Operations Analyst'
  ],
  MARKETING: [
    'Marketing Executive', 'Content Writer', 'Senior Content Writer', 'SEO Specialist', 'Digital Marketing Specialist',
    'Demand Generation Manager', 'Product Marketing Manager', 'Brand Manager', 'Marketing Manager',
    'Director of Marketing', 'Growth Marketing Manager', 'Marketing Operations Specialist', 'CMO'
  ],
  PRODUCT: [
    'Product Analyst', 'Associate Product Manager', 'Product Manager', 'Senior Product Manager',
    'Group Product Manager', 'Director of Product', 'VP of Product', 'Chief Product Officer',
    'UX Designer', 'UI Designer', 'Senior UX Designer', 'Product Designer', 'User Researcher'
  ],
  OPERATIONS: [
    'Operations Executive', 'Operations Analyst', 'Operations Manager', 'Facilities Manager',
    'Procurement Specialist', 'Vendor Manager', 'Office Manager', 'Business Operations Manager'
  ],
  CUSTOMER_SUPPORT: [
    'Customer Support Executive', 'Support Engineer', 'Senior Support Engineer', 'Technical Support Specialist',
    'Support Team Lead', 'Support Manager', 'Customer Experience Manager', 'Knowledge Base Specialist'
  ],
  LEGAL: [
    'Legal Counsel', 'Senior Legal Counsel', 'Corporate Counsel', 'IP Counsel', 'Compliance Officer',
    'Privacy Counsel', 'General Counsel'
  ],
  RESEARCH: [
    'Research Scientist', 'Senior Research Scientist', 'Principal Scientist', 'Research Engineer',
    'AI Research Scientist', 'Research Manager'
  ]
};

module.exports = {
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  LAST_NAMES,
  MIDDLE_NAMES,
  EMAIL_DOMAINS,
  STREET_NAMES,
  CITIES,
  SKILLS_POOL,
  JOB_TITLES
};
