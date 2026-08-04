import { connectDB } from "./connection.js";
import { User, StaffCategory, Staff, NoticeCategory, Notice, ManagementMember, DownloadCategory, ServiceCategory, Service } from "./models/index.js";
import mongoose from "mongoose";

// ─── Admin user ───────────────────────────────────────────────────────────────

async function ensureAdmin() {
  const email = "dev.nxhettry@gmail.com";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Superadmin already exists:", existing.email);
    return existing._id;
  }
  const admin = await User.create({
    name: "Nishan Gautam",
    email,
    password: "Admin@1234",
    role: "superadmin" as const,
  });
  console.log("Superadmin created:", admin.email);
  return admin._id;
}

// ─── Staff categories ─────────────────────────────────────────────────────────

const STAFF_CATEGORIES = [
  { slug: "doctor",     labelNp: "चिकित्सक",    labelEn: "Doctors",     order: 0 },
  { slug: "nursing",    labelNp: "नर्सिङ्",      labelEn: "Nursing",     order: 1 },
  { slug: "paramedics", labelNp: "पारामेडिक्स",  labelEn: "Paramedics",  order: 2 },
  { slug: "lab",        labelNp: "प्रयोगशाला",   labelEn: "Laboratory",  order: 3 },
  { slug: "pharmacy",   labelNp: "फार्मेसी",     labelEn: "Pharmacy",    order: 4 },
];

