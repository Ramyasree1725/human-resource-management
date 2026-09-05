/**
 * Comprehensive Indian Pincode, City Tier & HRA Classification Matrix
 * Provides city tier classifications (Tier 1 / Metro, Tier 2, Tier 3)
 * used for HRA exemption percentage rules (50% vs 40%), relocation allowances,
 * and cost-of-living adjustments across India.
 */

export const CITY_TIER_CLASSIFICATIONS = {
  TIER_1_METRO: [
    { city: 'Bangalore', state: 'Karnataka', isMetroHRA: true, metroCode: 'BLR', standardAllowance: 5000 },
    { city: 'Hyderabad', state: 'Telangana', isMetroHRA: true, metroCode: 'HYD', standardAllowance: 5000 },
    { city: 'Mumbai', state: 'Maharashtra', isMetroHRA: true, metroCode: 'MUM', standardAllowance: 6000 },
    { city: 'Delhi', state: 'Delhi', isMetroHRA: true, metroCode: 'DEL', standardAllowance: 6000 },
    { city: 'Chennai', state: 'Tamil Nadu', isMetroHRA: true, metroCode: 'CHN', standardAllowance: 5000 },
    { city: 'Kolkata', state: 'West Bengal', isMetroHRA: true, metroCode: 'CCU', standardAllowance: 5000 },
    { city: 'Pune', state: 'Maharashtra', isMetroHRA: true, metroCode: 'PNQ', standardAllowance: 4500 },
    { city: 'Ahmedabad', state: 'Gujarat', isMetroHRA: true, metroCode: 'AMD', standardAllowance: 4500 }
  ],
  TIER_2_URBAN: [
    { city: 'Jaipur', state: 'Rajasthan', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Lucknow', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Chandigarh', state: 'Punjab', isMetroHRA: false, standardAllowance: 3500 },
    { city: 'Indore', state: 'Madhya Pradesh', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Coimbatore', state: 'Tamil Nadu', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Kochi', state: 'Kerala', isMetroHRA: false, standardAllowance: 3500 },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Bhopal', state: 'Madhya Pradesh', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Nagpur', state: 'Maharashtra', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Vadodara', state: 'Gujarat', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Surat', state: 'Gujarat', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Patna', state: 'Bihar', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Bhubaneswar', state: 'Odisha', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Mysore', state: 'Karnataka', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Thiruvananthapuram', state: 'Kerala', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Guwahati', state: 'Assam', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Dehradun', state: 'Uttarakhand', isMetroHRA: false, standardAllowance: 3000 },
    { city: 'Ranchi', state: 'Jharkhand', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Raipur', state: 'Chhattisgarh', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Mangalore', state: 'Karnataka', isMetroHRA: false, standardAllowance: 3000 }
  ],
  TIER_3_REGIONAL: [
    { city: 'Vijayawada', state: 'Andhra Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Guntur', state: 'Andhra Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Warangal', state: 'Telangana', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Tirupati', state: 'Andhra Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Madurai', state: 'Tamil Nadu', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Trichy', state: 'Tamil Nadu', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Salem', state: 'Tamil Nadu', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Hubli', state: 'Karnataka', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Belgaum', state: 'Karnataka', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Nashik', state: 'Maharashtra', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Aurangabad', state: 'Maharashtra', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Solapur', state: 'Maharashtra', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Kolhapur', state: 'Maharashtra', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Jabalpur', state: 'Madhya Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Gwalior', state: 'Madhya Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Udaipur', state: 'Rajasthan', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Jodhpur', state: 'Rajasthan', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Kota', state: 'Rajasthan', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Agra', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Varanasi', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Prayagraj', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Meerut', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Bareilly', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Aligarh', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Moradabad', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Gorakhpur', state: 'Uttar Pradesh', isMetroHRA: false, standardAllowance: 2000 },
    { city: 'Jalandhar', state: 'Punjab', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Ludhiana', state: 'Punjab', isMetroHRA: false, standardAllowance: 2500 },
    { city: 'Amritsar', state: 'Punjab', isMetroHRA: false, standardAllowance: 2500 }
  ]
};

