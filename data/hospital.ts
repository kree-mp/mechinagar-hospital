export const hospital = {
  nameNp: "मेचीनगर आधारभूत अस्पताल",
  nameEn: "MECHINAGAR AADHARVUT HOSPITAL",
  municipalityNp: "मेचीनगर नगरपालिका, झापा · कोशी प्रदेश, नेपाल",
  ministryNp: "मेचीनगर नगरपालिकाद्वारा सञ्चालित · स्वास्थ्य शाखा",
  phone: "०२३-५९१४५९",
  email: "dhulabariphc.gov.np@gmail.com",
  emergencyShort: "१०२",
  emergencyFull: "०२३-५९१४५९",
  address: "मेचीनगर नगरपालिका, वडा नं. १०, झापा, कोशी प्रदेश, नेपाल",
  officeHours: "बिहान ९:०० – साँझ ५:०० (ओपीडी सेवा)",
  bsDate: "वि.सं. २०८३ असार ०३, बुधबार",
  copyrightYear: "२०८३",
  totalVisits: "४२,८१९",
};

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "#home", label: "गृहपृष्ठ" },
  { href: "#about", label: "हाम्रो बारेमा" },
  { href: "#services", label: "सेवाहरू" },
  { href: "#staff", label: "चिकित्सक/कर्मचारी" },
  { href: "#notices", label: "सूचना" },
  { href: "#news", label: "समाचार" },
  { href: "#contact", label: "सम्पर्क" },
];

export interface QuickAccessCard {
  href: string;
  titleNp: string;
  sub: string;
  barColor: string;
}

export const quickAccessCards: QuickAccessCard[] = [
  { href: "#contact", titleNp: "आकस्मिक सेवा", sub: "24 hour emergency · फोन १०२", barColor: "#D24B45" },
  { href: "#staff", titleNp: "चिकित्सक खोज", sub: "Find a doctor & OPD", barColor: "#3282B8" },
  { href: "#patient", titleNp: "ओपीडी समय", sub: "Daily · 9:00 AM – 5:00 PM", barColor: "#3282B8" },
  { href: "#notices", titleNp: "सूचना तथा टेन्डर", sub: "Notices & tenders", barColor: "#3282B8" },
];

export const aboutCopy = {
  bodyNp:
    "मेचीनगर आधारभूत अस्पताल मेचीनगर नगरपालिकाद्वारा सञ्चालित सार्वजनिक स्वास्थ्य संस्था हो। अस्पतालले स्थानीय नागरिकलाई गुणस्तरीय, सहज तथा सुलभ स्वास्थ्य सेवा प्रदान गर्दै आएको छ। अस्पतालमा बहिरंग सेवा, आकस्मिक सेवा, प्रयोगशाला, औषधि वितरण लगायत विभिन्न स्वास्थ्य सेवाहरू उपलब्ध छन्।",
  bodyEn:
    "Operated by Mechinagar Municipality, the hospital is a public health institution providing quality, convenient and accessible care to local citizens — including outpatient, emergency, laboratory and pharmacy services.",
  bedsBadge: "१५",
  bedsBadgeLabelNp: "शय्या क्षमता (IPD)",
};

export interface AboutGoal {
  titleNp: string;
  descNp: string;
  color: string;
}

export const aboutGoals: AboutGoal[] = [
  {
    titleNp: "दृष्टिकोण (Vision)",
    descNp: "सबै नागरिकलाई गुणस्तरीय, पहुँचयोग्य तथा भरपर्दो स्वास्थ्य सेवा उपलब्ध गराउने।",
    color: "#3282B8",
  },
  {
    titleNp: "ध्येय (Mission)",
    descNp: "आधुनिक स्वास्थ्य सेवामार्फत समुदायको स्वास्थ्य स्तरमा सुधार ल्याउने तथा नागरिकमैत्री स्वास्थ्य प्रणाली विकास गर्ने।",
    color: "#D24B45",
  },
];

export const aboutObjectives: string[] = [
  "गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्ने।",
  "मातृ तथा शिशु स्वास्थ्य प्रवर्द्धन गर्ने।",
  "स्वास्थ्य सचेतना अभिवृद्धि गर्ने।",
  "रोगको रोकथाम तथा नियन्त्रणमा सहयोग गर्ने।",
  "सेवा प्रवाहलाई पारदर्शी तथा प्रभावकारी बनाउने।",
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
  href: string;
}

export const quickServiceLinks: QuickServiceLink[] = [
  { label: "अनलाइन अपोइन्टमेन्ट", href: "#contact" },
  { label: "प्रतिवेदन हेर्नुहोस्", href: "#reports" },
  { label: "व्यवस्थापन समिति", href: "#committee" },
  { label: "गुनासो पेटिका", href: "#contact" },
];

export interface VisitingHourRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export const visitingHours: VisitingHourRow[] = [
  { label: "बहिरंग सेवा (OPD)", value: "बिहान ९ – साँझ ५" },
  { label: "अल्ट्रासाउन्ड (USG)", value: "बिहान ९ – दिउँसो २" },
  { label: "प्रयोगशाला तथा फार्मेसी", value: "२४ घण्टा" },
  { label: "आकस्मिक सेवा", value: "२४ घण्टा", highlight: true },
];

export const freeServices: string[] = [
  "सुरक्षित मातृत्व सेवा",
  "खोप सेवा",
  "परिवार नियोजन सेवा",
  "नगरपालिकाले तोकेका निःशुल्क सेवाहरू",
];

export const labTests: string[] = [
  "रक्त परीक्षण",
  "पिसाब परीक्षण",
  "दिसा परीक्षण",
  "अन्य आवश्यक परीक्षण",
];

export interface ContactInfoCard {
  titleNp: string;
  body: string;
}

export const contactInfoCards: ContactInfoCard[] = [
  { titleNp: "ठेगाना", body: "मेचीनगर नगरपालिका, वडा नं. १०, झापा, कोशी प्रदेश, नेपाल" },
  { titleNp: "फोन तथा इमेल", body: "फोन: ०२३-५९१४५९<br>आकस्मिक: १०२<br>dhulabariphc.gov.np@gmail.com" },
  { titleNp: "सेवा समय", body: "ओपीडी: बिहान ९ – साँझ ५<br>आकस्मिक: २४ घण्टा" },
];

export interface FooterLink {
  label: string;
  href: string;
}

export const footerQuickLinks: FooterLink[] = [
  { href: "#about", label: "हाम्रो बारेमा" },
  { href: "#services", label: "सेवाहरू" },
  { href: "#staff", label: "चिकित्सक/कर्मचारी" },
  { href: "#committee", label: "व्यवस्थापन समिति" },
  { href: "#reports", label: "प्रतिवेदन" },
  { href: "#notices", label: "सूचना" },
  { href: "#gallery", label: "ग्यालरी" },
];

export const footerServiceLinks: FooterLink[] = [
  { href: "#", label: "ओपीडी सेवा" },
  { href: "#", label: "आकस्मिक सेवा" },
  { href: "#", label: "प्रयोगशाला" },
  { href: "#", label: "एक्स-रे / USG" },
  { href: "#", label: "फार्मेसी" },
];

export const footerContact = {
  lineNp:
    "मेचीनगर नगरपालिका, वडा नं. १०<br>झापा, कोशी प्रदेश, नेपाल<br>फोन: ०२३-५९१४५९<br>आकस्मिक: १०२<br>dhulabariphc.gov.np@gmail.com",
};