async function seedStaffCategories(adminId: mongoose.Types.ObjectId) {
  const existing = await StaffCategory.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Staff categories already seeded (${existing} found), skipping.`);
    return StaffCategory.find({ deletedAt: null }).sort({ order: 1 }).lean();
  }

  const docs = STAFF_CATEGORIES.map((c) => ({ ...c, createdBy: adminId }));
  const result = await StaffCategory.insertMany(docs);
  console.log(`Staff categories seeded: ${result.length}`);
  return result;
}

// ─── Staff ────────────────────────────────────────────────────────────────────

function buildStaffDocs(
  categoryMap: Record<string, mongoose.Types.ObjectId>,
  adminId: mongoose.Types.ObjectId,
) {
  const base = { createdBy: adminId, updatedBy: null, status: "published" as const,
    publishedAt: new Date("2022-06-15"), publishedBy: adminId, scheduledAt: null,
    deletedAt: null, deletedBy: null, photo: null };

  return [
    // Doctors
    { nameNp: "डा. प्रकाशचन्द्र गच्छदार", post: "मेडिकल अधिकृत", category: categoryMap.doctor, order: 0, ...base },
    { nameNp: "डा. मनिषा कोइराला",         post: "मेडिकल अधिकृत", category: categoryMap.doctor, order: 1, ...base },
    { nameNp: "डा. सुजन गौतम",             post: "मेडिकल अधिकृत", category: categoryMap.doctor, order: 2, ...base },
    { nameNp: "डा. दिप कुमार मण्डल",       post: "मेडिकल अधिकृत", category: categoryMap.doctor, order: 3, ...base },
    { nameNp: "डा. राम सेवक शाह",          post: "मेडिकल अधिकृत", category: categoryMap.doctor, order: 4, ...base },
    // Nursing
    { nameNp: "नयना राइ",          post: "नर्सिङ्ग इन्चार्ज",       category: categoryMap.nursing, order: 0, ...base },
    { nameNp: "यशोदा गुरागाँइ",    post: "सि.अ.न.मी निरिक्षक",     category: categoryMap.nursing, order: 1, ...base },
    { nameNp: "सारदा देवी पोखरेल", post: "सि.अ.न.मी निरिक्षक",     category: categoryMap.nursing, order: 2, ...base },
    { nameNp: "समिक्षा श्रेष्ठ",   post: "सि.अ.न.मी निरिक्षक",     category: categoryMap.nursing, order: 3, ...base },
    { nameNp: "सुमिति शाह",        post: "सि.अ.न.मी",              category: categoryMap.nursing, order: 4, ...base },
    { nameNp: "अरुणा राई",         post: "अ.न.मी",                 category: categoryMap.nursing, order: 5, ...base },
    { nameNp: "प्रगती खतिवडा",     post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 6, ...base },
    { nameNp: "जेलिना बस्नेत",     post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 7, ...base },
    { nameNp: "रक्षा ढकाल",        post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 8, ...base },
    { nameNp: "प्रजिता भट्टराई",   post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 9, ...base },
    { nameNp: "भावना मुखिया",      post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 10, ...base },
    { nameNp: "पुजा मेचे",         post: "स्टाफ नर्स",             category: categoryMap.nursing, order: 11, ...base },
    { nameNp: "सुजता तिमसिना",     post: "सि.अ.न.मी",              category: categoryMap.nursing, order: 12, ...base },
    { nameNp: "हेम कुमारी श्रेष्ठ", post: "अ.न.मी",                category: categoryMap.nursing, order: 13, ...base },
    // Paramedics
    { nameNp: "सन्दिप भट्ट",       post: "इमरजेन्सी इन्चार्ज", category: categoryMap.paramedics, order: 0, ...base },
    { nameNp: "हेम प्रसाद खतिवडा", post: "सि.अ.हे.ब.",         category: categoryMap.paramedics, order: 1, ...base },
    { nameNp: "शुभद्रा खतिवडा",    post: "सि.अ.हे.ब.",         category: categoryMap.paramedics, order: 2, ...base },
    { nameNp: "शुशान्त पोख्रेल",   post: "हे.अ.",              category: categoryMap.paramedics, order: 3, ...base },
    { nameNp: "टिकादेवी खतिवडा",   post: "हे.अ.",              category: categoryMap.paramedics, order: 4, ...base },
    { nameNp: "बिशाल धिमाल",       post: "हे.अ.",              category: categoryMap.paramedics, order: 5, ...base },
    { nameNp: "रोशन दाहाल",        post: "अ.हे.ब.",            category: categoryMap.paramedics, order: 6, ...base },
    // Lab
    { nameNp: "पुजा भण्डारी",        post: "ल्याब इन्चार्ज",     category: categoryMap.lab, order: 0, ...base },
    { nameNp: "सुर्य बहादुर बोहोरा", post: "ल्याब टेक्निसियन",  category: categoryMap.lab, order: 1, ...base },
    { nameNp: "अनिमा राजबंशी",       post: "ल्याब असिष्टेन्ट",  category: categoryMap.lab, order: 2, ...base },
    { nameNp: "संगिता कुमारी भुजेल", post: "ल्याब असिष्टेन्ट",  category: categoryMap.lab, order: 3, ...base },
    { nameNp: "एकता खनाल",           post: "ल्याब असिष्टेन्ट",  category: categoryMap.lab, order: 4, ...base },
    // Pharmacy
    { nameNp: "शोभा थापा",   post: "फार्मेसी इन्चार्ज", category: categoryMap.pharmacy, order: 0, ...base },
    { nameNp: "निशा निरौला", post: "फार्मेसी सहायक",   category: categoryMap.pharmacy, order: 1, ...base },
    { nameNp: "सेविका कटुवाल", post: "फार्मेसी सहायक", category: categoryMap.pharmacy, order: 2, ...base },
    { nameNp: "सलिम अलि",    post: "फार्मेसी सहयोगी",  category: categoryMap.pharmacy, order: 3, ...base },
  ];
}

async function seedStaff(
  categories: Array<{ _id: mongoose.Types.ObjectId; slug: string }>,
  adminId: mongoose.Types.ObjectId,
) {
  const existing = await Staff.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Staff already seeded (${existing} found), skipping.`);
    return;
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.slug, c._id]),
  ) as Record<string, mongoose.Types.ObjectId>;

  const docs = buildStaffDocs(categoryMap, adminId);
  const result = await Staff.insertMany(docs);
  console.log(`Staff seeded: ${result.length}`);
}

// ─── Notice categories ────────────────────────────────────────────────────────

const NOTICE_CATEGORIES = [
  { slug: "notice",      labelNp: "सूचना",                labelEn: "Notices",          order: 0 },
  { slug: "procurement", labelNp: "खरिद सूचना",           labelEn: "Procurement",      order: 1 },
  { slug: "vacancy",     labelNp: "रिक्त पद / नतिजा",    labelEn: "Vacancy / Results", order: 2 },
];

