/**
 * Staffing Vendor, Contractor SLA & CLRA Compliance Engine
 * Governs third-party workforce suppliers and outsourced service providers:
 * - Contract Labour (Regulation and Abolition) Act, 1970 compliance validation
 * - Staffing agency Service Level Agreement (SLA) fulfillment metrics
 * - Monthly contractor billing ledger reconciliation (TDS 194C / 194J)
 * - Vendor performance scorecards and rate contract governance.
 */

export class VendorContractLifecycleEngine {
  constructor() {
    this.principalEmployerCode = 'PE-KA-BLR-00987';
  }

  auditVendorCLRACompliance(vendorDetails = {}, deployedWorkerCount = 25) {
    const isClraLicenceMandatory = deployedWorkerCount >= 20;
    const issues = [];

    if (isClraLicenceMandatory && !vendorDetails.hasValidCLRALicence) {
      issues.push(`Vendor deploys ${deployedWorkerCount} contract workers (>=20 threshold) but lacks valid Form VI Labour Licence.`);
    }

    if (!vendorDetails.pfCode || !vendorDetails.esicCode) {
      issues.push('Vendor must possess independent EPFO and ESIC sub-codes for deployed contract labor.');
    }

    if (!vendorDetails.wagesPaidThroughBankTransfer) {
      issues.push('Contract worker wages must be credited directly via bank account transfer before 7th of the month.');
    }

    const isCompliant = issues.length === 0;

    return {
      vendorId: vendorDetails.vendorId,
      vendorName: vendorDetails.name || 'External Staffing Partner',
      deployedWorkerCount,
      clraLicenceMandatory: isClraLicenceMandatory,
      isCompliant,
      complianceHealthScore: isCompliant ? 100 : Math.max(30, 100 - (issues.length * 35)),
      auditFindings: issues,
      clearanceForMonthlyInvoicePayment: isCompliant
    };
  }

  reconcileVendorMonthlyInvoice(invoiceData = {}, deployedStaffPunches = []) {
    const {
      vendorId,
      invoiceNumber,
      billedHeadcount = 0,
      totalHoursBilled = 0,
      hourlyBillingRate = 450,
      managementFeePercentage = 8.5,
      isTechnicalStaffing = true
    } = invoiceData;

    // Calculate actual logged hours from biometric punch system
    const actualLoggedHours = deployedStaffPunches.reduce((sum, p) => sum + (p.hoursWorked || 8), 0);
    const billingRateApplied = hourlyBillingRate;
    const baseDirectLaborCost = actualLoggedHours * billingRateApplied;
    const agencyMarkupFee = Math.round(baseDirectLaborCost * (managementFeePercentage / 100));
    const subTotal = baseDirectLaborCost + agencyMarkupFee;

    // GST 18%
    const gstAmount = Math.round(subTotal * 0.18);
    const invoiceGrossTotal = subTotal + gstAmount;

    // TDS Deduction: 194J (10% for tech/professional) or 194C (2% for general contract)
    const tdsSection = isTechnicalStaffing ? '194J' : '194C';
    const tdsRate = isTechnicalStaffing ? 0.10 : 0.02;
    const tdsDeducted = Math.round(subTotal * tdsRate);
    const netPayableToVendor = invoiceGrossTotal - tdsDeducted;

    return {
      invoiceNumber,
      vendorId,
      reconciliationStatus: Math.abs(totalHoursBilled - actualLoggedHours) < 10 ? 'RECONCILED_MATCH' : 'VARIANCE_DISCREPANCY',
      hoursComparison: {
        billedHours: totalHoursBilled,
        biometricVerifiedHours: actualLoggedHours,
        discrepancyHours: totalHoursBilled - actualLoggedHours
      },
      commercialSettlement: {
        directLaborCost: baseDirectLaborCost,
        agencyMarkup: agencyMarkupFee,
        subTotalTaxable: subTotal,
        gst18Pct: gstAmount,
        invoiceGrossTotal,
        tdsWithheld: {
          section: tdsSection,
          rate: `${tdsRate * 100}%`,
          amount: tdsDeducted
        },
        netPayableToVendor
      }
    };
  }
}

export const vendorContractLifecycleEngine = new VendorContractLifecycleEngine();
