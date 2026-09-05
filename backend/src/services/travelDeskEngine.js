/**
 * Corporate Travel Desk & Per Diem Expense Engine
 * Manages domestic and international business travel workflows:
 * - City tier daily allowance (Per Diem) calculation
 * - Flight & Rail travel class eligibility matrix based on employee level
 * - Lodging / Hotel room night caps by city category
 * - Forex exchange calculation & travel advance reconciliations.
 */

export const TRAVEL_CLASS_ELIGIBILITY = {
  IC1: { domesticAir: false, domesticRail: '2AC', localCab: 'Economy / UberGo', lodgingCapTier1: 3500, lodgingCapTier2: 2500, perDiemTier1: 1200, perDiemTier2: 800 },
  IC2: { domesticAir: false, domesticRail: '2AC', localCab: 'Economy / UberGo', lodgingCapTier1: 4000, lodgingCapTier2: 3000, perDiemTier1: 1500, perDiemTier2: 1000 },
  IC3: { domesticAir: true, flightClass: 'Economy', domesticRail: '1AC', localCab: 'Sedan / UberPremier', lodgingCapTier1: 5500, lodgingCapTier2: 4000, perDiemTier1: 2000, perDiemTier2: 1400 },
  IC4: { domesticAir: true, flightClass: 'Economy', domesticRail: '1AC', localCab: 'Sedan / UberPremier', lodgingCapTier1: 7000, lodgingCapTier2: 5000, perDiemTier1: 2500, perDiemTier2: 1800 },
  IC5: { domesticAir: true, flightClass: 'Economy', domesticRail: '1AC', localCab: 'Executive / Dedicated Cab', lodgingCapTier1: 9000, lodgingCapTier2: 6500, perDiemTier1: 3000, perDiemTier2: 2200 },
  IC6: { domesticAir: true, flightClass: 'Business (over 4 hrs) / Economy', domesticRail: '1AC', localCab: 'Executive / Dedicated Cab', lodgingCapTier1: 12000, lodgingCapTier2: 8500, perDiemTier1: 4000, perDiemTier2: 3000 },
  M1: { domesticAir: true, flightClass: 'Economy', domesticRail: '1AC', localCab: 'Sedan / UberPremier', lodgingCapTier1: 6000, lodgingCapTier2: 4500, perDiemTier1: 2200, perDiemTier2: 1500 },
  M2: { domesticAir: true, flightClass: 'Economy', domesticRail: '1AC', localCab: 'Sedan / UberPremier', lodgingCapTier1: 7500, lodgingCapTier2: 5500, perDiemTier1: 2800, perDiemTier2: 2000 },
  M3: { domesticAir: true, flightClass: 'Business / Economy', domesticRail: '1AC', localCab: 'Executive / Dedicated Cab', lodgingCapTier1: 10000, lodgingCapTier2: 7500, perDiemTier1: 3500, perDiemTier2: 2500 },
  M4: { domesticAir: true, flightClass: 'Business', domesticRail: '1AC', localCab: 'Premium Luxury / Chauffeur', lodgingCapTier1: 15000, lodgingCapTier2: 10000, perDiemTier1: 5000, perDiemTier2: 3500 }
};

export const INTERNATIONAL_PER_DIEM_RATES = {
  ZONE_A_USA_UK_EUROPE: { dailyAllowanceUSD: 120, hotelCapUSD: 250, incidentalsUSD: 30 },
  ZONE_B_SINGAPORE_DUBAI_JAPAN: { dailyAllowanceUSD: 100, hotelCapUSD: 200, incidentalsUSD: 25 },
  ZONE_C_SOUTHEAST_ASIA_AFRICA: { dailyAllowanceUSD: 75, hotelCapUSD: 150, incidentalsUSD: 20 },
  ZONE_D_REST_OF_WORLD: { dailyAllowanceUSD: 85, hotelCapUSD: 175, incidentalsUSD: 20 }
};

export class TravelDeskEngine {
  constructor() {
    this.forexUsdInrRate = 84.50;
  }