async function seedNoticeCategories(adminId: mongoose.Types.ObjectId) {
  const existing = await NoticeCategory.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Notice categories already seeded (${existing} found), skipping.`);
    return NoticeCategory.find({ deletedAt: null }).sort({ order: 1 }).lean();
  }

  const docs = NOTICE_CATEGORIES.map((c) => ({ ...c, createdBy: adminId }));
  const result = await NoticeCategory.insertMany(docs);
  console.log(`Notice categories seeded: ${result.length}`);
  return result;
}

// ─── Notices ──────────────────────────────────────────────────────────────────

function buildNoticeDocs(
  categoryMap: Record<string, mongoose.Types.ObjectId>,
  adminId: mongoose.Types.ObjectId,
) {
  const base = {
    createdBy: adminId, updatedBy: null, status: "published" as const,
    publishedBy: adminId, scheduledAt: null,
    deletedAt: null, deletedBy: null, body: null, file: null, expiresAt: null,
  };

  return [
    // Tab: सूचना
    { title: "निःशुल्क स्वास्थ्य शिविर सञ्चालनसम्बन्धी सूचना",          refNumber: "सूचना नं. ०७९/८०-१२", category: categoryMap.notice,      publishedAt: new Date("2022-06-16"), ...base },
    { title: "ओपीडी सेवा समय (बिहान ९ – साँझ ५) सम्बन्धी जानकारी",      refNumber: "सूचना नं. ०७९/८०-११", category: categoryMap.notice,      publishedAt: new Date("2022-06-10"), ...base },
    { title: "सुरक्षित मातृत्व तथा खोप सेवा निःशुल्क उपलब्ध सम्बन्धी सूचना", refNumber: "सूचना नं. ०७९/८०-१०", category: categoryMap.notice, publishedAt: new Date("2022-05-28"), ...base },
    { title: "परिवार नियोजन सेवा सञ्चालनसम्बन्धी सूचना",                refNumber: "सूचना नं. ०७९/८०-०९", category: categoryMap.notice,      publishedAt: new Date("2022-05-17"), ...base },
    // Tab: खरिद सूचना
    { title: "चिकित्सकीय उपकरण खरिदसम्बन्धी सूचना",  refNumber: "खरिद नं. ०४/०७९-८०", category: categoryMap.procurement, publishedAt: new Date("2022-06-13"), ...base },
    { title: "औषधि खरिदसम्बन्धी सूचना",               refNumber: "खरिद नं. ०३/०७९-८०", category: categoryMap.procurement, publishedAt: new Date("2022-06-04"), ...base },
    { title: "निर्माण कार्यसम्बन्धी सूचना",           refNumber: "खरिद नं. ०२/०७९-८०", category: categoryMap.procurement, publishedAt: new Date("2022-05-31"), ...base },
    { title: "दरभाउपत्र आह्वान सम्बन्धी सूचना",       refNumber: "खरिद नं. ०१/०७९-८०", category: categoryMap.procurement, publishedAt: new Date("2022-05-18"), ...base },
    // Tab: रिक्त पद / नतिजा
    { title: "हाल उपलब्ध रिक्त पदहरूको सूचना",                            refNumber: "रिक्त पद नं. ०३/०७९-८०", category: categoryMap.vacancy, publishedAt: new Date("2022-06-08"), ...base },
    { title: "स्टाफ नर्स पदपूर्तिसम्बन्धी आवेदन आह्वान",                  refNumber: "रिक्त पद नं. ०२/०७९-८०", category: categoryMap.vacancy, publishedAt: new Date("2022-05-25"), ...base },
    { title: "ल्याब टेक्निसियन करार सेवा भर्नाको नतिजा प्रकाशन",          refNumber: "नतिजा नं. ०१/०७९-८०",   category: categoryMap.vacancy, publishedAt: new Date("2022-05-15"), ...base },
  ];
}

async function seedNotices(
  categories: Array<{ _id: mongoose.Types.ObjectId; slug: string }>,
  adminId: mongoose.Types.ObjectId,
) {
  const existing = await Notice.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Notices already seeded (${existing} found), skipping.`);
    return;
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.slug, c._id]),
  ) as Record<string, mongoose.Types.ObjectId>;

  const docs = buildNoticeDocs(categoryMap, adminId);
  const result = await Notice.insertMany(docs);
  console.log(`Notices seeded: ${result.length}`);
}

