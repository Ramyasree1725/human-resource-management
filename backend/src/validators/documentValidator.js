/**
 * Document Validators
 * Input validation and sanitization rules for document related operations.
 * Used by controllers and services before persisting data.
 */

const { body, param, query, validationResult } = require('express-validator');

const documentValidationRules = {
  create: [
    // Common string fields
    body('firstName').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('firstName must be 1-100 chars'),
    body('lastName').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('lastName must be 1-100 chars'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').optional().isString().trim().isLength({ min: 8, max: 20 }),
    body('status').optional().isString().isIn(['ACTIVE', 'ON_PROBATION', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED', 'RETIRED', 'NOTICE_PERIOD']),
    body('employmentType').optional().isString(),
    body('departmentId').optional().isString(),
    body('salary').optional().isNumeric().toFloat(),
    body('joinDate').optional().isISO8601().toDate(),
    body('dateOfBirth').optional().isISO8601().toDate(),
    // Nested objects
    body('address').optional().isObject(),
    body('address.street').optional().isString(),
    body('address.city').optional().isString(),
    body('address.state').optional().isString(),
    body('address.pincode').optional().isString(),
    body('emergencyContact').optional().isObject(),
    body('skills').optional().isArray(),
    body('skills.*').optional().isString(),
  ],

  update: [
    param('id').isString().notEmpty().withMessage('ID is required'),
    body('firstName').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('lastName').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isString().trim(),
    body('status').optional().isString(),
    body('salary').optional().isNumeric().toFloat(),
    body('managerId').optional().isString(),
  ],

  list: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
    query('search').optional().isString().trim().isLength({ max: 100 }),
    query('status').optional().isString(),
    query('departmentId').optional().isString(),
    query('sortBy').optional().isString(),
    query('sortDir').optional().isIn(['asc', 'desc']),
  ],

  idParam: [
    param('id').isString().notEmpty().withMessage('Valid ID parameter is required'),
  ]
};

/**
 * Middleware that runs the validation chains and returns 400 on errors.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path || e.param,
        message: e.msg,
        value: e.value
      }))
    });
  }
  next();
}

/**
 * Custom business validators that go beyond express-validator.
 */
function validateDocumentBusinessRules(data, operation = 'create') {
  const errors = [];

  if (operation === 'create' || operation === 'update') {
    if (data.salary !== undefined && data.salary < 0) {
      errors.push({ field: 'salary', message: 'Salary cannot be negative' });
    }
    if (data.joinDate && data.dateOfBirth) {
      const join = new Date(data.joinDate);
      const dob = new Date(data.dateOfBirth);
      const ageAtJoin = (join - dob) / (365.25 * 24 * 60 * 60 * 1000);
      if (ageAtJoin < 16) {
        errors.push({ field: 'dateOfBirth', message: 'Employee must be at least 16 years old at join date' });
      }
    }
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  return errors;
}

/**
 * Sanitize incoming payload - strip unknown fields, trim strings, etc.
 */
function sanitizeDocumentPayload(payload) {
  if (!payload || typeof payload !== 'object') return {};
  const allowed = [
    'firstName', 'middleName', 'lastName', 'email', 'phone', 'alternatePhone',
    'gender', 'dateOfBirth', 'bloodGroup', 'maritalStatus', 'nationality',
    'address', 'emergencyContact', 'departmentId', 'subDepartmentId', 'jobTitle',
    'employmentType', 'status', 'workLocationId', 'joinDate', 'salary', 'currency',
    'skills', 'education', 'bankDetails', 'managerId', 'role', 'bio', 'linkedinUrl',
    'yearsOfExperience', 'performanceRating', 'tags', 'leaveType', 'startDate',
    'endDate', 'days', 'reason', 'comments'
  ];
  const clean = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      if (typeof payload[key] === 'string') {
        clean[key] = payload[key].trim();
      } else {
        clean[key] = payload[key];
      }
    }
  }
  return clean;
}

module.exports = {
  documentValidationRules,
  validate,
  validateDocumentBusinessRules,
  sanitizeDocumentPayload
};
