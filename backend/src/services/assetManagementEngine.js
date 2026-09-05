/**
 * IT Asset Lifecycle, Depreciation & Exit Clearance Engine
 * Manages company hardware assets:
 * - Laptop, monitor & peripheral inventory allocation
 * - Straight-Line (SLM) & Written Down Value (WDV) depreciation calculation
 * - IT Asset exit clearance workflow & recovery calculations.
 */

export const ASSET_CATEGORIES = {
  LAPTOP_PREMIUM: { type: 'MacBook Pro / ThinkPad X1', usefulLifeYears: 3, salvageValuePercentage: 10, slmDepreciationRate: 30 },
  LAPTOP_STANDARD: { type: 'Dell Latitude / HP EliteBook', usefulLifeYears: 3, salvageValuePercentage: 10, slmDepreciationRate: 30 },
  MONITOR: { type: '27-inch 4K Monitor', usefulLifeYears: 4, salvageValuePercentage: 5, slmDepreciationRate: 23.75 },
  SMARTPHONE: { type: 'Corporate Testing Device', usefulLifeYears: 2, salvageValuePercentage: 10, slmDepreciationRate: 45 },
  PERIPHERALS: { type: 'Keyboard, Mouse, Headset', usefulLifeYears: 2, salvageValuePercentage: 0, slmDepreciationRate: 50 }
};

export class AssetManagementEngine {
  constructor() {
    this.companyCode = 'TN-IT-ASSET';
  }

  calculateAssetDepreciation(purchaseCost = 120000, purchaseDate = '2024-01-15', category = 'LAPTOP_PREMIUM') {
    const assetMeta = ASSET_CATEGORIES[category] || ASSET_CATEGORIES.LAPTOP_STANDARD;
    const pDate = new Date(purchaseDate);
    const today = new Date();
    const ageInDays = Math.max(0, Math.floor((today - pDate) / (1000 * 60 * 60 * 24)));
    const ageInYears = ageInDays / 365.25;

    const salvageValue = Math.round(purchaseCost * (assetMeta.salvageValuePercentage / 100));
    const depreciableCost = purchaseCost - salvageValue;
    const annualSLMDepreciation = depreciableCost / assetMeta.usefulLifeYears;

    const totalAccumulatedDepreciation = Math.min(depreciableCost, Math.round(annualSLMDepreciation * ageInYears));
    const currentBookValue = Math.max(salvageValue, purchaseCost - totalAccumulatedDepreciation);

    return {
      category,
      purchaseCost,
      purchaseDate,
      ageInYears: Number(ageInYears.toFixed(2)),
      salvageValue,
      usefulLifeYears: assetMeta.usefulLifeYears,
      annualDepreciationSLM: Math.round(annualSLMDepreciation),
      totalAccumulatedDepreciation,
      currentBookValue,
      isFullyDepreciated: currentBookValue <= salvageValue
    };
  }

  processExitAssetHandover(allocatedAssets = []) {
    let totalAssigned = allocatedAssets.length;
    let totalReturned = 0;
    let totalDamagedOrMissing = 0;
    let totalRecoveryDeduction = 0;
    const clearanceRoster = [];

    allocatedAssets.forEach(asset => {
      const depInfo = this.calculateAssetDepreciation(asset.purchaseCost || 80000, asset.assignedDate || '2024-06-01', asset.category || 'LAPTOP_STANDARD');
      const isReturned = asset.status === 'RETURNED_IN_GOOD_CONDITION';
      const isDamaged = asset.status === 'PHYSICALLY_DAMAGED';
      const isMissing = asset.status === 'LOST_OR_MISSING';

      let penalty = 0;
      if (isMissing) {
        penalty = depInfo.currentBookValue;
        totalDamagedOrMissing++;
      } else if (isDamaged) {
        penalty = Math.round(depInfo.currentBookValue * 0.40); // 40% repair deduction
        totalDamagedOrMissing++;
      } else {
        totalReturned++;
      }

      totalRecoveryDeduction += penalty;

      clearanceRoster.push({
        assetTag: asset.assetTag,
        modelName: asset.modelName,
        serialNumber: asset.serialNumber,
        conditionReport: asset.status,
        originalValue: asset.purchaseCost,
        currentBookValue: depInfo.currentBookValue,
        recoveryDeductionRequired: penalty,
        clearancePassed: isReturned
      });
    });

    const isAllClear = totalDamagedOrMissing === 0;

    return {
      totalAssignedAssets: totalAssigned,
      totalSuccessfullyReturned: totalReturned,
      unreturnedOrDamagedCount: totalDamagedOrMissing,
      totalExitClearanceDeduction: totalRecoveryDeduction,
      itNoObjectionCertificateGranted: isAllClear,
      clearanceStatus: isAllClear ? 'IT_CLEARANCE_APPROVED' : 'PAYROLL_HOLD_PENDING_RECOVERY',
      assetClearanceRoster: clearanceRoster
    };
  }
}

export const assetManagementEngine = new AssetManagementEngine();
