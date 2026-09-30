export const TIER_COLORS = {
  tier1: "#F7D9CE", // 0% - 10%
  tier2: "#F3B39E", // 11% - 25%
  tier3: "#BCD9EA", // 26% - 50%
  tier4: "#6BAED6", // 51% - 75%
  tier5: "#2171B5", // 76% - <100%
  tier6: "#08306B"  // 100% Saturation
};

export function getTierColor(pct) {
  if (pct >= 100) return TIER_COLORS.tier6;
  if (pct >= 76) return TIER_COLORS.tier5;
  if (pct >= 51) return TIER_COLORS.tier4;
  if (pct >= 26) return TIER_COLORS.tier3;
  if (pct >= 11) return TIER_COLORS.tier2;
  return TIER_COLORS.tier1;
}

export const INDIA_STATES_DATA = [
  { id: "MH", name: "Maharashtra", lat: 19.7515, lng: 75.7139, totalHH: 14652000, conn: 12718000, saturation: 86.8, star: "gold", status: "Reported" },
  { id: "GJ", name: "Gujarat", lat: 22.2587, lng: 71.1924, totalHH: 9118000, conn: 9118000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "TG", name: "Telangana", lat: 18.1124, lng: 79.0193, totalHH: 5410000, conn: 5410000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "HR", name: "Haryana", lat: 29.0588, lng: 76.0856, totalHH: 3041000, conn: 3041000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "PB", name: "Punjab", lat: 31.1471, lng: 75.3412, totalHH: 3420000, conn: 3420000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "GA", name: "Goa", lat: 15.2993, lng: 74.1240, totalHH: 230000, conn: 230000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "HP", name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, totalHH: 1709000, conn: 1709000, saturation: 100.0, star: "white", status: "100% Certified" },
  { id: "UP", name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, totalHH: 26620000, conn: 22547000, saturation: 84.7, star: null, status: "In Progress" },
  { id: "BR", name: "Bihar", lat: 25.0961, lng: 85.3131, totalHH: 16630000, conn: 16031000, saturation: 96.4, star: null, status: "In Progress" },
  { id: "TN", name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, totalHH: 12560000, conn: 10337000, saturation: 82.3, star: "gold", status: "Reported" },
  { id: "KA", name: "Karnataka", lat: 15.3173, lng: 75.7139, totalHH: 10120000, conn: 8005000, saturation: 79.1, star: null, status: "In Progress" },
  { id: "AP", name: "Andhra Pradesh", lat: 15.9129, lng: 79.7400, totalHH: 9540000, conn: 7078000, saturation: 74.2, star: null, status: "In Progress" },
  { id: "MP", name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, totalHH: 11250000, conn: 7672000, saturation: 68.2, star: null, status: "In Progress" },
  { id: "RJ", name: "Rajasthan", lat: 27.0238, lng: 74.2179, totalHH: 10730000, conn: 5826000, saturation: 54.3, star: null, status: "In Progress" },
  { id: "WB", name: "West Bengal", lat: 22.9868, lng: 87.8550, totalHH: 17320000, conn: 8470000, saturation: 48.9, star: null, status: "In Progress" },
  { id: "OD", name: "Odisha", lat: 20.9517, lng: 85.0985, totalHH: 8860000, conn: 6335000, saturation: 71.5, star: null, status: "In Progress" },
  { id: "KL", name: "Kerala", lat: 10.8505, lng: 76.2711, totalHH: 7080000, conn: 3993000, saturation: 56.4, star: null, status: "In Progress" },
  { id: "JH", name: "Jharkhand", lat: 23.6102, lng: 85.2799, totalHH: 6140000, conn: 3242000, saturation: 52.8, star: null, status: "In Progress" },
  { id: "AS", name: "Assam", lat: 26.2006, lng: 92.9376, totalHH: 6980000, conn: 5542000, saturation: 79.4, star: null, status: "In Progress" },
  { id: "CH", name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, totalHH: 5020000, conn: 3117000, saturation: 62.1, star: null, status: "In Progress" },
  { id: "UT", name: "Uttarakhand", lat: 30.0668, lng: 79.0193, totalHH: 1500000, conn: 1389000, saturation: 92.6, star: null, status: "In Progress" },
  { id: "JK", name: "Jammu & Kashmir", lat: 33.7782, lng: 76.5762, totalHH: 1860000, conn: 1477000, saturation: 79.4, star: null, status: "In Progress" }
];

