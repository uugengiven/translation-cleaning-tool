// app/api/getSection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/data/models';

export async function GET(request: NextRequest, { params }: { params: { bookId: number } }) {
  const bookId = params.bookId;

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

export async function PUT(request: NextRequest, { params }: { params: { bookId: number } }) {
    const bookId = params.bookId;
    const bookData = await request.json();
  
    try {
      const book = await Book.findByPk(bookId);
  
      if (!book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
  
      await book.update(bookData);
  
      return NextResponse.json({ message: 'Book updated successfully', book });
    } catch (error) {
      console.error('Error updating book:', error);
      return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
  }