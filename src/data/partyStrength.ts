/**
 * Party strength data based on REAL 2022 (2079 BS) FPTP election results.
 * Source: Election Commission Nepal / Setopati constituency-wise results.
 *
 * Each entry records which party won each FPTP constituency in the 2022 election.
 * This is used to color the heatmap showing real party dominance per district.
 *
 * NOTE: Some small districts (Manang, Mustang) share constituencies with larger neighbors.
 * For those, the winning party of the combined constituency is attributed to each.
 */

export interface ConstituencyResult {
  constituency: string; // e.g. "Jhapa-1"
  winner: string;
  party: string;
}

export interface DistrictStrength {
  district: string;
  province: number;
  results: ConstituencyResult[];
  dominantParty: string;    // party with most seats in this district
  dominantPartyColor: string;
}

import { PARTY_COLORS } from "./electionData";

function getColor(party: string): string {
  return PARTY_COLORS[party] || "#6b7280";
}

// Full 2022 FPTP results mapped to districts
const RAW_RESULTS: Record<string, { province: number; results: ConstituencyResult[] }> = {
  TAPLEJUNG: {
    province: 1,
    results: [
      { constituency: "Taplejung-1", winner: "Yogesh Kumar Bhattarai", party: "CPN-UML" },
    ],
  },
  PANCHTHAR: {
    province: 1,
    results: [
      { constituency: "Panchthar-1", winner: "Basanta Kumar Nembang", party: "CPN-UML" },
    ],
  },
  ILAM: {
    province: 1,
    results: [
      { constituency: "Ilam-1", winner: "Mahesh Basnet", party: "CPN-UML" },
      { constituency: "Ilam-2", winner: "Subash Chandra Nembang", party: "CPN-UML" },
    ],
  },
  JHAPA: {
    province: 1,
    results: [
      { constituency: "Jhapa-1", winner: "Bishwa Prakash Sharma", party: "Nepali Congress" },
      { constituency: "Jhapa-2", winner: "Dev Raj Ghimire", party: "CPN-UML" },
      { constituency: "Jhapa-3", winner: "Rajendra Prasad Lingden", party: "Rastriya Prajatantra Party" },
      { constituency: "Jhapa-4", winner: "Lal Prasad Sanwa Limbu", party: "CPN-UML" },
      { constituency: "Jhapa-5", winner: "KP Sharma Oli", party: "CPN-UML" },
    ],
  },
  SANKHUWASABHA: {
    province: 1,
    results: [
      { constituency: "Sankhuwasabha-1", winner: "Deepak Khadka", party: "Nepali Congress" },
    ],
  },
  TEHRATHUM: {
    province: 1,
    results: [
      { constituency: "Tehrathum-1", winner: "Sita Gurung", party: "Nepali Congress" },
    ],
  },
  BHOJPUR: {
    province: 1,
    results: [
      { constituency: "Bhojpur-1", winner: "Sudan Kirati", party: "CPN (Maoist Centre)" },
    ],
  },
  DHANKUTA: {
    province: 1,
    results: [
      { constituency: "Dhankuta-1", winner: "Rajendra Kumar Rai", party: "CPN-UML" },
    ],
  },
  MORANG: {
    province: 1,
    results: [
      { constituency: "Morang-1", winner: "Dig Bahadur Limbu", party: "Nepali Congress" },
      { constituency: "Morang-2", winner: "Rishikesh Pokharel", party: "CPN-UML" },
      { constituency: "Morang-3", winner: "Sunil Kumar Sharma", party: "Nepali Congress" },
      { constituency: "Morang-4", winner: "Aman Lal Modi", party: "CPN (Maoist Centre)" },
      { constituency: "Morang-5", winner: "Yogendra Mandal", party: "Independent" },
      { constituency: "Morang-6", winner: "Dr Shekhar Koirala", party: "Nepali Congress" },
    ],
  },
  SUNSARI: {
    province: 1,
    results: [
      { constituency: "Sunsari-1", winner: "Ashok Kumar Rai", party: "Janata Samajwadi Party" },
      { constituency: "Sunsari-2", winner: "Bhim Prasad Acharya", party: "CPN-UML" },
      { constituency: "Sunsari-3", winner: "Bhagawati Chaudhary", party: "CPN-UML" },
      { constituency: "Sunsari-4", winner: "Gyanendra Bahadur Karki", party: "Nepali Congress" },
    ],
  },
  SOLUKHUMBU: {
    province: 1,
    results: [
      { constituency: "Solukhumbu-1", winner: "Manbir Rai", party: "CPN-UML" },
    ],
  },
  KHOTANG: {
    province: 1,
    results: [
      { constituency: "Khotang-1", winner: "Ram Kumar Rai", party: "CPN (Maoist Centre)" },
    ],
  },
  OKHALDHUNGA: {
    province: 1,
    results: [
      { constituency: "Okhaldhunga-1", winner: "Ram Hari Khatiwada", party: "Nepali Congress" },
    ],
  },
  UDAYAPUR: {
    province: 1,
    results: [
      { constituency: "Udayapur-1", winner: "Dr Narayan Khadka", party: "Nepali Congress" },
      { constituency: "Udayapur-2", winner: "Ambar Bahadur Rayamajhi", party: "CPN-UML" },
    ],
  },

  // Province 2 - Madhesh Pradesh
  SAPTARI: {
    province: 2,
    results: [
      { constituency: "Saptari-1", winner: "Nawal Kishor Sah Sudi", party: "Janata Samajwadi Party" },
      { constituency: "Saptari-2", winner: "Chandra Kant Raut", party: "Janamat Party" },
      { constituency: "Saptari-3", winner: "Dinesh Kumar Yadav", party: "Nepali Congress" },
      { constituency: "Saptari-4", winner: "Teju Lal Chaudhary", party: "Nepali Congress" },
    ],
  },
  SIRAHA: {
    province: 2,
    results: [
      { constituency: "Siraha-1", winner: "Ram Shankar Yadav", party: "CPN-UML" },
      { constituency: "Siraha-2", winner: "Raj Kishor Yadav", party: "Janata Samajwadi Party" },
      { constituency: "Siraha-3", winner: "Lilanath Shrestha", party: "CPN-UML" },
      { constituency: "Siraha-4", winner: "Birendra Prasad Mahato", party: "Janata Samajwadi Party" },
    ],
  },
  DHANUSA: {
    province: 2,
    results: [
      { constituency: "Dhanusha-1", winner: "Deepak Karki", party: "Janata Samajwadi Party" },
      { constituency: "Dhanusha-2", winner: "Ram Krishna Yadav", party: "Nepali Congress" },
      { constituency: "Dhanusha-3", winner: "Juli Kumari Mahato", party: "CPN-UML" },
      { constituency: "Dhanusha-4", winner: "Raghubir Mahaseth", party: "CPN-UML" },
    ],
  },
  MAHOTTARI: {
    province: 2,
    results: [
      { constituency: "Mahottari-1", winner: "Laxmi Mahato Koiri", party: "CPN-UML" },
      { constituency: "Mahottari-2", winner: "Sharat Singh Bhandari", party: "Loktantrik Samajwadi Party" },
      { constituency: "Mahottari-3", winner: "Mahantha Thakur", party: "Loktantrik Samajwadi Party" },
      { constituency: "Mahottari-4", winner: "Mahendra Kumar Raya", party: "Nepali Congress" },
    ],
  },
  SARLAHI: {
    province: 2,
    results: [
      { constituency: "Sarlahi-1", winner: "Ram Prakash Chaudhary", party: "Loktantrik Samajwadi Party" },
      { constituency: "Sarlahi-2", winner: "Mahindra Raya Yadav", party: "CPN (Maoist Centre)" },
      { constituency: "Sarlahi-3", winner: "Hari Prasad Upreti", party: "CPN-UML" },
      { constituency: "Sarlahi-4", winner: "Amaresh Kumar Singh", party: "Independent" },
    ],
  },
  RAUTAHAT: {
    province: 2,
    results: [
      { constituency: "Rautahat-1", winner: "Madhav Kumar Nepal", party: "CPN (Unified Socialist)" },
      { constituency: "Rautahat-2", winner: "Kiran Kumar Sah", party: "Independent" },
      { constituency: "Rautahat-3", winner: "Prabhu Sah", party: "Independent" },
      { constituency: "Rautahat-4", winner: "Dev Prasad Timalsena", party: "Nepali Congress" },
    ],
  },
  BARA: {
    province: 2,
    results: [
      { constituency: "Bara-1", winner: "Achyut Prasad Mainali", party: "CPN-UML" },
      { constituency: "Bara-2", winner: "Ram Sahay Prasad Yadav", party: "Janata Samajwadi Party" },
      { constituency: "Bara-3", winner: "Jwala Kumari Sah", party: "CPN-UML" },
      { constituency: "Bara-4", winner: "Krishna Kumar Shrestha", party: "CPN (Unified Socialist)" },
    ],
  },
  PARSA: {
    province: 2,
    results: [
      { constituency: "Parsa-1", winner: "Pradip Yadav", party: "Janata Samajwadi Party" },
      { constituency: "Parsa-2", winner: "Ajay Kumar Chaurasiya", party: "Nepali Congress" },
      { constituency: "Parsa-3", winner: "Raj Kumar Gupta", party: "CPN-UML" },
      { constituency: "Parsa-4", winner: "Ramesh Rijal", party: "Nepali Congress" },
    ],
  },

  // Province 3 - Bagmati Pradesh
  DOLAKHA: {
    province: 3,
    results: [
      { constituency: "Dolakha-1", winner: "Ganga Karki", party: "CPN (Maoist Centre)" },
    ],
  },
  RAMECHHAP: {
    province: 3,
    results: [
      { constituency: "Ramechhap-1", winner: "Purna Bahadur Tamang", party: "Nepali Congress" },
    ],
  },
  SINDHULI: {
    province: 3,
    results: [
      { constituency: "Sindhuli-1", winner: "Shyam Kumar Ghimire", party: "Nepali Congress" },
      { constituency: "Sindhuli-2", winner: "Lekhnath Dahal", party: "CPN (Maoist Centre)" },
    ],
  },
  RASUWA: {
    province: 3,
    results: [
      { constituency: "Rasuwa-1", winner: "Mohan Acharya", party: "Nepali Congress" },
    ],
  },
  DHADING: {
    province: 3,
    results: [
      { constituency: "Dhading-1", winner: "Rajendra Prasad Pandey", party: "CPN (Unified Socialist)" },
      { constituency: "Dhading-2", winner: "Ramnath Adhikari", party: "Nepali Congress" },
    ],
  },
  NUWAKOT: {
    province: 3,
    results: [
      { constituency: "Nuwakot-1", winner: "Hit Bahadur Tamang", party: "CPN (Maoist Centre)" },
      { constituency: "Nuwakot-2", winner: "Arjun Narsingh KC", party: "Nepali Congress" },
    ],
  },
  KATHMANDU: {
    province: 3,
    results: [
      { constituency: "Kathmandu-1", winner: "Prakash Man Singh", party: "Nepali Congress" },
      { constituency: "Kathmandu-2", winner: "Sobita Gautam", party: "Rastriya Swatantra Party" },
      { constituency: "Kathmandu-3", winner: "Santosh Chalise", party: "Nepali Congress" },
      { constituency: "Kathmandu-4", winner: "Gagan Kumar Thapa", party: "Nepali Congress" },
      { constituency: "Kathmandu-5", winner: "Pradeep Paudel", party: "Nepali Congress" },
      { constituency: "Kathmandu-6", winner: "Shishir Khanal", party: "Rastriya Swatantra Party" },
      { constituency: "Kathmandu-7", winner: "Ganesh Parajuli", party: "Rastriya Swatantra Party" },
      { constituency: "Kathmandu-8", winner: "Biraj Bhakta Shrestha", party: "Rastriya Swatantra Party" },
      { constituency: "Kathmandu-9", winner: "Krishna Gopal Shrestha", party: "CPN-UML" },
      { constituency: "Kathmandu-10", winner: "Rajendra Kumar KC", party: "Nepali Congress" },
    ],
  },
  BHAKTAPUR: {
    province: 3,
    results: [
      { constituency: "Bhaktapur-1", winner: "Prem Suwal", party: "Nepal Workers and Peasants Party" },
      { constituency: "Bhaktapur-2", winner: "Durlabh Thapa Chhetri", party: "Nepali Congress" },
    ],
  },
  LALITPUR: {
    province: 3,
    results: [
      { constituency: "Lalitpur-1", winner: "Udaya Shumsher JB Rana", party: "Nepali Congress" },
      { constituency: "Lalitpur-2", winner: "Prem Bahadur Maharjan", party: "CPN-UML" },
      { constituency: "Lalitpur-3", winner: "Toshima Karki", party: "Rastriya Swatantra Party" },
    ],
  },
  KAVREPALANCHOWK: {
    province: 3,
    results: [
      { constituency: "Kavrepalanchok-1", winner: "Surya Man Tamang", party: "CPN (Maoist Centre)" },
      { constituency: "Kavrepalanchok-2", winner: "Gokul Prasad Banskota", party: "CPN-UML" },
    ],
  },
  SINDHUPALCHOK: {
    province: 3,
    results: [
      { constituency: "Sindhupalchok-1", winner: "Madhav Sapkota", party: "CPN (Maoist Centre)" },
      { constituency: "Sindhupalchok-2", winner: "Mohan Bahadur Basnet", party: "Nepali Congress" },
    ],
  },
  MAKWANPUR: {
    province: 3,
    results: [
      { constituency: "Makawanpur-1", winner: "Deepak Bahadur Singh", party: "Rastriya Prajatantra Party" },
      { constituency: "Makawanpur-2", winner: "Mahesh Kumar Bartaula", party: "CPN-UML" },
    ],
  },
  CHITWAN: {
    province: 3,
    results: [
      { constituency: "Chitwan-1", winner: "Hari Dhakal", party: "Rastriya Swatantra Party" },
      { constituency: "Chitwan-2", winner: "Rabi Lamichhane", party: "Rastriya Swatantra Party" },
      { constituency: "Chitwan-3", winner: "Bikram Pandey", party: "Rastriya Prajatantra Party" },
    ],
  },

  // Province 4 - Gandaki Pradesh
  GORKHA: {
    province: 4,
    results: [
      { constituency: "Gorkha-1", winner: "Rajendra Bajagain", party: "Nepali Congress" },
      { constituency: "Gorkha-2", winner: "Pushpa Kamal Dahal", party: "CPN (Maoist Centre)" },
    ],
  },
  MANANG: {
    province: 4,
    results: [
      { constituency: "Manang-1", winner: "Tek Bahadur Gurung", party: "Nepali Congress" },
    ],
  },
  LAMJUNG: {
    province: 4,
    results: [
      { constituency: "Lamjung-1", winner: "Prithvi Subba Gurung", party: "CPN-UML" },
    ],
  },
  KASKI: {
    province: 4,
    results: [
      { constituency: "Kaski-1", winner: "Man Bahadur Gurung", party: "CPN-UML" },
      { constituency: "Kaski-2", winner: "Bidya Bhattarai", party: "CPN-UML" },
      { constituency: "Kaski-3", winner: "Damodar Paudel Bairagi", party: "CPN-UML" },
    ],
  },
  TANAHU: {
    province: 4,
    results: [
      { constituency: "Tanahun-1", winner: "Ram Chandra Paudel", party: "Nepali Congress" },
      { constituency: "Tanahun-2", winner: "Shankar Bhandari", party: "Nepali Congress" },
    ],
  },
  SYANGJA: {
    province: 4,
    results: [
      { constituency: "Syangja-1", winner: "Raju Thapa", party: "Nepali Congress" },
      { constituency: "Syangja-2", winner: "Dhan Raj Gurung", party: "Nepali Congress" },
    ],
  },
  NAWALPUR: {
    province: 4,
    results: [
      { constituency: "Nawalparasi East-1", winner: "Shashank Koirala", party: "Nepali Congress" },
      { constituency: "Nawalparasi East-2", winner: "Bishnu Kumar Karki", party: "Nepali Congress" },
    ],
  },
  MUSTANG: {
    province: 4,
    results: [
      { constituency: "Mustang-1", winner: "Yogesh Gauchan Thakali", party: "Nepali Congress" },
    ],
  },
  MYAGDI: {
    province: 4,
    results: [
      { constituency: "Myagdi-1", winner: "Kham Bahadur Garbuja", party: "Nepali Congress" },
    ],
  },
  BAGLUNG: {
    province: 4,
    results: [
      { constituency: "Baglung-1", winner: "Chitra Bahadur KC", party: "Rastriya Janamorcha" },
      { constituency: "Baglung-2", winner: "Devendra Paudel", party: "CPN (Maoist Centre)" },
    ],
  },
  PARBAT: {
    province: 4,
    results: [
      { constituency: "Parbat-1", winner: "Padam Giri", party: "CPN-UML" },
    ],
  },

  // Province 5 - Lumbini Pradesh
  GULMI: {
    province: 5,
    results: [
      { constituency: "Gulmi-1", winner: "Chandra Kanta Bhandari", party: "Nepali Congress" },
      { constituency: "Gulmi-2", winner: "Gokarna Raj Bista", party: "CPN-UML" },
    ],
  },
  PALPA: {
    province: 5,
    results: [
      { constituency: "Palpa-1", winner: "Narayan Prasad Acharya", party: "CPN-UML" },
      { constituency: "Palpa-2", winner: "Thakur Prasad Gaire", party: "CPN-UML" },
    ],
  },
  ARGHAKHANCHI: {
    province: 5,
    results: [
      { constituency: "Arghakhanchi-1", winner: "Top Bahadur Rayamajhi", party: "CPN-UML" },
    ],
  },
  RUPANDEHI: {
    province: 5,
    results: [
      { constituency: "Rupandehi-1", winner: "Chhabilal Bishwakarma", party: "CPN-UML" },
      { constituency: "Rupandehi-2", winner: "Bishnu Prasad Paudel", party: "CPN-UML" },
      { constituency: "Rupandehi-3", winner: "Deepak Bohara", party: "Rastriya Prajatantra Party" },
      { constituency: "Rupandehi-4", winner: "Sarbendra Nath Shukla", party: "Loktantrik Samajwadi Party" },
      { constituency: "Rupandehi-5", winner: "Basu Dev Ghimire", party: "CPN-UML" },
    ],
  },
  KAPILVASTU: {
    province: 5,
    results: [
      { constituency: "Kapilvastu-1", winner: "Balaram Adhikari", party: "CPN-UML" },
      { constituency: "Kapilvastu-2", winner: "Surendra Raj Acharya", party: "Nepali Congress" },
      { constituency: "Kapilvastu-3", winner: "Mangal Prasad Gupta", party: "CPN-UML" },
    ],
  },
  "EASTERN RUKUM": {
    province: 5,
    results: [
      { constituency: "Rukum East-1", winner: "Purna Bahadur Gharti Magar", party: "CPN (Maoist Centre)" },
    ],
  },
  ROLPA: {
    province: 5,
    results: [
      { constituency: "Rolpa-1", winner: "Barshaman Pun", party: "CPN (Maoist Centre)" },
    ],
  },
  PYUTHAN: {
    province: 5,
    results: [
      { constituency: "Pyuthan-1", winner: "Surya Bahadur Thapa Chhetri", party: "CPN-UML" },
    ],
  },
  DANG: {
    province: 5,
    results: [
      { constituency: "Dang-1", winner: "Met Mani Chaudhary", party: "CPN (Unified Socialist)" },
      { constituency: "Dang-2", winner: "Rekha Sharma", party: "CPN (Maoist Centre)" },
      { constituency: "Dang-3", winner: "Dipak Giri", party: "Nepali Congress" },
    ],
  },
  BANKE: {
    province: 5,
    results: [
      { constituency: "Banke-1", winner: "Surya Prasad Dhakal", party: "CPN-UML" },
      { constituency: "Banke-2", winner: "Dhawal Shumsher JB Rana", party: "Rastriya Prajatantra Party" },
      { constituency: "Banke-3", winner: "Kishor Singh Rathore", party: "Nepali Congress" },
    ],
  },
  BARDIYA: {
    province: 5,
    results: [
      { constituency: "Bardiya-1", winner: "Sanjay Kumar Gautam", party: "Nepali Congress" },
      { constituency: "Bardiya-2", winner: "Lalbir Chaudhary", party: "Independent" },
    ],
  },
  PARASI: {
    province: 5,
    results: [
      { constituency: "Nawalparasi West-1", winner: "Binod Kumar Chaudhary", party: "Nepali Congress" },
      { constituency: "Nawalparasi West-2", winner: "Dhruba Bahadur Pradhan", party: "Rastriya Prajatantra Party" },
    ],
  },

  // Province 6 - Karnali Pradesh
  SALYAN: {
    province: 6,
    results: [
      { constituency: "Salyan-1", winner: "Prakash Jwala", party: "CPN (Unified Socialist)" },
    ],
  },
  DOLPA: {
    province: 6,
    results: [
      { constituency: "Dolpa-1", winner: "Dhan Bahadur Budha", party: "CPN (Unified Socialist)" },
    ],
  },
  MUGU: {
    province: 6,
    results: [
      { constituency: "Mugu-1", winner: "Ain Bahadur Shahi Thakuri", party: "Nepali Congress" },
    ],
  },
  JUMLA: {
    province: 6,
    results: [
      { constituency: "Jumla-1", winner: "Gyan Bahadur Shahi", party: "Rastriya Prajatantra Party" },
    ],
  },
  KALIKOT: {
    province: 6,
    results: [
      { constituency: "Kalikot-1", winner: "Mahendra Bahadur Shahi", party: "CPN (Maoist Centre)" },
    ],
  },
  HUMLA: {
    province: 6,
    results: [
      { constituency: "Humla-1", winner: "Chhiring Damdul Lama", party: "CPN (Maoist Centre)" },
    ],
  },
  JAJARKOT: {
    province: 6,
    results: [
      { constituency: "Jajarkot-1", winner: "Shakti Bahadur Basnet", party: "CPN (Maoist Centre)" },
    ],
  },
  DAILEKH: {
    province: 6,
    results: [
      { constituency: "Dailekh-1", winner: "Ammar Bahadur Thapa", party: "CPN (Unified Socialist)" },
      { constituency: "Dailekh-2", winner: "Dikpal Kumar Shahi", party: "Nepali Congress" },
    ],
  },
  SURKHET: {
    province: 6,
    results: [
      { constituency: "Surkhet-1", winner: "Purna Bahadur Khadka", party: "Nepali Congress" },
      { constituency: "Surkhet-2", winner: "Hridaya Ram Thani", party: "Nepali Congress" },
    ],
  },
  "WESTERN RUKUM": {
    province: 6,
    results: [
      { constituency: "Rukum West-1", winner: "Janardan Sharma", party: "CPN (Maoist Centre)" },
    ],
  },

  // Province 7 - Sudurpashchim Pradesh
  BAJURA: {
    province: 7,
    results: [
      { constituency: "Bajura-1", winner: "Badri Prasad Pandey", party: "Nepali Congress" },
    ],
  },
  ACHHAM: {
    province: 7,
    results: [
      { constituency: "Achham-1", winner: "Sher Bahadur Kunwar", party: "CPN (Unified Socialist)" },
      { constituency: "Achham-2", winner: "Pushpa Bahadur Shah", party: "Nepali Congress" },
    ],
  },
  BAJHANG: {
    province: 7,
    results: [
      { constituency: "Bajhang-1", winner: "Bhanubhakta Joshi", party: "CPN (Unified Socialist)" },
    ],
  },
  DOTI: {
    province: 7,
    results: [
      { constituency: "Doti-1", winner: "Prem Bahadur Ale", party: "CPN (Unified Socialist)" },
    ],
  },
  KAILALI: {
    province: 7,
    results: [
      { constituency: "Kailali-1", winner: "Ranjita Shrestha", party: "Nagarik Unmukti Party" },
      { constituency: "Kailali-2", winner: "Arun Kumar Chaudhary", party: "Nagarik Unmukti Party" },
      { constituency: "Kailali-3", winner: "Ganga Ram Chaudhary", party: "Nagarik Unmukti Party" },
      { constituency: "Kailali-4", winner: "Bir Bahadur Balayar", party: "Nepali Congress" },
      { constituency: "Kailali-5", winner: "Dilli Raj Panta", party: "Nepali Congress" },
    ],
  },
  DARCHULA: {
    province: 7,
    results: [
      { constituency: "Darchula-1", winner: "Dilendra Prasad Badu", party: "Nepali Congress" },
    ],
  },
  BAITADI: {
    province: 7,
    results: [
      { constituency: "Baitadi-1", winner: "Damodar Bhandari", party: "CPN-UML" },
    ],
  },
  DADELDHURA: {
    province: 7,
    results: [
      { constituency: "Dadeldhura-1", winner: "Sher Bahadur Deuba", party: "Nepali Congress" },
    ],
  },
  KANCHANPUR: {
    province: 7,
    results: [
      { constituency: "Kanchanpur-1", winner: "Tara Lama Tamang", party: "CPN-UML" },
      { constituency: "Kanchanpur-2", winner: "Narayan Prakash Saud", party: "Nepali Congress" },
      { constituency: "Kanchanpur-3", winner: "Ramesh Lekhak", party: "Nepali Congress" },
    ],
  },
};