export const INDIA_DISTRICTS_DATA = [
  // Maharashtra
  { state: "Maharashtra", name: "Chhatrapati Sambhajinagar (Aurangabad)", lat: 19.8762, lng: 75.3433, totalHH: 384000, conn: 341000, saturation: 88.8, status: "High Priority", trust: 86.4 },
  { state: "Maharashtra", name: "Pune", lat: 18.5204, lng: 73.8567, totalHH: 720000, conn: 698000, saturation: 96.9, status: "100% Certified", trust: 94.2 },
  { state: "Maharashtra", name: "Nagpur", lat: 21.1458, lng: 79.0882, totalHH: 412000, conn: 388000, saturation: 94.1, status: "Reported", trust: 89.5 },
  { state: "Maharashtra", name: "Nashik", lat: 19.9975, lng: 73.7898, totalHH: 540000, conn: 485000, saturation: 89.8, status: "In Progress", trust: 85.1 },
  { state: "Maharashtra", name: "Thane", lat: 19.2183, lng: 72.9781, totalHH: 290000, conn: 278000, saturation: 95.8, status: "Reported", trust: 91.0 },
  { state: "Maharashtra", name: "Solapur", lat: 17.6599, lng: 75.9064, totalHH: 510000, conn: 412000, saturation: 80.7, status: "In Progress", trust: 81.3 },
  { state: "Maharashtra", name: "Kolhapur", lat: 16.7050, lng: 74.2433, totalHH: 480000, conn: 472000, saturation: 98.3, status: "100% Certified", trust: 95.6 },
  { state: "Maharashtra", name: "Amravati", lat: 20.9320, lng: 77.7523, totalHH: 345000, conn: 289000, saturation: 83.7, status: "In Progress", trust: 82.0 },
  { state: "Maharashtra", name: "Nanded", lat: 19.1383, lng: 77.3210, totalHH: 395000, conn: 312000, saturation: 78.9, status: "In Progress", trust: 79.4 },
  { state: "Maharashtra", name: "Raigad", lat: 18.5158, lng: 73.1822, totalHH: 320000, conn: 304000, saturation: 95.0, status: "Reported", trust: 92.3 },

  // Gujarat
  { state: "Gujarat", name: "Ahmedabad", lat: 23.0225, lng: 72.5714, totalHH: 380000, conn: 380000, saturation: 100.0, status: "100% Certified", trust: 98.1 },
  { state: "Gujarat", name: "Surat", lat: 21.1702, lng: 72.8311, totalHH: 340000, conn: 340000, saturation: 100.0, status: "100% Certified", trust: 97.4 },
  { state: "Gujarat", name: "Vadodara", lat: 22.3072, lng: 73.1812, totalHH: 295000, conn: 295000, saturation: 100.0, status: "100% Certified", trust: 96.8 },
  { state: "Gujarat", name: "Rajkot", lat: 22.3039, lng: 70.8022, totalHH: 310000, conn: 310000, saturation: 100.0, status: "100% Certified", trust: 96.5 },
  { state: "Gujarat", name: "Kutch", lat: 23.7337, lng: 69.8597, totalHH: 245000, conn: 245000, saturation: 100.0, status: "100% Certified", trust: 95.0 },

  // Uttar Pradesh
  { state: "Uttar Pradesh", name: "Varanasi", lat: 25.3176, lng: 82.9739, totalHH: 410000, conn: 385000, saturation: 93.9, status: "Reported", trust: 90.2 },
  { state: "Uttar Pradesh", name: "Lucknow", lat: 26.8467, lng: 80.9462, totalHH: 390000, conn: 362000, saturation: 92.8, status: "Reported", trust: 89.1 },
  { state: "Uttar Pradesh", name: "Prayagraj", lat: 25.4358, lng: 81.8463, totalHH: 620000, conn: 520000, saturation: 83.8, status: "In Progress", trust: 84.0 },
  { state: "Uttar Pradesh", name: "Gorakhpur", lat: 26.7606, lng: 83.3732, totalHH: 580000, conn: 495000, saturation: 85.3, status: "In Progress", trust: 85.2 },
  { state: "Uttar Pradesh", name: "Agra", lat: 27.1767, lng: 78.0081, totalHH: 450000, conn: 375000, saturation: 83.3, status: "In Progress", trust: 82.9 },
  { state: "Uttar Pradesh", name: "Jhansi", lat: 25.4484, lng: 78.5685, totalHH: 240000, conn: 232000, saturation: 96.6, status: "Reported", trust: 92.5 },
  { state: "Uttar Pradesh", name: "Kanpur Nagar", lat: 26.4499, lng: 80.3319, totalHH: 310000, conn: 270000, saturation: 87.0, status: "In Progress", trust: 86.0 },

  // Bihar
  { state: "Bihar", name: "Patna", lat: 25.5941, lng: 85.1376, totalHH: 520000, conn: 512000, saturation: 98.4, status: "100% Certified", trust: 96.0 },
  { state: "Bihar", name: "Gaya", lat: 24.7914, lng: 85.0002, totalHH: 590000, conn: 570000, saturation: 96.6, status: "Reported", trust: 93.1 },
  { state: "Bihar", name: "Muzaffarpur", lat: 26.1209, lng: 85.3647, totalHH: 680000, conn: 650000, saturation: 95.5, status: "Reported", trust: 92.4 },
  { state: "Bihar", name: "Bhagalpur", lat: 25.2425, lng: 86.9842, totalHH: 460000, conn: 438000, saturation: 95.2, status: "Reported", trust: 91.5 },

  // Madhya Pradesh
  { state: "Madhya Pradesh", name: "Indore", lat: 22.7196, lng: 75.8577, totalHH: 280000, conn: 245000, saturation: 87.5, status: "Reported", trust: 88.0 },
  { state: "Madhya Pradesh", name: "Bhopal", lat: 23.2599, lng: 77.4126, totalHH: 210000, conn: 175000, saturation: 83.3, status: "In Progress", trust: 84.5 },
  { state: "Madhya Pradesh", name: "Jabalpur", lat: 23.1815, lng: 79.9864, totalHH: 320000, conn: 220000, saturation: 68.7, status: "In Progress", trust: 76.2 },
  { state: "Madhya Pradesh", name: "Gwalior", lat: 26.2183, lng: 78.1828, totalHH: 240000, conn: 168000, saturation: 70.0, status: "In Progress", trust: 78.0 },

  // Rajasthan
  { state: "Rajasthan", name: "Jaipur", lat: 26.9124, lng: 75.7873, totalHH: 590000, conn: 375000, saturation: 63.5, status: "In Progress", trust: 74.0 },
  { state: "Rajasthan", name: "Jodhpur", lat: 26.2389, lng: 73.0243, totalHH: 480000, conn: 255000, saturation: 53.1, status: "In Progress", trust: 69.5 },
  { state: "Rajasthan", name: "Udaipur", lat: 24.5854, lng: 73.7125, totalHH: 420000, conn: 215000, saturation: 51.1, status: "In Progress", trust: 68.0 },

  // Karnataka
  { state: "Karnataka", name: "Mysuru", lat: 12.2958, lng: 76.6394, totalHH: 410000, conn: 365000, saturation: 89.0, status: "Reported", trust: 89.4 },
  { state: "Karnataka", name: "Belagavi", lat: 15.8497, lng: 74.4977, totalHH: 650000, conn: 520000, saturation: 80.0, status: "In Progress", trust: 82.5 },
  { state: "Karnataka", name: "Bengaluru Rural", lat: 13.2260, lng: 77.5770, totalHH: 220000, conn: 215000, saturation: 97.7, status: "100% Certified", trust: 96.2 },

  // Tamil Nadu
  { state: "Tamil Nadu", name: "Coimbatore", lat: 11.0168, lng: 76.9558, totalHH: 310000, conn: 295000, saturation: 95.1, status: "100% Certified", trust: 95.4 },
  { state: "Tamil Nadu", name: "Madurai", lat: 9.9252, lng: 78.1198, totalHH: 380000, conn: 320000, saturation: 84.2, status: "In Progress", trust: 86.0 },
  { state: "Tamil Nadu", name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, totalHH: 390000, conn: 345000, saturation: 88.4, status: "Reported", trust: 88.5 },

  // Telangana
  { state: "Telangana", name: "Warangal", lat: 17.9689, lng: 79.5941, totalHH: 260000, conn: 260000, saturation: 100.0, status: "100% Certified", trust: 98.5 },
  { state: "Telangana", name: "Karimnagar", lat: 18.4386, lng: 79.1288, totalHH: 245000, conn: 245000, saturation: 100.0, status: "100% Certified", trust: 98.0 },
  { state: "Telangana", name: "Nizamabad", lat: 18.6725, lng: 78.0941, totalHH: 290000, conn: 290000, saturation: 100.0, status: "100% Certified", trust: 97.8 },

  // Haryana & Punjab
  { state: "Haryana", name: "Ambala", lat: 30.3782, lng: 76.7767, totalHH: 145000, conn: 145000, saturation: 100.0, status: "100% Certified", trust: 98.2 },
  { state: "Haryana", name: "Karnal", lat: 29.6857, lng: 76.9905, totalHH: 210000, conn: 210000, saturation: 100.0, status: "100% Certified", trust: 98.0 },
  { state: "Punjab", name: "Ludhiana", lat: 30.9010, lng: 75.8573, totalHH: 295000, conn: 295000, saturation: 100.0, status: "100% Certified", trust: 97.9 },
  { state: "Punjab", name: "Amritsar", lat: 31.6340, lng: 74.8723, totalHH: 260000, conn: 260000, saturation: 100.0, status: "100% Certified", trust: 97.6 }
];
