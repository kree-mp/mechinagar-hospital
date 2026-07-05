export const hospital = {
  nameNp: "मेचीनगर आधारभूत अस्पताल",
  nameEn: "MECHINAGAR AADHARVUT HOSPITAL",
  municipalityNp: "मेचीनगर नगरपालिका, झापा · कोशी प्रदेश, नेपाल",
  municipalityEn: "Mechinagar Municipality, Jhapa · Koshi Province, Nepal",
  ministryNp: "मेचीनगर नगरपालिकाद्वारा सञ्चालित · स्वास्थ्य शाखा",
  ministryEn: "Operated by Mechinagar Municipality · Health Branch",
  phone: "०२३-५९१४५९",
  phoneEn: "023-591459",
  email: "dhulabariphc.gov.np@gmail.com",
  emergencyShort: "१०२",
  emergencyShortEn: "102",
  emergencyFull: "०२३-५९१४५९",
  emergencyFullEn: "023-591459",
  address: "मेचीनगर नगरपालिका, वडा नं. १०, झापा, कोशी प्रदेश, नेपाल",
  addressEn: "Mechinagar Municipality, Ward No. 10, Jhapa, Koshi Province, Nepal",
  officeHours: "बिहान ९:०० – साँझ ५:०० (ओपीडी सेवा)",
  officeHoursEn: "9:00 AM – 5:00 PM (OPD service)",
  copyrightYear: "२०८३",
  copyrightYearEn: "2083",
};

export interface NavItem {
  href: string;
  label: string;
  labelEn: string;
}

export const navItems: NavItem[] = [
  { href: "#home", label: "गृहपृष्ठ", labelEn: "Home" },
  { href: "#about", label: "हाम्रो बारेमा", labelEn: "About" },
  { href: "#services", label: "सेवाहरू", labelEn: "Services" },
  { href: "#staff", label: "चिकित्सक/कर्मचारी", labelEn: "Staff" },
  { href: "#notices", label: "सूचना", labelEn: "Notices" },
  { href: "#news", label: "समाचार", labelEn: "News" },
  { href: "#contact", label: "सम्पर्क", labelEn: "Contact" },
];

export interface QuickAccessCard {
  href: string;
  titleNp: string;
  titleEn: string;
  sub: string;
  subEn: string;
  barColor: string;
}

export const quickAccessCards: QuickAccessCard[] = [
  { href: "#contact", titleNp: "आकस्मिक सेवा", titleEn: "Emergency Service", sub: "24 hour emergency · फोन १०२", subEn: "24 hour emergency · Phone 102", barColor: "#D24B45" },
  { href: "#staff", titleNp: "चिकित्सक खोज", titleEn: "Find a Doctor", sub: "Find a doctor & OPD", subEn: "Find a doctor & OPD", barColor: "#3282B8" },
  { href: "#patient", titleNp: "ओपीडी समय", titleEn: "OPD Hours", sub: "Daily · 9:00 AM – 5:00 PM", subEn: "Daily · 9:00 AM – 5:00 PM", barColor: "#3282B8" },
  { href: "#notices", titleNp: "सूचना तथा टेन्डर", titleEn: "Notices & Tenders", sub: "Notices & tenders", subEn: "Notices & tenders", barColor: "#3282B8" },
];

export const aboutCopy = {
  bodyNp:
    "मेचीनगर आधारभूत अस्पताल मेचीनगर नगरपालिकाद्वारा सञ्चालित सार्वजनिक स्वास्थ्य संस्था हो। अस्पतालले स्थानीय नागरिकलाई गुणस्तरीय, सहज तथा सुलभ स्वास्थ्य सेवा प्रदान गर्दै आएको छ। अस्पतालमा बहिरंग सेवा, आकस्मिक सेवा, प्रयोगशाला, औषधि वितरण लगायत विभिन्न स्वास्थ्य सेवाहरू उपलब्ध छन्।",
  bodyEn:
    "Operated by Mechinagar Municipality, the hospital is a public health institution providing quality, convenient and accessible care to local citizens — including outpatient, emergency, laboratory and pharmacy services.",
  bedsBadge: "१५",
  bedsBadgeEn: "15",
  bedsBadgeLabelNp: "शय्या क्षमता (IPD)",
  bedsBadgeLabelEn: "Bed Capacity (IPD)",
};

