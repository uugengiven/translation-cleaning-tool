// app/api/getSection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/data/models';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return NextResponse.json({ error: 'Missing bookId parameter' }, { status: 400 });
  }

  const book = await Book.findByPk(bookId);

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const plainData:Book= {...book.get({ plain: true })};

  return NextResponse.json(plainData);
}