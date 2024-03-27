// app/api/saveTranslation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FixedTranslation } from '@/data/models';

export async function POST(request: NextRequest) {
  const isEditable = process.env.NEXT_PUBLIC_ALLOW_EDIT === 'true';
  if(!isEditable) {
    return NextResponse.json({ error: 'Editing is disabled' }, { status: 403 });
  }
  const { sectionId, translation } = await request.json();

  try {
    // Find the existing fixed translation for the given section
    const existingTranslation = await FixedTranslation.findOne({
      where: {
        bookSectionId: sectionId,
        active: true,
      },
    });

    if (existingTranslation) {
      // Update the existing translation
      await existingTranslation.update({
        content: translation,
      });
    } else {
      // Create a new fixed translation
      await FixedTranslation.create({
        bookSectionId: sectionId,
        content: translation,
        active: true,
      });
    }

    return NextResponse.json({ message: 'Translation saved successfully' });
  } catch (error) {
    console.error('Error saving translation:', error);
    return NextResponse.json({ error: 'Failed to save translation' }, { status: 500 });
  }
}