export const MAJOR_TECH_PARKS_DIRECTORY = [
  { id: 'tp_blr_01', name: 'Electronic City Phase 1', city: 'Bangalore', state: 'Karnataka', pincode: '560100', zone: 'South' },
  { id: 'tp_blr_02', name: 'Manyata Embassy Business Park', city: 'Bangalore', state: 'Karnataka', pincode: '560045', zone: 'North' },
  { id: 'tp_blr_03', name: 'International Tech Park Bangalore (ITPB)', city: 'Bangalore', state: 'Karnataka', pincode: '560066', zone: 'East' },
  { id: 'tp_blr_04', name: 'Bagmane Tech Park, CV Raman Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560093', zone: 'East' },
  { id: 'tp_blr_05', name: 'Ecospace Business Park, Bellandur', city: 'Bangalore', state: 'Karnataka', pincode: '560103', zone: 'South-East' },
  { id: 'tp_hyd_01', name: 'HITEC City Phase 1 & 2', city: 'Hyderabad', state: 'Telangana', pincode: '500081', zone: 'West' },
  { id: 'tp_hyd_02', name: 'Mindspace Madhapur', city: 'Hyderabad', state: 'Telangana', pincode: '500081', zone: 'West' },
  { id: 'tp_hyd_03', name: 'Financial District, Gachibowli', city: 'Hyderabad', state: 'Telangana', pincode: '500032', zone: 'West' },
  { id: 'tp_hyd_04', name: 'Cyber Gateway & Cyber Towers', city: 'Hyderabad', state: 'Telangana', pincode: '500081', zone: 'West' },
  { id: 'tp_hyd_05', name: 'Raheja Mindspace Pocharam', city: 'Hyderabad', state: 'Telangana', pincode: '500088', zone: 'East' },
  { id: 'tp_pun_01', name: 'Hinjawadi Rajiv Gandhi Infotech Park', city: 'Pune', state: 'Maharashtra', pincode: '411057', zone: 'West' },
  { id: 'tp_pun_02', name: 'Magarpatta Cybercity, Hadapsar', city: 'Pune', state: 'Maharashtra', pincode: '411028', zone: 'East' },
  { id: 'tp_pun_03', name: 'EON Free Zone, Kharadi', city: 'Pune', state: 'Maharashtra', pincode: '411014', zone: 'East' },
  { id: 'tp_chn_01', name: 'TIDEL Park, Taramani', city: 'Chennai', state: 'Tamil Nadu', pincode: '600113', zone: 'South' },
  { id: 'tp_chn_02', name: 'DLF Cybercity, Manapakkam', city: 'Chennai', state: 'Tamil Nadu', pincode: '600089', zone: 'South-West' },
  { id: 'tp_chn_03', name: 'SIPCOT IT Park, Siruseri', city: 'Chennai', state: 'Tamil Nadu', pincode: '603103', zone: 'South' },
  { id: 'tp_del_01', name: 'DLF Cyber City, Phase 2', city: 'Gurugram', state: 'Haryana', pincode: '122002', zone: 'NCR' },
  { id: 'tp_del_02', name: 'Golf Course Extension Cyberpark', city: 'Gurugram', state: 'Haryana', pincode: '122018', zone: 'NCR' },
  { id: 'tp_del_03', name: 'Sector 62 & 126 IT Corridor', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', zone: 'NCR' },
  { id: 'tp_mum_01', name: 'Nesco IT Park, Goregaon', city: 'Mumbai', state: 'Maharashtra', pincode: '400063', zone: 'Western Suburbs' },
  { id: 'tp_mum_02', name: 'Mindspace Airoli & Gigaplex', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400708', zone: 'Navi Mumbai' },
  { id: 'tp_mum_03', name: 'Bandra Kurla Complex (BKC)', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', zone: 'Central' }
];

export function lookupCityTier(cityName) {
  if (!cityName) return { tier: 3, isMetro: false, allowance: 2000 };
  const normalized = cityName.trim().toLowerCase();

  for (const item of CITY_TIER_CLASSIFICATIONS.TIER_1_METRO) {
    if (item.city.toLowerCase() === normalized) {
      return { tier: 1, isMetro: true, ...item };
    }
  }

  for (const item of CITY_TIER_CLASSIFICATIONS.TIER_2_URBAN) {
    if (item.city.toLowerCase() === normalized) {
      return { tier: 2, isMetro: false, ...item };
    }
  }

  return { tier: 3, isMetro: false, city: cityName, allowance: 2000 };
}
