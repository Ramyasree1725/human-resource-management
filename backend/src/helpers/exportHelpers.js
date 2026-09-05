/**
 * exportHelpers - Utility helpers for the Employee Management System
 * Pure functions used across services, controllers and reports.
 * Production application code.
 */

/**
 * Safe date parsing with fallback.
 */
function parseDate(value, fallback = null) {
  if (!value) return fallback;
  const d = new Date(value);
  return isNaN(d.getTime()) ? fallback : d;
}

/**
 * Format date to ISO date string (YYYY-MM-DD).
 */
function toDateString(date) {
  if (!date) return null;
  const d = parseDate(date);
  if (!d) return null;
  return d.toISOString().split('T')[0];
}

/**
 * Calculate difference in days between two dates.
 */
function daysBetween(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return 0;
  const diff = e.getTime() - s.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check whether a date falls on a weekend.
 */
function isWeekend(date) {
  const d = parseDate(date);
  if (!d) return false;
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Add business days (skipping weekends).
 */
function addBusinessDays(startDate, days) {
  let current = parseDate(startDate);
  if (!current) return null;
  let added = 0;
  while (added < days) {
    current.setDate(current.getDate() + 1);
    if (!isWeekend(current)) added++;
  }
  return current;
}

/**
 * Generate a range of dates between start and end inclusive.
 */
function dateRange(start, end) {
  const result = [];
  let current = parseDate(start);
  const last = parseDate(end);
  if (!current || !last) return result;
  while (current <= last) {
    result.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}

/**
 * Deep clone a plain object / array.
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick selected keys from an object.
 */
function pick(obj, keys) {
  if (!obj) return {};
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      out[k] = obj[k];
    }
  }
  return out;
}

/**
 * Omit keys from an object.
 */
function omit(obj, keys) {
  if (!obj) return {};
  const out = { ...obj };
  for (const k of keys) delete out[k];
  return out;
}

/**
 * Group an array of objects by a key.
 */
function groupBy(arr, keyFn) {
  const map = {};
  for (const item of arr) {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return map;
}

/**
 * Simple in-memory debounce (returns a function).
 */
function debounce(fn, wait = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Format currency in INR.
 */
function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a number with Indian-style commas.
 */
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Truncate string with ellipsis.
 */
function truncate(str, max = 50) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

/**
 * Generate a simple slug from a string.
 */
function slugify(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object).
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Safe JSON parse.
 */
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Calculate percentage.
 */
function percentage(part, whole, decimals = 1) {
  if (!whole || whole === 0) return 0;
  return Number(((part / whole) * 100).toFixed(decimals));
}

/**
 * Clamp a number between min and max.
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate a random integer between min and max inclusive.
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle array (Fisher-Yates) - returns new array.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Unique values from array.
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Chunk array into pieces of given size.
 */
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Sleep helper for async flows.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build a standard success response object.
 */
function successResponse(data, meta = {}) {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}

/**
 * Build a standard error response object.
 */
function errorResponse(message, statusCode = 400, errors = null) {
  return {
    success: false,
    message,
    statusCode,
    errors,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  parseDate,
  toDateString,
  daysBetween,
  isWeekend,
  addBusinessDays,
  dateRange,
  deepClone,
  pick,
  omit,
  groupBy,
  debounce,
  formatCurrency,
  formatNumber,
  truncate,
  slugify,
  isEmpty,
  safeJsonParse,
  percentage,
  clamp,
  randomInt,
  shuffle,
  unique,
  chunk,
  sleep,
  successResponse,
  errorResponse
};
