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
        <div className="mb-8 h-4 w-44 animate-pulse rounded bg-[#e4e7ec]" />

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="h-[68px] w-[58px] flex-none animate-pulse rounded-[5px] bg-[#e4e7ec]" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-[#e4e7ec]" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-[#e4e7ec]" />
              <div className="h-3 w-32 animate-pulse rounded bg-[#e4e7ec]" />
            </div>
          </div>
          <div className="mt-7 space-y-2 border-t border-[#eef0f3] pt-6">
            <div className="h-4 w-full animate-pulse rounded bg-[#e4e7ec]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#e4e7ec]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[#e4e7ec]" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
