export const SATURATION_TIERS = [
  { label: "0%-10%", color: "#F7A387", text: "#7C2D12" },
  { label: "11%-25%", color: "#FCE1D4", text: "#7C2D12" },
  { label: "26%-50%", color: "#92BEDE", text: "#0C4A6E" },
  { label: "51%-75%", color: "#4A90C4", text: "#FFFFFF" },
  { label: "76%-<100%", color: "#2171B5", text: "#FFFFFF" },
  { label: "100%", color: "#0B3C73", text: "#FFFFFF" }
];

export function getTierColor(pct) {
  if (pct >= 100) return "#0B3C73";
  if (pct >= 76) return "#2171B5";
  if (pct >= 51) return "#4A90C4";
  if (pct >= 26) return "#92BEDE";
  if (pct >= 11) return "#FCE1D4";
  return "#F7A387";
}

export const STATES_MASTER = [
  { id: "AR", name: "Arunachal Pradesh", totalHH: "2.35 L", conn: "2.35 L", pct: 100.0, star: "white", status: "100% Certified", trust: 97.4 },
  { id: "GA", name: "Goa", totalHH: "2.63 L", conn: "2.63 L", pct: 100.0, star: "white", status: "100% Certified", trust: 98.2 },
  { id: "GJ", name: "Gujarat", totalHH: "91.18 L", conn: "91.18 L", pct: 100.0, star: "white", status: "100% Certified", trust: 96.8 },
  { id: "HR", name: "Haryana", totalHH: "30.41 L", conn: "30.41 L", pct: 100.0, star: "white", status: "100% Certified", trust: 97.9 },
  { id: "HP", name: "Himachal Pradesh", totalHH: "17.09 L", conn: "17.09 L", pct: 100.0, star: "white", status: "100% Certified", trust: 98.5 },
  { id: "PB", name: "Punjab", totalHH: "34.25 L", conn: "34.25 L", pct: 100.0, star: "white", status: "100% Certified", trust: 98.1 },
  { id: "SK", name: "Sikkim", totalHH: "1.32 L", conn: "1.32 L", pct: 100.0, star: "white", status: "100% Certified", trust: 96.5 },
  { id: "TG", name: "Telangana", totalHH: "54.10 L", conn: "54.10 L", pct: 100.0, star: "white", status: "100% Certified", trust: 98.9 },
  { id: "AN", name: "A&N Islands", totalHH: "0.62 L", conn: "0.62 L", pct: 100.0, star: "white", status: "100% Certified", trust: 99.1 },
  { id: "DN", name: "D&NH and Daman & Diu", totalHH: "0.85 L", conn: "0.85 L", pct: 100.0, star: "white", status: "100% Certified", trust: 97.8 },
  { id: "PY", name: "Puducherry", totalHH: "1.15 L", conn: "1.15 L", pct: 100.0, star: "white", status: "100% Certified", trust: 99.0 },
  { id: "TN", name: "Tamil Nadu", totalHH: "125.62 L", conn: "118.08 L", pct: 94.0, star: "gold", status: "Reported 100%", trust: 91.2 },
  { id: "MH", name: "Maharashtra", totalHH: "146.52 L", conn: "133.33 L", pct: 91.0, star: null, status: "In Progress", trust: 87.5 },
  { id: "UK", name: "Uttarakhand", totalHH: "15.04 L", conn: "13.54 L", pct: 90.0, star: null, status: "In Progress", trust: 89.2 },
  { id: "RJ", name: "Rajasthan", totalHH: "107.32 L", conn: "95.52 L", pct: 89.0, star: null, status: "In Progress", trust: 82.4 },
  { id: "CG", name: "Chhattisgarh", totalHH: "50.21 L", conn: "42.18 L", pct: 84.0, star: null, status: "In Progress", trust: 85.0 },
  { id: "KA", name: "Karnataka", totalHH: "91.78 L", conn: "73.43 L", pct: 80.0, star: null, status: "In Progress", trust: 81.9 },
  { id: "MP", name: "Madhya Pradesh", totalHH: "112.50 L", conn: "90.00 L", pct: 80.0, star: null, status: "In Progress", trust: 83.1 },
  { id: "TR", name: "Tripura", totalHH: "7.62 L", conn: "6.10 L", pct: 80.0, star: null, status: "In Progress", trust: 84.2 },
  { id: "JK", name: "J&K", totalHH: "18.62 L", conn: "14.90 L", pct: 80.0, star: null, status: "In Progress", trust: 86.4 },
  { id: "LA", name: "Ladakh", totalHH: "0.44 L", conn: "0.35 L", pct: 80.0, star: null, status: "In Progress", trust: 89.0 },
  { id: "AP", name: "Andhra Pradesh", totalHH: "95.44 L", conn: "76.35 L", pct: 80.0, star: null, status: "In Progress", trust: 84.7 },
  { id: "MZ", name: "Mizoram", totalHH: "1.34 L", conn: "1.07 L", pct: 80.0, star: null, status: "In Progress", trust: 88.2 },
  { id: "JH", name: "Jharkhand", totalHH: "61.43 L", conn: "43.61 L", pct: 71.0, star: null, status: "In Progress", trust: 76.5 },
  { id: "OD", name: "Odisha", totalHH: "88.62 L", conn: "57.60 L", pct: 65.0, star: null, status: "In Progress", trust: 78.4 },
  { id: "UP", name: "Uttar Pradesh", totalHH: "266.24 L", conn: "170.39 L", pct: 64.0, star: null, status: "In Progress", trust: 79.8 },
  { id: "BR", name: "Bihar", totalHH: "166.32 L", conn: "106.44 L", pct: 64.0, star: null, status: "In Progress", trust: 77.2 },
  { id: "KL", name: "Kerala", totalHH: "70.81 L", conn: "42.49 L", pct: 60.0, star: null, status: "In Progress", trust: 85.3 },
  { id: "AS", name: "Assam", totalHH: "69.82 L", conn: "41.89 L", pct: 60.0, star: null, status: "In Progress", trust: 80.1 },
  { id: "MN", name: "Manipur", totalHH: "4.52 L", conn: "2.58 L", pct: 57.0, star: null, status: "In Progress", trust: 74.0 },
  { id: "NL", name: "Nagaland", totalHH: "3.82 L", conn: "1.91 L", pct: 50.0, star: null, status: "In Progress", trust: 72.8 },
  { id: "WB", name: "West Bengal", totalHH: "173.22 L", conn: "86.61 L", pct: 50.0, star: null, status: "Lagging", trust: 71.5 },
  { id: "ML", name: "Meghalaya", totalHH: "6.48 L", conn: "2.53 L", pct: 39.0, star: null, status: "Lagging", trust: 68.2 }
];

