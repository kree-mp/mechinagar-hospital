import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickAccess from "@/components/QuickAccess";
import PramukhMessages from "@/components/PramukhMessages";
import About from "@/components/About";
import Statistics from "@/components/Statistics";
import Services from "@/components/Services";
import Departments from "@/components/Departments";
import Doctors from "@/components/Doctors";
import ManagementCommittee from "@/components/ManagementCommittee";
import NoticeBoard from "@/components/NoticeBoard";
import ReportsPublications from "@/components/ReportsPublications";
import NewsEvents from "@/components/NewsEvents";
import PatientInfo from "@/components/PatientInfo";
import Gallery from "@/components/Gallery";
import CtaBand from "@/components/CtaBand";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Navbar />
      <Hero />
      <QuickAccess />
      <Suspense fallback={<div className="h-[480px] animate-pulse bg-[#f6f7f9]" />}>
        <PramukhMessages />
      </Suspense>
      <About />
      <Statistics />
      <Services />
      <Departments />
      <Doctors />
      <Suspense fallback={<div className="h-[420px] animate-pulse bg-[#f6f7f9]" />}>
        <ManagementCommittee />
      </Suspense>
      <NoticeBoard />
      <ReportsPublications />
      <NewsEvents />
      <PatientInfo />
      <Gallery />
      <CtaBand />
      <Contact />
      <Footer />
    </>
  );
}
