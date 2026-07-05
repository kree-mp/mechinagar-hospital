export interface ServiceDetail {
  np: string;
  en: string;
  availability: string;
  availabilityEn: string;
  desc: string;
  descEn: string;
  subServices: string[];
  subServicesEn: string[];
}

export const departments: ServiceDetail[] = [
  {
    np: "आकस्मिक सेवा",
    en: "Emergency",
    availability: "२४ घण्टा",
    availabilityEn: "24 hours",
    desc: "गम्भीर तथा आकस्मिक अवस्थाका बिरामीहरूका लागि सघन तथा द्रुत स्वास्थ्य सेवा।",
    descEn: "Intensive and rapid healthcare service for patients in serious and emergency conditions.",
    subServices: ["प्राथमिक उपचार", "आकस्मिक व्यवस्थापन", "रेफरल सेवा"],
    subServicesEn: ["First aid", "Emergency management", "Referral service"],
  },
  {
    np: "बहिरंग सेवा (OPD)",
    en: "Outpatient Department",
    availability: "बिहान ९:०० – साँझ ५:००",
    availabilityEn: "9:00 AM – 5:00 PM",
    desc: "सामान्य स्वास्थ्य समस्याका लागि दैनिक बहिरंग जाँच तथा परामर्श सेवा।",
    descEn: "Daily outpatient check-up and consultation service for general health issues.",
    subServices: ["सामान्य जाँच", "परामर्श", "औषधि सिफारिस"],
    subServicesEn: ["General check-up", "Consultation", "Medicine recommendation"],
  },
  {
    np: "भर्ना सेवा (IPD)",
    en: "Inpatient Department",
    availability: "१५ शय्या",
    availabilityEn: "15 beds",
    desc: "नजिकबाट निरीक्षण तथा हेरचाह आवश्यक पर्ने बिरामीका लागि भर्ना सेवा।",
    descEn: "Admission service for patients requiring close observation and care.",
    subServices: ["शय्या व्यवस्था", "नियमित अनुगमन", "नर्सिङ् हेरचाह"],
    subServicesEn: ["Bed arrangement", "Regular monitoring", "Nursing care"],
  },
  {
    np: "प्रयोगशाला सेवा",
    en: "Laboratory",
    availability: "दैनिक सेवा",
    availabilityEn: "Daily service",
    desc: "रोग पहिचानका लागि आवश्यक प्रयोगशाला परीक्षणहरू।",
    descEn: "Necessary laboratory tests for disease diagnosis.",
    subServices: ["रक्त परीक्षण", "पिसाब परीक्षण", "दिसा परीक्षण", "अन्य आवश्यक परीक्षण"],
    subServicesEn: ["Blood test", "Urine test", "Stool test", "Other necessary tests"],
  },
  {
    np: "एक्स-रे सेवा",
    en: "X-Ray",
    availability: "२४ घण्टा",
    availabilityEn: "24 hours",
    desc: "हड्डी तथा छाती सम्बन्धी समस्याको पहिचानका लागि एक्स-रे सेवा।",
    descEn: "X-ray service for diagnosing bone and chest-related issues.",
    subServices: ["डिजिटल एक्स-रे"],
    subServicesEn: ["Digital X-ray"],
  },
  {
    np: "अल्ट्रासाउन्ड (USG)",
    en: "Ultrasound",
    availability: "बिहान ९ – दिउँसो २",
    availabilityEn: "9 AM – 2 PM",
    desc: "गर्भावस्था तथा पेट सम्बन्धी जाँचका लागि USG सेवा।",
    descEn: "USG service for pregnancy and abdominal examinations.",
    subServices: ["गर्भावस्था जाँच", "उदर परीक्षण"],
    subServicesEn: ["Pregnancy check-up", "Abdominal examination"],
  },
  {
    np: "ECG सेवा",
    en: "ECG",
    availability: "२४ घण्टा",
    availabilityEn: "24 hours",
    desc: "मुटुको चाल पहिचान गर्नका लागि ECG परीक्षण सेवा।",
    descEn: "ECG test service for identifying heart rhythm.",
    subServices: ["मुटु परीक्षण"],
    subServicesEn: ["Cardiac test"],
  },
  {
    np: "फार्मेसी",
    en: "Pharmacy",
    availability: "२४ घण्टा",
    availabilityEn: "24 hours",
    desc: "सुलभ मूल्यमा आवश्यक औषधि उपलब्ध गराउने सेवा।",
    descEn: "Service providing necessary medicines at affordable prices.",
    subServices: ["औषधि वितरण", "परामर्श"],
    subServicesEn: ["Medicine distribution", "Consultation"],
  },
];
