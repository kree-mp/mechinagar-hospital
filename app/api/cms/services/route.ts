import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Service, ServiceCategory } from '@/lib/db/models';
import { requireCmsAuth } from '@/lib/auth/requireCmsAuth';
import { revalidatePublic } from '@/lib/cache';
import { serviceSchema } from '@/lib/validations/cms';

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const categoryId = req.nextUrl.searchParams.get('category');
  await connectDB();

  const filter = categoryId ? { category: categoryId } : {};
  const services = await Service.find(filter).sort({ order: 1, createdAt: 1 }).lean();

  return NextResponse.json({
    services: services.map((s) => ({
      ...s,
      _id: s._id.toString(),
      category: s.category.toString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const service = await Service.create({ ...parsed.data, createdBy: auth.session.sub });

  revalidatePublic('services');
  return NextResponse.json({ service }, { status: 201 });
}