  evaluateTravelRequest(employeeLevel = 'IC3', travelDetails = {}) {
    const {
      destinationCity = 'Mumbai',
      isDomestic = true,
      travelStartDate,
      travelEndDate,
      modeRequested = 'AIR',
      hotelRoomNightRate = 4500,
      advanceRequested = 0,
      internationalZone = 'ZONE_A_USA_UK_EUROPE'
    } = travelDetails;

    const start = new Date(travelStartDate);
    const end = new Date(travelEndDate);
    const tripDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    const hotelNights = Math.max(1, tripDays - 1);

    const eligibility = TRAVEL_CLASS_ELIGIBILITY[employeeLevel] || TRAVEL_CLASS_ELIGIBILITY.IC3;
    const isTier1City = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'].includes(destinationCity);

    const issues = [];
    let allowableHotelNightCap = 0;
    let allowableDailyPerDiem = 0;
    let totalEligiblePerDiem = 0;
    let totalEligibleHotelBudget = 0;

    if (isDomestic) {
      allowableHotelNightCap = isTier1City ? eligibility.lodgingCapTier1 : eligibility.lodgingCapTier2;
      allowableDailyPerDiem = isTier1City ? eligibility.perDiemTier1 : eligibility.perDiemTier2;
      totalEligiblePerDiem = allowableDailyPerDiem * tripDays;
      totalEligibleHotelBudget = allowableHotelNightCap * hotelNights;

      if (modeRequested === 'AIR' && !eligibility.domesticAir) {
        issues.push(`Employee band (${employeeLevel}) is not entitled to Domestic Air Travel under company policy.`);
      }
      if (hotelRoomNightRate > allowableHotelNightCap) {
        issues.push(`Hotel room tariff (₹${hotelRoomNightRate}/night) exceeds band cap of ₹${allowableHotelNightCap}/night.`);
      }
    } else {
      const zoneRates = INTERNATIONAL_PER_DIEM_RATES[internationalZone] || INTERNATIONAL_PER_DIEM_RATES.ZONE_D_REST_OF_WORLD;
      allowableDailyPerDiem = Math.round(zoneRates.dailyAllowanceUSD * this.forexUsdInrRate);
      allowableHotelNightCap = Math.round(zoneRates.hotelCapUSD * this.forexUsdInrRate);
      totalEligiblePerDiem = allowableDailyPerDiem * tripDays;
      totalEligibleHotelBudget = allowableHotelNightCap * hotelNights;
    }

    const estimatedTripBudget = totalEligiblePerDiem + totalEligibleHotelBudget + (isDomestic ? 8000 : 75000);
    const advanceApproved = Math.min(advanceRequested, Math.round(estimatedTripBudget * 0.80));

    return {
      employeeLevel,
      destinationCity,
      tripDays,
      hotelNights,
      isDomestic,
      policyCompliance: {
        isApproved: issues.length === 0,
        policyExceptions: issues,
        requiresExecutiveOverride: issues.length > 0
      },
      allowances: {
        dailyPerDiemRate: allowableDailyPerDiem,
        totalPerDiemBudget: totalEligiblePerDiem,
        hotelNightCap: allowableHotelNightCap,
        totalHotelBudget: totalEligibleHotelBudget,
        travelModeEntitlement: isDomestic ? (eligibility.domesticAir ? eligibility.flightClass : eligibility.domesticRail) : 'Economy International',
        localCommuteMode: eligibility.localCab
      },
      financialSummary: {
        estimatedTotalTripBudget: estimatedTripBudget,
        advanceRequested,
        advanceApproved,
        settlementDueDaysAfterReturn: 7
      }
    };
  }

  reconcileExpenseClaim(tripDetails = {}, actualExpenses = []) {
    let totalSubmitted = 0;
    let totalApproved = 0;
    const itemizedReview = [];

    actualExpenses.forEach(item => {
      totalSubmitted += (item.amount || 0);
      const isReceiptPresent = Boolean(item.receiptUrl || item.hasReceipt);
      let approvedAmount = item.amount || 0;
      let reviewStatus = 'APPROVED';

      if (!isReceiptPresent && item.amount > 500) {
        approvedAmount = 0;
        reviewStatus = 'REJECTED_NO_RECEIPT';
      }

      totalApproved += approvedAmount;
      itemizedReview.push({
        category: item.category,
        claimedAmount: item.amount,
        approvedAmount,
        receiptAttached: isReceiptPresent,
        status: reviewStatus
      });
    });

    const advancePaid = tripDetails.advancePaid || 0;
    const balancePayableToEmployee = Math.max(0, totalApproved - advancePaid);
    const recoveryFromEmployee = Math.max(0, advancePaid - totalApproved);

    return {
      tripId: tripDetails.tripId,
      employeeId: tripDetails.employeeId,
      totalClaimSubmitted: totalSubmitted,
      totalClaimApproved: totalApproved,
      advanceGiven: advancePaid,
      settlementAction: balancePayableToEmployee > 0 ? 'PAY_TO_EMPLOYEE' : (recoveryFromEmployee > 0 ? 'RECOVER_FROM_EMPLOYEE' : 'NIL_BALANCE'),
      settlementAmount: balancePayableToEmployee > 0 ? balancePayableToEmployee : recoveryFromEmployee,
      auditTimestamp: new Date().toISOString(),
      itemizedReview
    };
  }
}

export const travelDeskEngine = new TravelDeskEngine();
