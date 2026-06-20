export const hospital = {
  nameNp: "मेचीनगर आधारभूत अस्पताल",
  nameEn: "MECHINAGAR AADHARVUT HOSPITAL",
  municipalityNp: "मेचीनगर नगरपालिका, झापा · कोशी प्रदेश, नेपाल",
  ministryNp: "नेपाल सरकार · स्वास्थ्य तथा जनसंख्या मन्त्रालय",
  phone: "०२३-५५००११",
  email: "info@mahjhapa.gov.np",
  emergencyShort: "१०२",
  emergencyFull: "०२३-५५०१०२",
  address: "मेचीनगर नगरपालिका–४, झापा, कोशी प्रदेश, नेपाल",
  officeHours: "आइतबार–शुक्रबार, बिहान १० – साँझ ५",
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
  { href: "#doctors", label: "चिकित्सक" },
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
  { href: "#doctors", titleNp: "चिकित्सक खोज", sub: "Find a doctor & OPD", barColor: "#3282B8" },
  { href: "#patient", titleNp: "ओपीडी समय", sub: "Sun–Fri · 8:00 – 14:00", barColor: "#3282B8" },
  { href: "#notices", titleNp: "सूचना तथा टेन्डर", sub: "Notices & tenders", barColor: "#3282B8" },
];

export const aboutCopy = {
  bodyNp:
    "मेचीनगर आधारभूत अस्पताल झापा जिल्लाको मेचीनगर नगरपालिकामा अवस्थित नेपाल सरकारको स्वामित्वमा रहेको सरकारी अस्पताल हो। वि.सं. २०५० मा स्थापना भएको यस अस्पतालले पूर्वी कोशी प्रदेशका लाखौं नागरिकलाई गुणस्तरीय, सुलभ र सर्वसुलभ स्वास्थ्य सेवा प्रदान गर्दै आइरहेको छ।",
  bodyEn:
    "Established under the Government of Nepal and the Ministry of Health & Population, the hospital provides outpatient, inpatient, emergency, surgical and diagnostic services through a dedicated team of doctors, nurses and health workers.",
  yearsBadge: "३०+",
  yearsBadgeLabelNp: "वर्षको सेवा अनुभव",
};

export interface AboutGoal {
  titleNp: string;
  descNp: string;
  color: string;
}

export const aboutGoals: AboutGoal[] = [
  { titleNp: "हाम्रो लक्ष्य", descNp: "सबै नागरिकको पहुँचमा गुणस्तरीय स्वास्थ्य सेवा पुर्‍याउने।", color: "#3282B8" },
  { titleNp: "हाम्रो ध्येय", descNp: "करुणामय, समतामूलक र भरपर्दो उपचार।", color: "#D24B45" },
];

export interface Statistic {
  value: string;
  np: string;
  en: string;
}

export const statistics: Statistic[] = [
  { value: "१००", np: "शय्या क्षमता", en: "BEDS" },
  { value: "२५०+", np: "दैनिक ओपीडी", en: "DAILY OPD" },
  { value: "४५", np: "चिकित्सक तथा कर्मचारी", en: "SPECIALISTS" },
  { value: "१२", np: "विभाग तथा एकाइ", en: "DEPARTMENTS" },
  { value: "२०५०", np: "स्थापना (वि.सं.)", en: "ESTABLISHED" },
];

export interface QuickServiceLink {
  label: string;
  href: string;
}

export const quickServiceLinks: QuickServiceLink[] = [
  { label: "अनलाइन अपोइन्टमेन्ट", href: "#" },
  { label: "रिपोर्ट हेर्नुहोस्", href: "#" },
  { label: "नागरिक वडापत्र", href: "#" },
  { label: "गुनासो पेटिका", href: "#" },
];

export interface VisitingHourRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export const visitingHours: VisitingHourRow[] = [
  { label: "ओपीडी सेवा", value: "आइत–शुक्र, ८–२" },
  { label: "टिकट काउन्टर", value: "बिहान ७ बजेदेखि" },
  { label: "भेटघाट समय", value: "४–६ साँझ" },
  { label: "आकस्मिक", value: "२४ घण्टा", highlight: true },
];

export interface OpdFeeRow {
  label: string;
  value: string;
  isNote?: boolean;
}

export const opdFees: OpdFeeRow[] = [
  { label: "नयाँ टिकट", value: "रु. ५" },
  { label: "पुरानो टिकट", value: "रु. ५" },
  { label: "विशेषज्ञ परामर्श", value: "रु. ५०" },
  { label: "स्वास्थ्य बीमा", value: "सूचीकृत", isNote: true },
];

export const citizenCharterPoints: string[] = [
  "सेवाग्राहीप्रति सम्मानजनक र समतामूलक व्यवहार।",
  "निःशुल्क आधारभूत स्वास्थ्य सेवा।",
  "गुनासो सुनुवाइ तथा पारदर्शी सेवा प्रवाह।",
];

export interface ContactInfoCard {
  titleNp: string;
  body: string;
}

export const contactInfoCards: ContactInfoCard[] = [
  { titleNp: "ठेगाना", body: "मेचीनगर नगरपालिका–४, झापा, कोशी प्रदेश, नेपाल" },
  { titleNp: "फोन तथा इमेल", body: "कार्यालय: ०२३-५५००११<br>आकस्मिक: ०२३-५५०१०२<br>info@mahjhapa.gov.np" },
  { titleNp: "कार्यालय समय", body: "आइतबार–शुक्रबार, बिहान १० – साँझ ५" },
];

export interface FooterLink {
  label: string;
  href: string;
}

export const footerQuickLinks: FooterLink[] = [
  { href: "#about", label: "हाम्रो बारेमा" },
  { href: "#services", label: "सेवाहरू" },
  { href: "#departments", label: "विभागहरू" },
  { href: "#notices", label: "सूचना" },
  { href: "#gallery", label: "ग्यालरी" },
];

export const footerServiceLinks: FooterLink[] = [
  { href: "#", label: "ओपीडी सेवा" },
  { href: "#", label: "आकस्मिक सेवा" },
  { href: "#", label: "प्रयोगशाला" },
  { href: "#", label: "एम्बुलेन्स" },
  { href: "#", label: "फार्मेसी" },
];

export const footerContact = {
  lineNp: "मेचीनगर–४, झापा<br>कोशी प्रदेश, नेपाल<br>फोन: ०२३-५५००११<br>आकस्मिक: १०२<br>info@mahjhapa.gov.np",
};
