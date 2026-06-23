export interface GalleryItem {
  labelNp: string;
  labelEn: string;
  col: string;
  row: string;
  isVideo?: boolean;
}

export const gallery: GalleryItem[] = [
  { labelNp: "अस्पताल भवन", labelEn: "BUILDING", col: "span 2", row: "span 2" },
  { labelNp: "सेवा प्रवाह", labelEn: "OPD / SERVICE", col: "span 1", row: "span 1" },
  { labelNp: "प्रयोगशाला सेवा", labelEn: "LAB", col: "span 1", row: "span 1" },
  { labelNp: "भर्ना वार्ड", labelEn: "WARD", col: "span 1", row: "span 1" },
  { labelNp: "कर्मचारी समूह", labelEn: "STAFF", col: "span 1", row: "span 1" },
  { labelNp: "स्वास्थ्य शिविर", labelEn: "HEALTH CAMP", col: "span 2", row: "span 1" },
  { labelNp: "कार्यक्रम तथा तालिम", labelEn: "PROGRAM & TRAINING", col: "span 1", row: "span 1" },
  { labelNp: "भिडियो सामग्री", labelEn: "VIDEO", col: "span 1", row: "span 1", isVideo: true },
];
