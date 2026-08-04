import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { ServiceCategory, Service } from '@/lib/db/models';

export const revalidate = 1800;

export async function GET() {
  await connectDB();

  const [categories, services] = await Promise.all([
    ServiceCategory.find({ deletedAt: null, status: 'published' })
      .sort({ order: 1, createdAt: 1 })
      .select('nameNp nameEn badge availability availabilityEn desc descEn inDepartments order')
      .lean(),
    Service.find({ deletedAt: null, status: 'published' })
      .sort({ order: 1, createdAt: 1 })
      .select('titleNp titleEn category order')
      .lean(),
  ]);

  const serviceMap = services.reduce<Record<string, Array<{ id: string; titleNp: string; titleEn: string; order: number }>>>(
    (acc, s) => {
      const catId = s.category.toString();
      (acc[catId] ??= []).push({ id: s._id.toString(), titleNp: s.titleNp, titleEn: s.titleEn, order: s.order });
      return acc;
    },
    {}
  );

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c._id.toString(),
      nameNp: c.nameNp,
      nameEn: c.nameEn,
      badge: c.badge,
      availability: c.availability,
      availabilityEn: c.availabilityEn,
      desc: c.desc,
      descEn: c.descEn,
      inDepartments: c.inDepartments,
      order: c.order,
      services: serviceMap[c._id.toString()] ?? [],
    })),
  });
}