// app/api/uploadText/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Book, BookSection } from '@/data/models';

const segmentText = (text: string, sectionBreakPatterns: string[]): string[] => {
  let blocks:string[] = [text];
  if(sectionBreakPatterns.length > 0)
  {
    const pageBreakRegex = new RegExp(`(${sectionBreakPatterns.join('|')})`, 'g');
    const blocks = text.split(pageBreakRegex);
  }
  const outputBlocks: string[] = [];

  for (const block of blocks) {
    const wordCount = getWordCount(block);

    if (wordCount <= 800) {
      outputBlocks.push(block.trim());
    } else {
      const smallerBlocks = splitBlock(block);
      outputBlocks.push(...smallerBlocks);
    }
  }

  return outputBlocks;
};

const splitBlock = (block: string): string[] => {
  const lines = block.split('\n');
  const outputBlocks: string[] = [];
  let currentBlock = '';

  for (const line of lines) {
    const currentBlockWordCount = getWordCount(currentBlock);
    const lineWordCount = getWordCount(line);

    if (currentBlockWordCount + lineWordCount <= 800) {
      currentBlock += line + '\n';
    } else {
      if (currentBlockWordCount > 700) {
        outputBlocks.push(currentBlock.trim());
        currentBlock = line + '\n';
      } else {
        currentBlock += line + '\n';
        outputBlocks.push(currentBlock.trim());
        currentBlock = '';
      }
    }
  }

  if (getWordCount(currentBlock) > 300) {
    outputBlocks.push(currentBlock.trim());
  }
  else
  {
    outputBlocks[outputBlocks.length - 1] += currentBlock.trim() + '\n';
  }

  return outputBlocks;
};

const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

export async function POST(request: NextRequest) {
  const isEditable = process.env.NEXT_PUBLIC_ALLOW_EDIT === 'true';
  if(!isEditable) {
    return NextResponse.json({ error: 'Editing is disabled' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const sectionBreakPatterns = formData.get('sectionBreakPatterns')?.toString().split(',') || [];
  const bookTitle = formData.get('bookTitle')?.toString() || '';
  const bookAuthor = formData.get('bookAuthor')?.toString() || '';
  const bookDescription = formData.get('bookDescription')?.toString() || '';
  const bookInfo = formData.get('bookInfo')?.toString() || '';

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const fileContent = await file.text();
 
  const segments=segmentText(fileContent, sectionBreakPatterns);

  // Create a new book record
  const book = await Book.create({
    title: bookTitle,
    author: bookAuthor,
    description: bookDescription,
    info: bookInfo,
  });

  // Create book sections and associate them with the book
  segments.forEach(async (segment, index) => {
    await BookSection.create({
      bookId: book.id,
      sectionNumber: index + 1,
      content: segment,
    });
  });

  return NextResponse.json({ message: 'File uploaded and book created successfully', bookId: book.id }, {
    status: 200,
    headers: {
      'Location': `/book/${book.id}`,
    },
  });

}