export type StaffCategory = "doctor" | "nursing" | "paramedics" | "lab" | "pharmacy";

export interface StaffMember {
  name: string;
  post: string;
  category: StaffCategory;
}

export const staff: StaffMember[] = [
  { name: "डा. प्रकाशचन्द्र गच्छदार", post: "मेडिकल अधिकृत", category: "doctor" },
  { name: "डा. मनिषा कोइराला", post: "मेडिकल अधिकृत", category: "doctor" },
  { name: "डा. सुजन गौतम", post: "मेडिकल अधिकृत", category: "doctor" },
  { name: "डा. दिप कुमार मण्डल", post: "मेडिकल अधिकृत", category: "doctor" },
  { name: "डा. राम सेवक शाह", post: "मेडिकल अधिकृत", category: "doctor" },

  { name: "नयना राइ", post: "नर्सिङ्ग इन्चार्ज", category: "nursing" },
  { name: "यशोदा गुरागाँइ", post: "सि.अ.न.मी निरिक्षक", category: "nursing" },
  { name: "सारदा देवी पोखरेल", post: "सि.अ.न.मी निरिक्षक", category: "nursing" },
  { name: "समिक्षा श्रेष्ठ", post: "सि.अ.न.मी निरिक्षक", category: "nursing" },
  { name: "सुमिति शाह", post: "सि.अ.न.मी", category: "nursing" },
  { name: "अरुणा राई", post: "अ.न.मी", category: "nursing" },
  { name: "प्रगती खतिवडा", post: "स्टाफ नर्स", category: "nursing" },
  { name: "जेलिना बस्नेत", post: "स्टाफ नर्स", category: "nursing" },
  { name: "रक्षा ढकाल", post: "स्टाफ नर्स", category: "nursing" },
  { name: "प्रजिता भट्टराई", post: "स्टाफ नर्स", category: "nursing" },
  { name: "भावना मुखिया", post: "स्टाफ नर्स", category: "nursing" },
  { name: "पुजा मेचे", post: "स्टाफ नर्स", category: "nursing" },
  { name: "सुजता तिमसिना", post: "सि.अ.न.मी", category: "nursing" },
  { name: "हेम कुमारी श्रेष्ठ", post: "अ.न.मी", category: "nursing" },

  { name: "सन्दिप भट्ट", post: "इमरजेन्सी इन्चार्ज", category: "paramedics" },
  { name: "हेम प्रसाद खतिवडा", post: "सि.अ.हे.ब.", category: "paramedics" },
  { name: "शुभद्रा खतिवडा", post: "सि.अ.हे.ब.", category: "paramedics" },
  { name: "शुशान्त पोख्रेल", post: "हे.अ.", category: "paramedics" },
  { name: "टिकादेवी खतिवडा", post: "हे.अ.", category: "paramedics" },
  { name: "बिशाल धिमाल", post: "हे.अ.", category: "paramedics" },
  { name: "रोशन दाहाल", post: "अ.हे.ब.", category: "paramedics" },

  { name: "पुजा भण्डारी", post: "ल्याब इन्चार्ज", category: "lab" },
  { name: "सुर्य बहादुर बोहोरा", post: "ल्याब टेक्निसियन", category: "lab" },
  { name: "अनिमा राजबंशी", post: "ल्याब असिष्टेन्ट", category: "lab" },
  { name: "संगिता कुमारी भुजेल", post: "ल्याब असिष्टेन्ट", category: "lab" },
  { name: "एकता खनाल", post: "ल्याब असिष्टेन्ट", category: "lab" },

  { name: "शोभा थापा", post: "फार्मेसी इन्चार्ज", category: "pharmacy" },
  { name: "निशा निरौला", post: "फार्मेसी सहायक", category: "pharmacy" },
  { name: "सेविका कटुवाल", post: "फार्मेसी सहायक", category: "pharmacy" },
  { name: "सलिम अलि", post: "फार्मेसी सहयोगी", category: "pharmacy" },
];

export interface StaffFilterChip {
  id: "all" | StaffCategory;
  label: string;
}

export const staffFilterChips: StaffFilterChip[] = [
  { id: "all", label: "सबै" },
  { id: "doctor", label: "चिकित्सक" },
  { id: "nursing", label: "नर्सिङ्" },
  { id: "paramedics", label: "पारामेडिक्स" },
  { id: "lab", label: "प्रयोगशाला" },
  { id: "pharmacy", label: "फार्मेसी" },
];
