export interface Service {
  np: string;
  en: string;
  desc: string;
  tint: string;
  color: string;
}

export const services: Service[] = [
  { np: "ओपीडी सेवा", en: "OUTPATIENT", desc: "विशेषज्ञसहितको दैनिक बहिरंग सेवा।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "आकस्मिक सेवा", en: "EMERGENCY", desc: "२४ घण्टा आपत्कालीन उपचार र ट्रमा हेरचाह।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "शल्यक्रिया", en: "SURGERY", desc: "सामान्य तथा विशेष शल्यक्रिया सुविधा।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "प्रसूति सेवा", en: "MATERNITY", desc: "सुरक्षित मातृत्व र प्रसूति हेरचाह।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "प्रयोगशाला", en: "LABORATORY", desc: "भरपर्दो रक्त तथा प्याथोलोजी परीक्षण।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "रेडियोलोजी / एक्स-रे", en: "RADIOLOGY", desc: "एक्स-रे, अल्ट्रासाउन्ड र इमेजिङ।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "फार्मेसी", en: "PHARMACY", desc: "सुलभ मूल्यमा औषधि उपलब्धता।", tint: "#EAF4FC", color: "#3282B8" },
  { np: "एम्बुलेन्स", en: "AMBULANCE", desc: "२४ घण्टा एम्बुलेन्स सेवा।", tint: "#E7F1FB", color: "#0F4C75" },
  { np: "खोप सेवा", en: "IMMUNIZATION", desc: "नियमित खोप तथा बाल स्वास्थ्य।", tint: "#EAF4FC", color: "#3282B8" },
];
