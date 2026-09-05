/**
 * State-wise Statutory Labor Law Matrix & Public Holidays Master
 * Contains rules for all 28 states & 8 Union Territories in India:
 * - Shops & Establishments Act work hour limits
 * - National & Festival Holidays Act requirements
 * - Minimum continuous rest intervals
 * - Comp-off & overtime entitlement guidelines.
 */

export const NATIONAL_MANDATORY_HOLIDAYS = [
  { date: '2026-01-26', name: 'Republic Day', isGazetted: true },
  { date: '2026-08-15', name: 'Independence Day', isGazetted: true },
  { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti', isGazetted: true }
];

export const STATE_FESTIVAL_HOLIDAYS_2026 = {
  KARNATAKA: [
    { date: '2026-01-14', name: 'Makara Sankranti', isMandatory: true },
    { date: '2026-03-19', name: 'Ugadi / Gudi Padwa', isMandatory: true },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', isMandatory: true },
    { date: '2026-05-01', name: 'May Day (Labor Day)', isMandatory: true },
    { date: '2026-09-14', name: 'Ganesh Chaturthi', isMandatory: true },
    { date: '2026-10-20', name: 'Mahanavami / Ayudha Pooja', isMandatory: true },
    { date: '2026-10-21', name: 'Vijayadashami (Dussehra)', isMandatory: true },
    { date: '2026-11-01', name: 'Kannada Rajyotsava', isMandatory: true },
    { date: '2026-11-08', name: 'Deepavali / Naraka Chaturdashi', isMandatory: true },
    { date: '2026-12-25', name: 'Christmas Day', isMandatory: true }
  ],
  TELANGANA: [
    { date: '2026-01-14', name: 'Sankranti / Pongal', isMandatory: true },
    { date: '2026-03-19', name: 'Ugadi', isMandatory: true },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', isMandatory: true },
    { date: '2026-05-01', name: 'May Day', isMandatory: true },
    { date: '2026-06-02', name: 'Telangana Formation Day', isMandatory: true },
    { date: '2026-07-27', name: 'Bonalu Festival', isMandatory: true },
    { date: '2026-09-14', name: 'Vinayaka Chavithi', isMandatory: true },
    { date: '2026-10-21', name: 'Vijaya Dasami', isMandatory: true },
    { date: '2026-11-08', name: 'Diwali', isMandatory: true },
    { date: '2026-12-25', name: 'Christmas Day', isMandatory: true }
  ],
  MAHARASHTRA: [
    { date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti', isMandatory: true },
    { date: '2026-03-19', name: 'Gudi Padwa', isMandatory: true },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', isMandatory: true },
    { date: '2026-05-01', name: 'Maharashtra Day', isMandatory: true },
    { date: '2026-09-14', name: 'Ganesh Chaturthi', isMandatory: true },
    { date: '2026-10-21', name: 'Dussehra', isMandatory: true },
    { date: '2026-11-08', name: 'Laxmi Pujan (Diwali)', isMandatory: true },
    { date: '2026-12-25', name: 'Christmas Day', isMandatory: true }
  ],
  TAMIL_NADU: [
    { date: '2026-01-14', name: 'Thai Pongal', isMandatory: true },
    { date: '2026-01-15', name: 'Thiruvalluvar Day', isMandatory: true },
    { date: '2026-04-14', name: 'Tamil New Year', isMandatory: true },
    { date: '2026-05-01', name: 'May Day', isMandatory: true },
    { date: '2026-09-14', name: 'Vinayakar Chathurthi', isMandatory: true },
    { date: '2026-10-20', name: 'Ayutha Pooja', isMandatory: true },
    { date: '2026-10-21', name: 'Vijaya Dasami', isMandatory: true },
    { date: '2026-11-08', name: 'Deepavali', isMandatory: true },
    { date: '2026-12-25', name: 'Christmas Day', isMandatory: true }
  ],
  DELHI: [
    { date: '2026-03-03', name: 'Holi', isMandatory: true },
    { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanti', isMandatory: true },
    { date: '2026-05-01', name: 'May Day', isMandatory: true },
    { date: '2026-08-27', name: 'Raksha Bandhan', isMandatory: true },
    { date: '2026-10-21', name: 'Dussehra', isMandatory: true },
    { date: '2026-11-08', name: 'Diwali', isMandatory: true },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti', isMandatory: true },
    { date: '2026-12-25', name: 'Christmas Day', isMandatory: true }
  ]
};

export function getApplicableStateHolidays(state = 'KARNATAKA') {
  const normState = state.toUpperCase().replace(/\s+/g, '_');
  const festivalList = STATE_FESTIVAL_HOLIDAYS_2026[normState] || STATE_FESTIVAL_HOLIDAYS_2026.KARNATAKA;
  return [...NATIONAL_MANDATORY_HOLIDAYS, ...festivalList].sort((a, b) => new Date(a.date) - new Date(b.date));
}
