export interface Service {
  np: string;
  nameEn: string;
  en: string;
  desc: string;
  descEn: string;
  tint: string;
  color: string;
}

export const services: Service[] = [ 
  { np: "आकस्मिक सेवा", nameEn: "Emergency Service", en: "EMERGENCY", desc: "प्राथमिक उपचार, आकस्मिक व्यवस्थापन र रेफरल सेवा — २४ घण्टा उपलब्ध।", descEn: "First aid, emergency management and referral service — available 24 hours.", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "बहिरंग सेवा", nameEn: "Outpatient Service", en: "OPD", desc: "बिहान ९:०० देखि साँझ ५:०० सम्म दैनिक बहिरंग उपचार सेवा।", descEn: "Daily outpatient treatment service from 9:00 AM to 5:00 PM.", tint: "#EAF4FC", color: "#3282B8" },
  { np: "भर्ना सेवा", nameEn: "Inpatient Service", en: "IPD", desc: "१५ शय्या क्षमतासहितको भर्ना तथा हेरचाह सेवा।", descEn: "Admission and care service with a capacity of 15 beds.", tint: "#EAF4FC", color: "#3282B8" },
  { np: "प्रयोगशाला सेवा", nameEn: "Laboratory Service", en: "LABORATORY", desc: "रक्त, पिसाब, दिसा लगायत आवश्यक परीक्षण सेवा।", descEn: "Blood, urine, stool and other necessary test services.", tint: "#EAF4FC", color: "#3282B8" },
  { np: "एक्स-रे सेवा", nameEn: "X-Ray Service", en: "X-RAY", desc: "२४ घण्टा उपलब्ध डिजिटल एक्स-रे सेवा।", descEn: "Digital X-ray service available 24 hours.", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "अल्ट्रासाउन्ड", nameEn: "Ultrasound", en: "USG", desc: "बिहान ९ देखि दिउँसो २ बजेसम्म USG सेवा।", descEn: "USG service from 9 AM to 2 PM.", tint: "#EAF4FC", color: "#3282B8" },
  { np: "ECG सेवा", nameEn: "ECG Service", en: "ECG", desc: "२४ घण्टा उपलब्ध मुटु सम्बन्धी जाँच सेवा।", descEn: "Cardiac check-up service available 24 hours.", tint: "#EAF4FC", color: "#3282B8" },
  { np: "फार्मेसी", nameEn: "Pharmacy", en: "PHARMACY", desc: "सुलभ मूल्यमा औषधि उपलब्धता — २४ घण्टा सेवा।", descEn: "Medicines available at affordable prices — 24 hour service.", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "निःशुल्क सेवाहरू", nameEn: "Free Services", en: "FREE SERVICES", desc: "सुरक्षित मातृत्व, खोप तथा परिवार नियोजन सेवा निःशुल्क उपलब्ध।", descEn: "Safe motherhood, vaccination and family planning services available free of cost.", tint: "#EAF4FC", color: "#3282B8" },
];