// ─── Management members ───────────────────────────────────────────────────────

async function seedManagement(adminId: mongoose.Types.ObjectId) {
  const existing = await ManagementMember.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Management members already seeded (${existing} found), skipping.`);
    return;
  }

  const base = {
    createdBy: adminId, updatedBy: null, status: "published" as const,
    publishedAt: new Date("2022-06-15"), publishedBy: adminId, scheduledAt: null,
    deletedAt: null, deletedBy: null, photo: null,
  };

  const docs = [
    { nameNp: "सविता साप्कोटा",           post: "ज.स्वा.अ.",  role: "chief"   as const, order: 0, ...base },
    { nameNp: "श्री गोपालचन्द्र बुढाथोकी", post: "अध्यक्ष",   role: "president" as const, order: 0, ...base },
    { nameNp: "श्री मिना पोख्रेल उप्रेती", post: "उपाध्यक्ष", role: "vp"      as const, order: 0, ...base },
    { nameNp: "श्री सुवास श्रेष्ठ",         post: "सदस्य",    role: "member"  as const, order: 0, ...base },
    { nameNp: "श्री नारायण खनाल",           post: "सदस्य",    role: "member"  as const, order: 1, ...base },
    { nameNp: "श्री हृदय राजवंशी",          post: "सदस्य",    role: "member"  as const, order: 2, ...base },
    { nameNp: "श्री महेन्द्र बिलास लुइटेल", post: "सदस्य",    role: "member"  as const, order: 3, ...base },
    { nameNp: "श्री खेमराज प्रसाइ",         post: "सदस्य",    role: "member"  as const, order: 4, ...base },
    { nameNp: "श्री सविता साप्कोटा",        post: "सदस्य",    role: "member"  as const, order: 5, ...base },
    { nameNp: "श्री निर्मल कुमार दाहाल",    post: "सदस्य",    role: "member"  as const, order: 6, ...base },
    { nameNp: "श्री संगिता सिवाकोटी",       post: "सदस्य",    role: "member"  as const, order: 7, ...base },
    { nameNp: "डा. प्रकाशचन्द्र गच्छदार",   post: "सदस्य",    role: "member"  as const, order: 8, ...base },
  ];

  // insertMany skips the singleton pre-save hook; safe here since we have exactly one of each singleton role
  const result = await ManagementMember.insertMany(docs);
  console.log(`Management members seeded: ${result.length}`);
}

// ─── Download categories ──────────────────────────────────────────────────────

const DOWNLOAD_CATEGORIES = [
  { slug: "monthly-report",          labelNp: "मासिक प्रतिवेदन",            labelEn: "MONTHLY REPORT",           order: 0 },
  { slug: "quarterly-report",        labelNp: "त्रैमासिक प्रतिवेदन",        labelEn: "QUARTERLY REPORT",         order: 1 },
  { slug: "annual-report",           labelNp: "वार्षिक प्रतिवेदन",          labelEn: "ANNUAL REPORT",            order: 2 },
  { slug: "financial-report",        labelNp: "आर्थिक प्रतिवेदन",           labelEn: "FINANCIAL REPORT",         order: 3 },
  { slug: "health-statistics-report",labelNp: "स्वास्थ्य तथ्याङ्क प्रतिवेदन", labelEn: "HEALTH STATISTICS REPORT", order: 4 },
];

async function seedDownloadCategories(adminId: mongoose.Types.ObjectId) {
  const existing = await DownloadCategory.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Download categories already seeded (${existing} found), skipping.`);
    return;
  }
  const docs = DOWNLOAD_CATEGORIES.map((c) => ({ ...c, createdBy: adminId }));
  const result = await DownloadCategory.insertMany(docs);
  console.log(`Download categories seeded: ${result.length}`);
}

