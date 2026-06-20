export interface Doctor {
  name: string;
  qual: string;
  dept: string;
  deptId: number;
  opd: string;
}

export const doctors: Doctor[] = [
  { name: "डा. राजेन्द्र पोखरेल", qual: "MBBS, MD (Medicine)", dept: "आन्तरिक चिकित्सा", deptId: 0, opd: "आइत–शुक्र" },
  { name: "डा. सुनिल अधिकारी", qual: "MBBS, MS (Surgery)", dept: "शल्यक्रिया", deptId: 1, opd: "सोम, बुध, शुक्र" },
  { name: "डा. सरिता खड्का", qual: "MBBS, MD (OBGYN)", dept: "प्रसूति तथा स्त्रीरोग", deptId: 2, opd: "आइत–शुक्र" },
  { name: "डा. अनिल राई", qual: "MBBS, MD (Paeds)", dept: "बालरोग", deptId: 3, opd: "आइत–शुक्र" },
  { name: "डा. विकास लिम्बु", qual: "MBBS, MS (Ortho)", dept: "हाडजोर्नी", deptId: 4, opd: "मंगल, बिही" },
  { name: "डा. प्रकाश गुरुङ", qual: "MBBS, Emergency Med.", dept: "आकस्मिक", deptId: 5, opd: "२४ घण्टा" },
  { name: "डा. निशा श्रेष्ठ", qual: "BDS", dept: "दन्त", deptId: 6, opd: "आइत, मंगल, बिही" },
  { name: "डा. मनोज भट्टराई", qual: "MD (Radiology)", dept: "रेडियोलोजी", deptId: 7, opd: "आइत–शुक्र" },
];

export interface DoctorFilterChip {
  id: "all" | number;
  label: string;
}

export const doctorFilterChips: DoctorFilterChip[] = [
  { id: "all", label: "सबै" },
  { id: 0, label: "आन्तरिक" },
  { id: 1, label: "शल्यक्रिया" },
  { id: 2, label: "स्त्रीरोग" },
  { id: 3, label: "बालरोग" },
  { id: 5, label: "आकस्मिक" },
];
