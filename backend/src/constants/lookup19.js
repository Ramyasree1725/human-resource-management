/**
 * Lookup table and configuration module 19
 * Extensive reference data for Employee Management System.
 */

const LOOKUP_19 = {
  categories: [
    { id: "cat_19_01", name: "Category A19", weight: 1.0, active: true },
    { id: "cat_19_02", name: "Category B19", weight: 1.2, active: true },
    { id: "cat_19_03", name: "Category C19", weight: 0.8, active: true },
    { id: "cat_19_04", name: "Category D19", weight: 1.5, active: false },
    { id: "cat_19_05", name: "Category E19", weight: 1.1, active: true }
  ],
  scores: {
    outstanding: { min: 90, max: 100, label: "Outstanding", color: "#22c55e" },
    exceeds: { min: 75, max: 89, label: "Exceeds", color: "#3b82f6" },
    meets: { min: 60, max: 74, label: "Meets", color: "#eab308" },
    needsImprovement: { min: 40, max: 59, label: "Needs Improvement", color: "#f97316" },
    unsatisfactory: { min: 0, max: 39, label: "Unsatisfactory", color: "#ef4444" }
  },
  bands: [
    { band: "L1", minSalary: 300000, maxSalary: 600000, level: 1 },
    { band: "L2", minSalary: 600001, maxSalary: 1000000, level: 2 },
    { band: "L3", minSalary: 1000001, maxSalary: 1600000, level: 3 },
    { band: "L4", minSalary: 1600001, maxSalary: 2500000, level: 4 },
    { band: "L5", minSalary: 2500001, maxSalary: 4000000, level: 5 },
    { band: "L6", minSalary: 4000001, maxSalary: 7000000, level: 6 }
  ],
  reasons: [
    "Personal reasons", "Family emergency", "Medical", "Education", "Travel",
    "Wedding", "Relocation", "Career growth", "Compensation", "Work-life balance",
    "Management issues", "Role mismatch", "Health", "Higher studies", "Other"
  ],
  moduleId: 19
};

function getCategory19(id) {
  return LOOKUP_19.categories.find(c => c.id === id) || null;
}

function getScoreLabel19(score) {
  const s = LOOKUP_19.scores;
  if (score >= s.outstanding.min) return s.outstanding;
  if (score >= s.exceeds.min) return s.exceeds;
  if (score >= s.meets.min) return s.meets;
  if (score >= s.needsImprovement.min) return s.needsImprovement;
  return s.unsatisfactory;
}

function getSalaryBand19(salary) {
  return LOOKUP_19.bands.find(b => salary >= b.minSalary && salary <= b.maxSalary) || null;
}

function listReasons19() {
  return [...LOOKUP_19.reasons];
}

module.exports = {
  LOOKUP_19,
  getCategory19,
  getScoreLabel19,
  getSalaryBand19,
  listReasons19
};
