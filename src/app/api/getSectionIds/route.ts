// app/api/getSectionIds/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookSection } from '@/data/models';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return NextResponse.json({ error: 'Missing bookId parameter' }, { status: 400 });
  }

  const sections = await BookSection.findAll({
    where: {
      bookId: bookId,
    },
    attributes: ['id'],
    order: [['sectionNumber', 'ASC']],
  });

  const sectionIds = sections.map((section) => section.id);

  return NextResponse.json(sectionIds);
}