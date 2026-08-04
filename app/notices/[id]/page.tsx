import { notFound } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db/connection';
import { Notice, NoticeCategory } from '@/lib/db/models';
import { formatBsDay, formatBsMonth } from '@/lib/utils/dateNp';

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const n = await Notice.findOne({ _id: id, deletedAt: null, status: 'published' })
    .select('title')
    .lean();
  return { title: n ? `${n.title} — सूचना` : 'सूचना' };
}

export default async function NoticePage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  const n = await Notice.findOne({ _id: id, deletedAt: null, status: 'published' })
    .select('title refNumber body category publishedAt createdAt file')
    .lean({ virtuals: false });

  if (!n) notFound();

  const category = await NoticeCategory.findById(n.category).select('labelNp').lean();
  const date = n.publishedAt ?? n.createdAt;
  const day = date ? formatBsDay(date) : '–';
  const mon = date ? formatBsMonth(date) : '–';

  return (
    <>
      <TopBar />
      <Masthead />
      <Navbar />

      <div className="mx-auto max-w-[860px] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Link
          href="/#notices"
          className="font-np mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3282B8] hover:text-[#0F4C75]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          सूचना सूचीमा फर्कनुहोस्
        </Link>

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="w-[58px] flex-none rounded-[5px] bg-[#f0f2f5] py-3 text-center">
              <div className="text-[22px] font-extrabold leading-none tabular-nums text-[#3282B8]">{day}</div>
              <div className="font-np mt-1 text-[11px] text-[#7a818b]">{mon}</div>
            </div>
            <div className="flex-1">
              {category?.labelNp && (
                <div className="font-np mb-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#D24B45]">
                  {category.labelNp}
                </div>
              )}
              <h1 className="font-np text-[20px] font-extrabold leading-snug text-[#1B262C] sm:text-[24px]">
                {n.title}
              </h1>
              {n.refNumber && (
                <p className="mt-1.5 text-[12px] text-[#98a0aa]">{n.refNumber}</p>
              )}
            </div>
          </div>

          {n.body ? (
            <div className="mt-7 border-t border-[#eef0f3] pt-6">
              <p className="font-np whitespace-pre-line text-[15px] leading-relaxed text-[#3d4754]">
                {n.body}
              </p>
            </div>
          ) : (
            <div className="mt-7 border-t border-[#eef0f3] pt-6">
              <p className="font-np text-[14px] text-[#98a0aa]">थप विवरण उपलब्ध छैन।</p>
            </div>
          )}

          {n.file?.url && (
            <div className="mt-7 border-t border-[#eef0f3] pt-6">
              <div className="overflow-hidden rounded-md border border-[#e4e7ec] bg-[#f0f2f5]">
                {n.file.format === 'pdf' ? (
                  <iframe
                    src={n.file.url}
                    title={n.title}
                    className="h-[75vh] w-full min-h-[480px]"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.file.url}
                    alt={n.title}
                    className="h-auto w-full object-contain"
                  />
                )}
              </div>
              <a
                href={n.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-np mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F4C75] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#0d3f62]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                संलग्न फाइल डाउनलोड गर्नुहोस्
              </a>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
