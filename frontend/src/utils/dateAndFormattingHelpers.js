/**
 * Date, Currency, Timezone & Regional Localization Helpers
 * Provides comprehensive formatting utilities for enterprise Indian HRMS:
 * - Indian currency notation formatting (Lakhs, Crores, INR formatting)
 * - Financial Year, Assessment Year & Fiscal Quarter calculators
 * - Age, tenure, and continuous service duration formatters
 * - Shift timing, elapsed time, and working hours calculation utilities.
 */

export class DateAndFormattingHelpers {
  static formatIndianRupees(amount, includeSymbol = true) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return includeSymbol ? '₹0' : '0';
    }
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(Math.round(Number(amount)));

    return includeSymbol ? `₹${formatted}` : formatted;
  }

  static formatLakhsAndCrores(amount) {
    const num = Number(amount || 0);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return DateAndFormattingHelpers.formatIndianRupees(num);
  }

  static getFinancialYear(date = new Date()) {
    const d = new Date(date);
    const month = d.getMonth(); // 0 = Jan, 3 = Apr
    const year = d.getFullYear();

    if (month >= 3) {
      return {
        financialYear: `${year}-${year + 1}`,
        assessmentYear: `${year + 1}-${year + 2}`,
        currentQuarter: month <= 5 ? 'Q1' : (month <= 8 ? 'Q2' : 'Q3')
      };
    } else {
      return {
        financialYear: `${year - 1}-${year}`,
        assessmentYear: `${year}-${year + 1}`,
        currentQuarter: 'Q4'
      };
    }
  }

  static calculateWorkDurationHours(inTimeString, outTimeString) {
    if (!inTimeString || !outTimeString || inTimeString === '--' || outTimeString === '--') {
      return 0;
    }

    const parseTime = (str) => {
      const parts = str.trim().split(/[:\s]/);
      let hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const ampm = parts[2] ? parts[2].toUpperCase() : '';

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    try {
      const inMinutes = parseTime(inTimeString);
      const outMinutes = parseTime(outTimeString);
      const diffMinutes = outMinutes - inMinutes;
      if (diffMinutes <= 0) return 0;

      return Number((diffMinutes / 60).toFixed(1));
    } catch (e) {
      return 0;
    }
  }

  static getHumanReadableTenure(joiningDate, exitDate = new Date()) {
    if (!joiningDate) return 'N/A';
    const start = new Date(joiningDate);
    const end = new Date(exitDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return '0 months';

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365.25);
    const remainingDays = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDays / 30.4375);

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(' ') : `${totalDays} days`;
  }
}
