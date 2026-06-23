export interface ReportCategory {
  np: string;
  en: string;
}

export const reportCategories: ReportCategory[] = [
  { np: "मासिक प्रतिवेदन", en: "MONTHLY REPORT" },
  { np: "त्रैमासिक प्रतिवेदन", en: "QUARTERLY REPORT" },
  { np: "वार्षिक प्रतिवेदन", en: "ANNUAL REPORT" },
  { np: "आर्थिक प्रतिवेदन", en: "FINANCIAL REPORT" },
  { np: "स्वास्थ्य तथ्याङ्क प्रतिवेदन", en: "HEALTH STATISTICS REPORT" },
];