// ─── Services (categories + offers) ────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  { nameNp: "आकस्मिक सेवा",     nameEn: "Emergency",                badge: "EMERGENCY",     availability: "२४ घण्टा",   availabilityEn: "24 hours",  desc: "गम्भीर तथा आकस्मिक अवस्थाका बिरामीहरूका लागि सघन तथा द्रुत स्वास्थ्य सेवा।",       descEn: "Intensive and rapid healthcare service for patients in serious and emergency conditions.", inDepartments: true,  order: 0 },
  { nameNp: "बहिरंग सेवा",       nameEn: "Outpatient Department",   badge: "OPD",           availability: "बिहान ९:०० – साँझ ५:००", availabilityEn: "9:00 AM – 5:00 PM", desc: "सामान्य स्वास्थ्य समस्याका लागि दैनिक बहिरंग जाँच तथा परामर्श सेवा।",         descEn: "Daily outpatient check-up and consultation service for general health issues.",        inDepartments: true,  order: 1 },
  { nameNp: "भर्ना सेवा",        nameEn: "Inpatient Department",    badge: "IPD",           availability: "१५ शय्या",  availabilityEn: "15 beds",  desc: "नजिकबाट निरीक्षण तथा हेरचाह आवश्यक पर्ने बिरामीका लागि भर्ना सेवा।",                 descEn: "Admission service for patients requiring close observation and care.",              inDepartments: true,  order: 2 },
  { nameNp: "प्रयोगशाला सेवा",   nameEn: "Laboratory",              badge: "LABORATORY",    availability: "दैनिक सेवा", availabilityEn: "Daily service", desc: "रोग पहिचानका लागि आवश्यक प्रयोगशाला परीक्षणहरू।",                                  descEn: "Necessary laboratory tests for disease diagnosis.",                                   inDepartments: true,  order: 3 },
  { nameNp: "एक्स-रे सेवा",       nameEn: "X-Ray",                   badge: "X-RAY",         availability: "२४ घण्टा",   availabilityEn: "24 hours",  desc: "हड्डी तथा छाती सम्बन्धी समस्याको पहिचानका लागि एक्स-रे सेवा।",                        descEn: "X-ray service for diagnosing bone and chest-related issues.",                        inDepartments: true,  order: 4 },
  { nameNp: "अल्ट्रासाउन्ड",     nameEn: "Ultrasound",              badge: "USG",           availability: "बिहान ९ – दिउँसो २", availabilityEn: "9 AM – 2 PM", desc: "गर्भावस्था तथा पेट सम्बन्धी जाँचका लागि USG सेवा।",                                     descEn: "USG service for pregnancy and abdominal examinations.",                                inDepartments: true,  order: 5 },
  { nameNp: "ECG सेवा",           nameEn: "ECG",                     badge: "ECG",           availability: "२४ घण्टा",   availabilityEn: "24 hours",  desc: "मुटुको चाल पहिचान गर्नका लागि ECG परीक्षण सेवा।",                                     descEn: "ECG test service for identifying heart rhythm.",                                       inDepartments: true,  order: 6 },
  { nameNp: "फार्मेसी",           nameEn: "Pharmacy",                badge: "PHARMACY",      availability: "२४ घण्टा",   availabilityEn: "24 hours",  desc: "सुलभ मूल्यमा आवश्यक औषधि उपलब्ध गराउने सेवा।",                                        descEn: "Service providing necessary medicines at affordable prices.",                        inDepartments: true,  order: 7 },
  { nameNp: "निःशुल्क सेवाहरू",   nameEn: "Free Services",           badge: "FREE SERVICES", availability: null,          availabilityEn: null,        desc: "सुरक्षित मातृत्व, खोप तथा परिवार नियोजन सेवा निःशुल्क उपलब्ध।",                          descEn: "Safe motherhood, vaccination and family planning services available free of cost.", inDepartments: false, order: 8 },
];

