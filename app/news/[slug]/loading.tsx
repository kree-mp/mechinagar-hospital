import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Navbar />

      <div className="mx-auto max-w-[860px] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-8 h-4 w-40 animate-pulse rounded bg-[#e4e7ec]" />

        <div className="overflow-hidden rounded-xl border border-[#e4e7ec] bg-white">
          <div className="aspect-[16/8] w-full animate-pulse bg-[#e4e7ec]" />
          <div className="space-y-4 p-6 sm:p-8">
            <div className="h-3 w-28 animate-pulse rounded bg-[#e4e7ec]" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-[#e4e7ec]" />
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full animate-pulse rounded bg-[#e4e7ec]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#e4e7ec]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#e4e7ec]" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
