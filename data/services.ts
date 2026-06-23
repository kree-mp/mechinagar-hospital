export interface Service {
  np: string;
  en: string;
  desc: string;
  tint: string;
  color: string;
}

export const services: Service[] = [
  { np: "आकस्मिक सेवा", en: "EMERGENCY", desc: "प्राथमिक उपचार, आकस्मिक व्यवस्थापन र रेफरल सेवा — २४ घण्टा उपलब्ध।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "बहिरंग सेवा", en: "OPD", desc: "बिहान ९:०० देखि साँझ ५:०० सम्म दैनिक बहिरंग उपचार सेवा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "भर्ना सेवा", en: "IPD", desc: "१५ शय्या क्षमतासहितको भर्ना तथा हेरचाह सेवा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "प्रयोगशाला सेवा", en: "LABORATORY", desc: "रक्त, पिसाब, दिसा लगायत आवश्यक परीक्षण सेवा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "एक्स-रे सेवा", en: "X-RAY", desc: "२४ घण्टा उपलब्ध डिजिटल एक्स-रे सेवा।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "अल्ट्रासाउन्ड", en: "USG", desc: "बिहान ९ देखि दिउँसो २ बजेसम्म USG सेवा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "ECG सेवा", en: "ECG", desc: "२४ घण्टा उपलब्ध मुटु सम्बन्धी जाँच सेवा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "फार्मेसी", en: "PHARMACY", desc: "सुलभ मूल्यमा औषधि उपलब्धता — २४ घण्टा सेवा।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "निःशुल्क सेवाहरू", en: "FREE SERVICES", desc: "सुरक्षित मातृत्व, खोप तथा परिवार नियोजन सेवा निःशुल्क उपलब्ध।", tint: "#EAF4FC", color: "#3282B8" },
];