const SERVICE_OFFERS: Record<string, Array<{ titleNp: string; titleEn: string }>> = {
  "Emergency":   [{ titleNp: "प्राथमिक उपचार", titleEn: "First aid" }, { titleNp: "आकस्मिक व्यवस्थापन", titleEn: "Emergency management" }, { titleNp: "रेफरल सेवा", titleEn: "Referral service" }],
  "Outpatient Department": [{ titleNp: "सामान्य जाँच", titleEn: "General check-up" }, { titleNp: "परामर्श", titleEn: "Consultation" }, { titleNp: "औषधि सिफारिस", titleEn: "Medicine recommendation" }],
  "Inpatient Department":  [{ titleNp: "शय्या व्यवस्था", titleEn: "Bed arrangement" }, { titleNp: "नियमित अनुगमन", titleEn: "Regular monitoring" }, { titleNp: "नर्सिङ् हेरचाह", titleEn: "Nursing care" }],
  "Laboratory":  [{ titleNp: "रक्त परीक्षण", titleEn: "Blood test" }, { titleNp: "पिसाब परीक्षण", titleEn: "Urine test" }, { titleNp: "दिसा परीक्षण", titleEn: "Stool test" }, { titleNp: "अन्य आवश्यक परीक्षण", titleEn: "Other necessary tests" }],
  "X-Ray":       [{ titleNp: "डिजिटल एक्स-रे", titleEn: "Digital X-ray" }],
  "Ultrasound":  [{ titleNp: "गर्भावस्था जाँच", titleEn: "Pregnancy check-up" }, { titleNp: "उदर परीक्षण", titleEn: "Abdominal examination" }],
  "ECG":         [{ titleNp: "मुटु परीक्षण", titleEn: "Cardiac test" }],
  "Pharmacy":    [{ titleNp: "औषधि वितरण", titleEn: "Medicine distribution" }, { titleNp: "परामर्श", titleEn: "Consultation" }],
  "Free Services": [],
};

async function seedServiceCategories(adminId: mongoose.Types.ObjectId) {
  const existing = await ServiceCategory.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Service categories already seeded (${existing} found), skipping.`);
    return;
  }

  const docs = SERVICE_CATEGORIES.map((c) => ({
    ...c,
    createdBy: adminId, updatedBy: null, status: "published" as const,
    publishedBy: adminId, scheduledAt: null, deletedAt: null, deletedBy: null,
  }));
  const result = await ServiceCategory.insertMany(docs);
  console.log(`Service categories seeded: ${result.length}`);
  return result;
}

async function seedServices(
  categories: Array<{ _id: mongoose.Types.ObjectId; nameEn: string }>,
  adminId: mongoose.Types.ObjectId,
) {
  const existing = await Service.countDocuments({ deletedAt: null });
  if (existing > 0) {
    console.log(`Services already seeded (${existing} found), skipping.`);
    return;
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.nameEn, c._id]),
  ) as Record<string, mongoose.Types.ObjectId>;

  const docs = Object.entries(SERVICE_OFFERS).flatMap(([nameEn, offers]) =>
    offers.map((o, idx) => ({
      titleNp: o.titleNp, titleEn: o.titleEn, category: categoryMap[nameEn],
      order: idx,
      createdBy: adminId, updatedBy: null, status: "published" as const,
      publishedBy: adminId, scheduledAt: null, deletedAt: null, deletedBy: null,
    }))
  );

  const result = await Service.insertMany(docs);
  console.log(`Services seeded: ${result.length}`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const seedData = async () => {
  try {
    await connectDB();

    const adminId = await ensureAdmin();
    const staffCategories = await seedStaffCategories(adminId);
    await seedStaff(staffCategories as Array<{ _id: mongoose.Types.ObjectId; slug: string }>, adminId);
    const noticeCategories = await seedNoticeCategories(adminId);
    await seedNotices(noticeCategories as Array<{ _id: mongoose.Types.ObjectId; slug: string }>, adminId);
    await seedManagement(adminId);
    await seedDownloadCategories(adminId);
    const serviceCategories = await seedServiceCategories(adminId);
    await seedServices(serviceCategories as Array<{ _id: mongoose.Types.ObjectId; nameEn: string }>, adminId);

    console.log("Seed complete.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
