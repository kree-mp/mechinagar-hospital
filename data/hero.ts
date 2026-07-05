export interface HeroSlide {
  en: string;
  title: string;
  titleEn: string;
  sub: string;
  label: string;
  imgSrc: string;
}

export const heroSlides: HeroSlide[] = [
  {
    en: "24/7 EMERGENCY & AMBULANCE",
    title: "२४ घण्टा\nआकस्मिक सेवा",
    titleEn: "24 Hour\nEmergency Service",
    sub: "Round-the-clock emergency care, trauma response and ambulance service, every day of the year.",
    label: "EMERGENCY WARD",
    imgSrc: "/img/hero/mechinagar-hospital-hero1.jpg",
  },
  {
    en: "MODERN FACILITIES",
    title: "आधुनिक उपकरण,\nदक्ष जनशक्ति",
    titleEn: "Modern Equipment,\nSkilled Workforce",
    sub: "Equipped laboratories, diagnostic imaging and skilled medical professionals under one roof.",
    label: "OPERATION THEATRE",
    imgSrc: "/img/hero/mechinagar-hospital-hero2.jpg",
  },
  {
    en: "QUALITY CARE FOR ALL",
    title: "स्वस्थ नागरिक,\nसमृद्ध मेचीनगर",
    titleEn: "Healthy Citizens,\nProsperous Mechinagar",
    sub: "Compassionate, accessible and affordable healthcare for every citizen of Jhapa and the eastern Koshi region.",
    label: "HOSPITAL EXTERIOR",
    imgSrc: "/img/hero/mechinagar-hospital-hero3.jpg",
  },
];
