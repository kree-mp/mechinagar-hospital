import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db/connection';
import { NewsEvent } from '@/lib/db/models';
import { formatBsDay, formatBsMonth } from '@/lib/utils/dateNp';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const n = await NewsEvent.findOne({ slug, deletedAt: null, status: 'published' })
    .select('title seoTitle')
    .lean();
  if (!n) return { title: 'समाचार तथा गतिविधि' };
  return { title: `${n.seoTitle || n.title} — समाचार तथा गतिविधि` };
}

export default async function NewsEventPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const n = await NewsEvent.findOne({ slug, deletedAt: null, status: 'published' })
    .select('title excerpt body coverImage label isEvent eventDate publishedAt createdAt')
    .lean({ virtuals: false });

  if (!n) notFound();

  const date = n.eventDate ?? n.publishedAt ?? n.createdAt;
  const label = n.label || (n.isEvent ? 'कार्यक्रम' : 'समाचार');

  return (
    <>
      <TopBar />
      <Masthead />
      <Navbar />

      <div className="mx-auto max-w-[860px] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Link
          href="/#news"
          className="font-np mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3282B8] hover:text-[#0F4C75]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          समाचार सूचीमा फर्कनुहोस्
        </Link>

        <article className="overflow-hidden rounded-xl border border-[#e4e7ec] bg-white">
          {n.coverImage?.url && (
            <div className="relative aspect-[16/8] w-full bg-[#f0f2f5]">
              <Image
                src={n.coverImage.url}
                alt={n.title}
                fill
                priority
                sizes="(max-width: 860px) 100vw, 860px"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="font-np mb-2.5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[2px] text-[#D24B45]">
              <span>{label}</span>
              {date && (
                <span className="text-[#98a0aa]">
                  {formatBsDay(date)} {formatBsMonth(date)}
                </span>
              )}
            </div>

            <h1 className="font-np text-[20px] font-extrabold leading-snug text-[#1B262C] sm:text-[26px]">
              {n.title}
            </h1>

            {n.excerpt && (
              <p className="font-np mt-3 text-[15px] leading-relaxed text-[#5b6168]">
                {n.excerpt}
              </p>
            )}

            <div className="mt-6 border-t border-[#eef0f3] pt-6">
              {n.body ? (
                <p className="font-np whitespace-pre-line text-[15px] leading-relaxed text-[#3d4754]">
                  {n.body}
                </p>
              ) : (
                <p className="font-np text-[14px] text-[#98a0aa]">थप विवरण उपलब्ध छैन।</p>
              )}
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </>
  );
}
