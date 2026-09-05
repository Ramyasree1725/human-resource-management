/**
 * Lookup table and configuration module 27
 * Extensive reference data for Employee Management System.
 */

const LOOKUP_27 = {
  categories: [
    { id: "cat_27_01", name: "Category A27", weight: 1.0, active: true },
    { id: "cat_27_02", name: "Category B27", weight: 1.2, active: true },
    { id: "cat_27_03", name: "Category C27", weight: 0.8, active: true },
    { id: "cat_27_04", name: "Category D27", weight: 1.5, active: false },
    { id: "cat_27_05", name: "Category E27", weight: 1.1, active: true }
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
  moduleId: 27
};

function getCategory27(id) {
  return LOOKUP_27.categories.find(c => c.id === id) || null;
}

function getScoreLabel27(score) {
  const s = LOOKUP_27.scores;
  if (score >= s.outstanding.min) return s.outstanding;
  if (score >= s.exceeds.min) return s.exceeds;
  if (score >= s.meets.min) return s.meets;
  if (score >= s.needsImprovement.min) return s.needsImprovement;
  return s.unsatisfactory;
}

function getSalaryBand27(salary) {
  return LOOKUP_27.bands.find(b => salary >= b.minSalary && salary <= b.maxSalary) || null;
}

function listReasons27() {
  return [...LOOKUP_27.reasons];
}

module.exports = {
  LOOKUP_27,
  getCategory27,
  getScoreLabel27,
  getSalaryBand27,
  listReasons27
};