/**
 * Compute dominant party for a district based on actual 2022 FPTP results.
 * The dominant party is whichever party won the most seats in that district.
 */
function computeDominant(results: ConstituencyResult[]): { party: string; color: string } {
  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.party] = (counts[r.party] || 0) + 1;
  }

  let maxParty = results[0]?.party || "Unknown";
  let maxCount = 0;
  for (const [party, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxParty = party;
    }
  }

  return { party: maxParty, color: getColor(maxParty) };
}

// Build the final dataset
export const districtStrengthData: DistrictStrength[] = Object.entries(RAW_RESULTS).map(
  ([district, data]) => {
    const dominant = computeDominant(data.results);
    return {
      district,
      province: data.province,
      results: data.results,
      dominantParty: dominant.party,
      dominantPartyColor: dominant.color,
    };
  }
);

/**
 * Get dominant party color for a district from real election data.
 */
export function getRealDominantPartyColor(districtName: string): string {
  const normalized = districtName.toUpperCase().trim();
  const d = districtStrengthData.find((x) => x.district === normalized);
  return d?.dominantPartyColor || "#6b7280";
}

/**
 * Get dominant party name for a district from real election data.
 */
export function getRealDominantPartyName(districtName: string): string {
  const normalized = districtName.toUpperCase().trim();
  const d = districtStrengthData.find((x) => x.district === normalized);
  return d?.dominantParty || "No data";
}

/**
 * Get constituency results for a district.
 */
export function getDistrictResults(districtName: string): ConstituencyResult[] {
  const normalized = districtName.toUpperCase().trim();
  const d = districtStrengthData.find((x) => x.district === normalized);
  return d?.results || [];
}

/**
 * Get party dominance summary across all districts (how many districts each party dominates).
 */
export function getRealPartyDominance(): { party: string; count: number; color: string }[] {
  const counts: Record<string, number> = {};
  for (const d of districtStrengthData) {
    counts[d.dominantParty] = (counts[d.dominantParty] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([party, count]) => ({ party, count, color: getColor(party) }))
    .sort((a, b) => b.count - a.count);
}
