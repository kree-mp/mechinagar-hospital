export interface ServiceDetail {
  np: string;
  en: string;
  availability: string;
  desc: string;
  subServices: string[];
}

export const departments: ServiceDetail[] = [
  {
    np: "आकस्मिक सेवा",
    en: "Emergency",
    availability: "२४ घण्टा",
    desc: "गम्भीर तथा आकस्मिक अवस्थाका बिरामीहरूका लागि सघन तथा द्रुत स्वास्थ्य सेवा।",
    subServices: ["प्राथमिक उपचार", "आकस्मिक व्यवस्थापन", "रेफरल सेवा"],
  },
  {
    np: "बहिरंग सेवा (OPD)",
    en: "Outpatient Department",
    availability: "बिहान ९:०० – साँझ ५:००",
    desc: "सामान्य स्वास्थ्य समस्याका लागि दैनिक बहिरंग जाँच तथा परामर्श सेवा।",
    subServices: ["सामान्य जाँच", "परामर्श", "औषधि सिफारिस"],
  },
  {
    np: "भर्ना सेवा (IPD)",
    en: "Inpatient Department",
    availability: "१५ शय्या",
    desc: "नजिकबाट निरीक्षण तथा हेरचाह आवश्यक पर्ने बिरामीका लागि भर्ना सेवा।",
    subServices: ["शय्या व्यवस्था", "नियमित अनुगमन", "नर्सिङ् हेरचाह"],
  },
  {
    np: "प्रयोगशाला सेवा",
    en: "Laboratory",
    availability: "दैनिक सेवा",
    desc: "रोग पहिचानका लागि आवश्यक प्रयोगशाला परीक्षणहरू।",
    subServices: ["रक्त परीक्षण", "पिसाब परीक्षण", "दिसा परीक्षण", "अन्य आवश्यक परीक्षण"],
  },
  {
    np: "एक्स-रे सेवा",
    en: "X-Ray",
    availability: "२४ घण्टा",
    desc: "हड्डी तथा छाती सम्बन्धी समस्याको पहिचानका लागि एक्स-रे सेवा।",
    subServices: ["डिजिटल एक्स-रे"],
  },
  {
    np: "अल्ट्रासाउन्ड (USG)",
    en: "Ultrasound",
    availability: "बिहान ९ – दिउँसो २",
    desc: "गर्भावस्था तथा पेट सम्बन्धी जाँचका लागि USG सेवा।",
    subServices: ["गर्भावस्था जाँच", "उदर परीक्षण"],
  },
  {
    np: "ECG सेवा",
    en: "ECG",
    availability: "२४ घण्टा",
    desc: "मुटुको चाल पहिचान गर्नका लागि ECG परीक्षण सेवा।",
    subServices: ["मुटु परीक्षण"],
  },
  {
    np: "फार्मेसी",
    en: "Pharmacy",
    availability: "२४ घण्टा",
    desc: "सुलभ मूल्यमा आवश्यक औषधि उपलब्ध गराउने सेवा।",
    subServices: ["औषधि वितरण", "परामर्श"],
  },
];