export interface AboutGoal {
  titleNp: string;
  titleEn: string;
  descNp: string;
  descEn: string;
  color: string;
}

export const aboutGoals: AboutGoal[] = [
  {
    titleNp: "दृष्टिकोण (Vision)",
    titleEn: "Vision",
    descNp: "सबै नागरिकलाई गुणस्तरीय, पहुँचयोग्य तथा भरपर्दो स्वास्थ्य सेवा उपलब्ध गराउने।",
    descEn: "To provide quality, accessible and reliable healthcare to every citizen.",
    color: "#3282B8",
  },
  {
    titleNp: "उद्धेश्य (Mission)",
    titleEn: "Mission",
    descNp: "आधुनिक स्वास्थ्य सेवामार्फत समुदायको स्वास्थ्य स्तरमा सुधार ल्याउने तथा नागरिकमैत्री स्वास्थ्य प्रणाली विकास गर्ने।",
    descEn: "To improve community health through modern healthcare and build a citizen-friendly health system.",
    color: "#D24B45",
  },
];

export interface AboutObjective {
  np: string;
  en: string;
}

export const aboutObjectives: AboutObjective[] = [
  { np: "गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्ने।", en: "Provide quality healthcare services." },
  { np: "मातृ तथा शिशु स्वास्थ्य प्रवर्द्धन गर्ने।", en: "Promote maternal and child health." },
  { np: "स्वास्थ्य सचेतना अभिवृद्धि गर्ने।", en: "Increase health awareness." },
  { np: "रोगको रोकथाम तथा नियन्त्रणमा सहयोग गर्ने।", en: "Support disease prevention and control." },
  { np: "सेवा प्रवाहलाई पारदर्शी तथा प्रभावकारी बनाउने।", en: "Make service delivery transparent and effective." },
];

export interface Statistic {
  value: string;
  np: string;
  en: string;
}

export const statistics: Statistic[] = [
  { value: "१५", np: "शय्या क्षमता", en: "BEDS" },
  { value: "३५", np: "चिकित्सक तथा कर्मचारी", en: "STAFF" },
  { value: "८", np: "स्वास्थ्य सेवा एकाइ", en: "SERVICE UNITS" },
  { value: "११", np: "व्यवस्थापन समिति सदस्य", en: "COMMITTEE" },
];

export interface QuickServiceLink {
  label: string;
  labelEn: string;
  href: string;
}

export const quickServiceLinks: QuickServiceLink[] = [
  { label: "अनलाइन अपोइन्टमेन्ट", labelEn: "Online Appointment", href: "#contact" },
  { label: "प्रतिवेदन हेर्नुहोस्", labelEn: "View Reports", href: "#reports" },
  { label: "व्यवस्थापन समिति", labelEn: "Management Committee", href: "#committee" },
  { label: "गुनासो पेटिका", labelEn: "Complaint Box", href: "#contact" },
];

export interface VisitingHourRow {
  label: string;
  labelEn: string;
  value: string;
  valueEn: string;
  highlight?: boolean;
}

export const visitingHours: VisitingHourRow[] = [
  { label: "बहिरंग सेवा (OPD)", labelEn: "Outpatient (OPD)", value: "बिहान ९ – साँझ ५", valueEn: "9 AM – 5 PM" },
  { label: "अल्ट्रासाउन्ड (USG)", labelEn: "Ultrasound (USG)", value: "बिहान ९ – दिउँसो २", valueEn: "9 AM – 2 PM" },
  { label: "प्रयोगशाला तथा फार्मेसी", labelEn: "Laboratory & Pharmacy", value: "२४ घण्टा", valueEn: "24 hours" },
  { label: "आकस्मिक सेवा", labelEn: "Emergency Service", value: "२४ घण्टा", valueEn: "24 hours", highlight: true },
];

