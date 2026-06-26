import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { DownloadCategory, Download } from "@/lib/db/models";

export const revalidate = 3600;

export async function GET() {
  await connectDB();

  const categories = await DownloadCategory.find({ deletedAt: null })
    .sort({ order: 1 })
    .select("slug labelNp labelEn order")
    .lean();

  const downloads = await Download.find({ deletedAt: null, status: "published" })
    .sort({ createdAt: -1 })
    .select("titleNp titleEn category file fiscalYear")
    .lean();

  const grouped = categories.map((cat) => ({
    slug: cat.slug,
    labelNp: cat.labelNp,
    labelEn: cat.labelEn,
    downloads: downloads
      .filter((d) => d.category.toString() === cat._id.toString())
      .map((d) => ({
        id: d._id.toString(),
        titleNp: d.titleNp,
        titleEn: d.titleEn,
        fiscalYear: d.fiscalYear,
        fileUrl: d.file.url,
        fileFormat: d.file.format,
      })),
  }));

  return NextResponse.json({ categories: grouped });
}
