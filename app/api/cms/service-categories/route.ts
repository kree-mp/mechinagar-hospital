import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { ServiceCategory, Service } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { serviceCategorySchema } from '@/lib/validations/cms';

export async function GET() {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  await connectDB();

  const [categories, counts] = await Promise.all([
    ServiceCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
    Service.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = Object.fromEntries(counts.map((c: { _id: string; count: number }) => [c._id.toString(), c.count]));

  return NextResponse.json({
    categories: categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      serviceCount: countMap[cat._id.toString()] ?? 0,
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = serviceCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const category = await ServiceCategory.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('services');
  return NextResponse.json({ category }, { status: 201 });
}