export const DISTRICTS_BY_STATE = {
  "Maharashtra": [
    { name: "Chhatrapati Sambhajinagar", totalHH: "3,84,200", conn: "3,45,780", pct: 90.0, trust: 88.4, status: "Active SCADA Hub" },
    { name: "Pune", totalHH: "7,20,500", conn: "6,84,475", pct: 95.0, trust: 94.2, status: "Reported" },
    { name: "Nagpur", totalHH: "4,12,000", conn: "3,83,160", pct: 93.0, trust: 91.0, status: "Reported" },
    { name: "Nashik", totalHH: "5,40,100", conn: "4,86,090", pct: 90.0, trust: 89.5, status: "In Progress" },
    { name: "Thane", totalHH: "2,90,400", conn: "2,75,880", pct: 95.0, trust: 92.0, status: "Reported" },
    { name: "Kolhapur", totalHH: "4,80,200", conn: "4,70,596", pct: 98.0, trust: 96.1, status: "100% Certified" },
    { name: "Solapur", totalHH: "5,10,300", conn: "4,33,755", pct: 85.0, trust: 83.2, status: "In Progress" },
    { name: "Satara", totalHH: "4,50,000", conn: "4,27,500", pct: 95.0, trust: 93.0, status: "Reported" },
    { name: "Sangli", totalHH: "4,20,100", conn: "3,94,894", pct: 94.0, trust: 91.8, status: "Reported" },
    { name: "Ahmednagar", totalHH: "6,10,400", conn: "5,43,256", pct: 89.0, trust: 87.0, status: "In Progress" },
    { name: "Jalgaon", totalHH: "5,20,000", conn: "4,62,800", pct: 89.0, trust: 86.5, status: "In Progress" },
    { name: "Amravati", totalHH: "3,45,200", conn: "2,96,872", pct: 86.0, trust: 84.2, status: "In Progress" },
    { name: "Nanded", totalHH: "3,95,000", conn: "3,35,750", pct: 85.0, trust: 82.5, status: "In Progress" },
    { name: "Latur", totalHH: "3,50,000", conn: "2,97,500", pct: 85.0, trust: 83.0, status: "In Progress" },
    { name: "Raigad", totalHH: "3,20,400", conn: "3,04,380", pct: 95.0, trust: 92.5, status: "Reported" },
    { name: "Ratnagiri", totalHH: "2,80,000", conn: "2,63,200", pct: 94.0, trust: 91.2, status: "Reported" },
    { name: "Sindhudurg", totalHH: "1,75,000", conn: "1,73,250", pct: 99.0, trust: 97.0, status: "100% Certified" },
    { name: "Bhandara", totalHH: "2,10,000", conn: "1,99,500", pct: 95.0, trust: 93.4, status: "Reported" },
    { name: "Chandrapur", totalHH: "3,15,000", conn: "2,77,200", pct: 88.0, trust: 85.4, status: "In Progress" },
    { name: "Yavatmal", totalHH: "4,20,000", conn: "3,44,400", pct: 82.0, trust: 80.5, status: "In Progress" },
    { name: "Wardha", totalHH: "2,05,000", conn: "1,92,700", pct: 94.0, trust: 92.1, status: "Reported" },
    { name: "Buldhana", totalHH: "3,80,000", conn: "3,23,000", pct: 85.0, trust: 83.2, status: "In Progress" },
    { name: "Akola", totalHH: "2,60,000", conn: "2,31,400", pct: 89.0, trust: 87.1, status: "In Progress" },
    { name: "Jalna", totalHH: "2,85,000", conn: "2,47,950", pct: 87.0, trust: 85.1, status: "In Progress" },
    { name: "Beed", totalHH: "3,90,000", conn: "3,27,600", pct: 84.0, trust: 81.5, status: "In Progress" },
    { name: "Osmanabad", totalHH: "2,65,000", conn: "2,25,250", pct: 85.0, trust: 82.8, status: "In Progress" },
    { name: "Dhule", totalHH: "3,10,000", conn: "2,75,900", pct: 89.0, trust: 86.4, status: "In Progress" },
    { name: "Nandurbar", totalHH: "2,75,000", conn: "2,20,000", pct: 80.0, trust: 78.5, status: "In Progress" },
    { name: "Gadchiroli", totalHH: "2,20,000", conn: "1,71,600", pct: 78.0, trust: 76.8, status: "In Progress" }
  ],
  "Gujarat": [
    { name: "Gandhinagar", totalHH: "2,15,000", conn: "2,15,000", pct: 100.0, trust: 98.5, status: "100% Certified" },
    { name: "Ahmedabad", totalHH: "3,80,400", conn: "3,80,400", pct: 100.0, trust: 98.1, status: "100% Certified" },
    { name: "Surat", totalHH: "3,40,000", conn: "3,40,000", pct: 100.0, trust: 97.4, status: "100% Certified" },
    { name: "Vadodara", totalHH: "2,95,000", conn: "2,95,000", pct: 100.0, trust: 96.8, status: "100% Certified" },
    { name: "Rajkot", totalHH: "3,10,000", conn: "3,10,000", pct: 100.0, trust: 96.5, status: "100% Certified" },
    { name: "Bhavnagar", totalHH: "2,80,000", conn: "2,80,000", pct: 100.0, trust: 96.0, status: "100% Certified" },
    { name: "Jamnagar", totalHH: "2,20,000", conn: "2,20,000", pct: 100.0, trust: 95.8, status: "100% Certified" },
    { name: "Kutch", totalHH: "2,45,000", conn: "2,45,000", pct: 100.0, trust: 95.0, status: "100% Certified" },
    { name: "Mehsana", totalHH: "3,05,000", conn: "3,05,000", pct: 100.0, trust: 97.2, status: "100% Certified" },
    { name: "Anand", totalHH: "3,25,000", conn: "3,25,000", pct: 100.0, trust: 97.0, status: "100% Certified" }
  ],
  "Karnataka": [
    { name: "Bengaluru Rural", totalHH: "2,20,400", conn: "2,15,992", pct: 98.0, trust: 96.2, status: "100% Certified" },
    { name: "Mysuru", totalHH: "4,10,200", conn: "3,69,180", pct: 90.0, trust: 89.4, status: "Reported" },
    { name: "Belagavi", totalHH: "6,50,000", conn: "5,33,000", pct: 82.0, trust: 82.5, status: "In Progress" },
    { name: "Dharwad", totalHH: "2,35,000", conn: "2,16,200", pct: 92.0, trust: 90.1, status: "Reported" },
    { name: "Dakshina Kannada", totalHH: "3,10,000", conn: "3,00,700", pct: 97.0, trust: 95.0, status: "100% Certified" },
    { name: "Udupi", totalHH: "2,40,000", conn: "2,35,200", pct: 98.0, trust: 96.5, status: "100% Certified" },
    { name: "Shivamogga", totalHH: "3,50,000", conn: "3,15,000", pct: 90.0, trust: 88.5, status: "Reported" },
    { name: "Tumakuru", totalHH: "5,20,000", conn: "4,26,400", pct: 82.0, trust: 81.0, status: "In Progress" },
    { name: "Ballari", totalHH: "3,80,000", conn: "2,88,800", pct: 76.0, trust: 78.0, status: "In Progress" },
    { name: "Kalaburagi", totalHH: "4,40,000", conn: "3,30,000", pct: 75.0, trust: 77.2, status: "In Progress" },
    { name: "Raichur", totalHH: "3,60,000", conn: "2,59,200", pct: 72.0, trust: 75.0, status: "In Progress" }
  ],
  "Punjab": [
    { name: "SAS Nagar (Mohali)", totalHH: "1,25,000", conn: "1,25,000", pct: 100.0, trust: 98.6, status: "100% Certified" },
    { name: "Ludhiana", totalHH: "2,95,000", conn: "2,95,000", pct: 100.0, trust: 98.2, status: "100% Certified" },
    { name: "Amritsar", totalHH: "2,60,000", conn: "2,60,000", pct: 100.0, trust: 97.8, status: "100% Certified" },
    { name: "Jalandhar", totalHH: "2,40,000", conn: "2,40,000", pct: 100.0, trust: 98.0, status: "100% Certified" },
    { name: "Patiala", totalHH: "2,35,000", conn: "2,35,000", pct: 100.0, trust: 97.9, status: "100% Certified" },
    { name: "Bathinda", totalHH: "1,95,000", conn: "1,95,000", pct: 100.0, trust: 97.5, status: "100% Certified" }
  ],
  "Haryana": [
    { name: "Ambala", totalHH: "1,45,000", conn: "1,45,000", pct: 100.0, trust: 98.2, status: "100% Certified" },
    { name: "Karnal", totalHH: "2,10,000", conn: "2,10,000", pct: 100.0, trust: 98.0, status: "100% Certified" },
    { name: "Panchkula", totalHH: "85,000", conn: "85,000", pct: 100.0, trust: 99.1, status: "100% Certified" },
    { name: "Kurukshetra", totalHH: "1,60,000", conn: "1,60,000", pct: 100.0, trust: 97.9, status: "100% Certified" },
    { name: "Rohtak", totalHH: "1,55,000", conn: "1,55,000", pct: 100.0, trust: 97.6, status: "100% Certified" }
  ],
  "Goa": [
    { name: "North Goa", totalHH: "1,42,000", conn: "1,42,000", pct: 100.0, trust: 98.5, status: "100% Certified" },
    { name: "South Goa", totalHH: "1,21,013", conn: "1,21,013", pct: 100.0, trust: 98.0, status: "100% Certified" }
  ],
  "Himachal Pradesh": [
    { name: "Shimla", totalHH: "1,45,000", conn: "1,45,000", pct: 100.0, trust: 98.7, status: "100% Certified" },
    { name: "Kangra", totalHH: "3,80,000", conn: "3,80,000", pct: 100.0, trust: 98.5, status: "100% Certified" },
    { name: "Mandi", totalHH: "2,40,000", conn: "2,40,000", pct: 100.0, trust: 98.2, status: "100% Certified" },
    { name: "Solan", totalHH: "1,60,000", conn: "1,60,000", pct: 100.0, trust: 98.0, status: "100% Certified" }
  ],
  "Telangana": [
    { name: "Warangal", totalHH: "2,60,000", conn: "2,60,000", pct: 100.0, trust: 98.5, status: "100% Certified" },
    { name: "Karimnagar", totalHH: "2,45,000", conn: "2,45,000", pct: 100.0, trust: 98.0, status: "100% Certified" },
    { name: "Nizamabad", totalHH: "2,90,000", conn: "2,90,000", pct: 100.0, trust: 97.8, status: "100% Certified" }
  ],
  "Tamil Nadu": [
    { name: "Coimbatore", totalHH: "3,10,000", conn: "3,06,900", pct: 99.0, trust: 96.4, status: "Reported" },
    { name: "Tiruchirappalli", totalHH: "3,90,000", conn: "3,70,500", pct: 95.0, trust: 93.0, status: "Reported" },
    { name: "Madurai", totalHH: "3,80,000", conn: "3,49,600", pct: 92.0, trust: 90.5, status: "Reported" },
    { name: "Salem", totalHH: "4,60,000", conn: "4,14,000", pct: 90.0, trust: 88.0, status: "In Progress" },
    { name: "Tirunelveli", totalHH: "3,20,000", conn: "2,94,400", pct: 92.0, trust: 90.1, status: "Reported" }
  ],
  "Rajasthan": [
    { name: "Jaipur", totalHH: "5,90,000", conn: "5,25,100", pct: 89.0, trust: 86.5, status: "In Progress" },
    { name: "Jodhpur", totalHH: "4,80,000", conn: "4,12,800", pct: 86.0, trust: 83.0, status: "In Progress" },
    { name: "Udaipur", totalHH: "4,20,000", conn: "3,65,400", pct: 87.0, trust: 84.1, status: "In Progress" },
    { name: "Kota", totalHH: "2,40,000", conn: "2,18,400", pct: 91.0, trust: 88.0, status: "Reported" }
  ],
  "Uttar Pradesh": [
    { name: "Varanasi", totalHH: "4,10,000", conn: "3,48,910", pct: 85.1, trust: 88.2, status: "In Progress" },
    { name: "Lucknow", totalHH: "3,90,000", conn: "3,04,200", pct: 78.0, trust: 82.0, status: "In Progress" },
    { name: "Jhansi", totalHH: "2,40,000", conn: "2,28,000", pct: 95.0, trust: 92.5, status: "Reported" },
    { name: "Prayagraj", totalHH: "6,20,000", conn: "4,34,000", pct: 70.0, trust: 77.0, status: "In Progress" },
    { name: "Gorakhpur", totalHH: "5,80,000", conn: "4,17,600", pct: 72.0, trust: 78.5, status: "In Progress" },
    { name: "Agra", totalHH: "4,50,000", conn: "3,28,500", pct: 73.0, trust: 79.0, status: "In Progress" }
  ],
  "Bihar": [
    { name: "Patna", totalHH: "5,20,000", conn: "5,01,280", pct: 96.4, trust: 94.5, status: "Reported" },
    { name: "Gaya", totalHH: "5,90,000", conn: "5,69,940", pct: 96.6, trust: 93.1, status: "Reported" },
    { name: "Muzaffarpur", totalHH: "6,80,000", conn: "6,49,400", pct: 95.5, trust: 92.4, status: "Reported" },
    { name: "Bhagalpur", totalHH: "4,60,000", conn: "4,37,920", pct: 95.2, trust: 91.5, status: "Reported" }
  ],
  "Madhya Pradesh": [
    { name: "Indore", totalHH: "2,80,000", conn: "2,49,200", pct: 89.0, trust: 88.0, status: "In Progress" },
    { name: "Bhopal", totalHH: "2,10,000", conn: "1,80,600", pct: 86.0, trust: 85.2, status: "In Progress" },
    { name: "Gwalior", totalHH: "2,40,000", conn: "1,92,000", pct: 80.0, trust: 80.5, status: "In Progress" },
    { name: "Jabalpur", totalHH: "3,20,000", conn: "2,43,200", pct: 76.0, trust: 77.8, status: "In Progress" }
  ],
  "J&K": [
    { name: "Srinagar", totalHH: "1,85,000", conn: "1,59,100", pct: 86.0, trust: 88.2, status: "Operational" },
    { name: "Jammu", totalHH: "2,45,000", conn: "2,15,600", pct: 88.0, trust: 89.0, status: "Operational" },
    { name: "Anantnag", totalHH: "1,95,000", conn: "1,56,000", pct: 80.0, trust: 85.5, status: "In Progress" },
    { name: "Baramulla", totalHH: "2,10,000", conn: "1,63,800", pct: 78.0, trust: 84.0, status: "In Progress" },
    { name: "Udhampur", totalHH: "1,35,000", conn: "1,14,750", pct: 85.0, trust: 86.5, status: "In Progress" },
    { name: "Kathua", totalHH: "1,45,000", conn: "1,24,700", pct: 86.0, trust: 87.0, status: "In Progress" }
  ],
  "West Bengal": [
    { name: "Murshidabad", totalHH: "12,10,000", conn: "6,17,100", pct: 51.0, trust: 69.5, status: "Lagging" },
    { name: "North 24 Parganas", totalHH: "9,80,000", conn: "5,48,800", pct: 56.0, trust: 73.0, status: "In Progress" },
    { name: "South 24 Parganas", totalHH: "11,40,000", conn: "5,47,200", pct: 48.0, trust: 68.0, status: "Lagging" },
    { name: "Nadia", totalHH: "8,50,000", conn: "4,42,000", pct: 52.0, trust: 71.0, status: "In Progress" }
  ],
  "Meghalaya": [
    { name: "East Khasi Hills", totalHH: "1,20,000", conn: "45,600", pct: 38.0, trust: 69.2, status: "Lagging" },
    { name: "South Garo Hills", totalHH: "38,000", conn: "3,382", pct: 8.9, trust: 52.3, status: "Critical Lagging" },
    { name: "West Garo Hills", totalHH: "1,15,000", conn: "36,800", pct: 32.0, trust: 64.0, status: "Lagging" }
  ],
  "Nagaland": [
    { name: "Kiphire", totalHH: "18,500", conn: "4,440", pct: 24.0, trust: 61.0, status: "Lagging" },
    { name: "Tuensang", totalHH: "32,000", conn: "6,720", pct: 21.0, trust: 59.5, status: "Lagging" },
    { name: "Kohima", totalHH: "28,000", conn: "17,360", pct: 62.0, trust: 77.0, status: "In Progress" }
  ]
};