export interface TranslatedItem {
  np: string;
  en: string;
}

export const freeServices: TranslatedItem[] = [
  { np: "सुरक्षित मातृत्व सेवा", en: "Safe motherhood service" },
  { np: "खोप सेवा", en: "Vaccination service" },
  { np: "परिवार नियोजन सेवा", en: "Family planning service" },
  { np: "नगरपालिकाले तोकेका निःशुल्क सेवाहरू", en: "Free services designated by the municipality" },
];

export const labTests: TranslatedItem[] = [
  { np: "रक्त परीक्षण", en: "Blood test" },
  { np: "पिसाब परीक्षण", en: "Urine test" },
  { np: "दिसा परीक्षण", en: "Stool test" },
  { np: "अन्य आवश्यक परीक्षण", en: "Other necessary tests" },
];

export interface ContactInfoCard {
  titleNp: string;
  titleEn: string;
  body: string;
  bodyEn: string;
}

export const contactInfoCards: ContactInfoCard[] = [
  {
    titleNp: "ठेगाना",
    titleEn: "Address",
    body: "मेचीनगर नगरपालिका, वडा नं. १०, झापा, कोशी प्रदेश, नेपाल",
    bodyEn: "Mechinagar Municipality, Ward No. 10, Jhapa, Koshi Province, Nepal",
  },
  {
    titleNp: "फोन तथा इमेल",
    titleEn: "Phone & Email",
    body: "फोन: ०२३-५९१४५९<br>आकस्मिक: १०२<br>dhulabariphc.gov.np@gmail.com",
    bodyEn: "Phone: 023-591459<br>Emergency: 102<br>dhulabariphc.gov.np@gmail.com",
  },
  {
    titleNp: "सेवा समय",
    titleEn: "Service Hours",
    body: "ओपीडी: बिहान ९ – साँझ ५<br>आकस्मिक: २४ घण्टा",
    bodyEn: "OPD: 9 AM – 5 PM<br>Emergency: 24 hours",
  },
];

export interface FooterLink {
  label: string;
  labelEn: string;
  href: string;
}

export const footerQuickLinks: FooterLink[] = [
  { href: "#about", label: "हाम्रो बारेमा", labelEn: "About Us" },
  { href: "#services", label: "सेवाहरू", labelEn: "Services" },
  { href: "#staff", label: "चिकित्सक/कर्मचारी", labelEn: "Staff" },
  { href: "#committee", label: "व्यवस्थापन समिति", labelEn: "Management Committee" },
  { href: "#reports", label: "प्रतिवेदन", labelEn: "Reports" },
  { href: "#notices", label: "सूचना", labelEn: "Notices" },
  { href: "#gallery", label: "ग्यालरी", labelEn: "Gallery" },
];

export const footerServiceLinks: FooterLink[] = [
  { href: "#", label: "ओपीडी सेवा", labelEn: "OPD Service" },
  { href: "#", label: "आकस्मिक सेवा", labelEn: "Emergency Service" },
  { href: "#", label: "प्रयोगशाला", labelEn: "Laboratory" },
  { href: "#", label: "एक्स-रे / USG", labelEn: "X-Ray / USG" },
  { href: "#", label: "फार्मेसी", labelEn: "Pharmacy" },
];

export const footerContact = {
  lineNp:
    "मेचीनगर नगरपालिका, वडा नं. १०<br>झापा, कोशी प्रदेश, नेपाल<br>फोन: ०२३-५९१४५९<br>आकस्मिक: १०२<br>dhulabariphc.gov.np@gmail.com",
  lineEn:
    "Mechinagar Municipality, Ward No. 10<br>Jhapa, Koshi Province, Nepal<br>Phone: 023-591459<br>Emergency: 102<br>dhulabariphc.gov.np@gmail.com",
};
