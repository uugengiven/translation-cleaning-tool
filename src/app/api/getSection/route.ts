// app/api/getSection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookSection, FixedTranslation } from '@/data/models';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get('sectionId');

  if (!sectionId) {
    return NextResponse.json({ error: 'Missing sectionId parameter' }, { status: 400 });
  }

  const section = await BookSection.findByPk(sectionId, {
    include: [FixedTranslation],
  });

  if (!section) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  const plainData:BookSection & {FixedTranslations:FixedTranslation[]}= {...section.get({ plain: true })};

  const sectionData = {
    ...plainData,
    fixedTranslation: plainData.FixedTranslations?.find((translation) => {
        return translation.active;
    })?.content || null,
  };

  return NextResponse.json(sectionData);
}