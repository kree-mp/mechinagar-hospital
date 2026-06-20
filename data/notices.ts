export interface Notice {
  day: string;
  mon: string;
  title: string;
  ref: string;
  isNew: boolean;
}

export const noticeTabLabels: string[] = ["सूचना", "टेन्डर", "भर्ना / नतिजा"];

export const noticesByTab: Notice[][] = [
  [
    { day: "०२", mon: "असार", title: "निःशुल्क स्वास्थ्य शिविर सञ्चालनसम्बन्धी सूचना", ref: "सूचना नं. ०७९/८०-१२", isNew: true },
    { day: "२८", mon: "जेठ", title: "ओपीडी सेवा समय परिवर्तनसम्बन्धी जानकारी", ref: "सूचना नं. ०७९/८०-११", isNew: true },
    { day: "१५", mon: "जेठ", title: "स्वास्थ्य बीमा कार्यक्रम सञ्चालनसम्बन्धी", ref: "सूचना नं. ०७९/८०-१०", isNew: false },
    { day: "०४", mon: "जेठ", title: "कोभिड खोप सेवा निरन्तरतासम्बन्धी सूचना", ref: "सूचना नं. ०७९/८०-०९", isNew: false },
  ],
  [
    { day: "३०", mon: "जेठ", title: "चिकित्सकीय उपकरण खरिदसम्बन्धी बोलपत्र आह्वान", ref: "टेन्डर नं. ०२/०७९-८०", isNew: true },
    { day: "१८", mon: "जेठ", title: "अस्पताल भवन मर्मतसम्बन्धी शिलबन्दी दरभाउपत्र", ref: "टेन्डर नं. ०१/०७९-८०", isNew: false },
    { day: "०५", mon: "जेठ", title: "औषधि आपूर्तिसम्बन्धी वार्षिक बोलपत्र", ref: "टेन्डर नं. ०७/०७८-७९", isNew: false },
  ],
  [
    { day: "२५", mon: "जेठ", title: "स्टाफ नर्स पदपूर्तिसम्बन्धी आवेदन आह्वान", ref: "भर्ना नं. ०३/०७९-८०", isNew: true },
    { day: "१२", mon: "जेठ", title: "ल्याब टेक्निसियन करार सेवा भर्नासम्बन्धी", ref: "भर्ना नं. ०२/०७९-८०", isNew: false },
    { day: "०२", mon: "जेठ", title: "कार्यालय सहयोगी पदको नतिजा प्रकाशन", ref: "भर्ना नं. ०१/०७९-८०", isNew: false },
  ],
];
