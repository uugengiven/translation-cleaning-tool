// app/book/[bookId]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookForm } from '@/data/models';

type EditPageProps = {
  params: {
    bookId: string;
  };
};

const EditPage: React.FC<EditPageProps> = ({ params }) => {
  const [book, setBook] = useState<BookForm | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`/api/books/${params.bookId}`);
      const bookData = await response.json();
      setBook(bookData);
    };

    fetchBook();
  }, [params.bookId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!book) return;

    const response = await fetch(`/api/books/${params.bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });

    if (response.ok) {
      console.log('Book updated successfully');
      router.push(`/book/${params.bookId}`);
    } else {
      console.error('Book update failed');
      // Handle book update error
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bookTitle" className="block mb-2 font-bold">Book Title:</label>
            <input
              type="text"
              id="bookTitle"
              placeholder="Enter book title"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bookAuthor" className="block mb-2 font-bold">Book Author:</label>
            <input
              type="text"
              id="bookAuthor"
              placeholder="Enter book author"
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bookDescription" className="block mb-2 font-bold">Book Description:</label>
            <textarea
              id="bookDescription"
              placeholder="Enter book description"
              value={book.description}
              onChange={(e) => setBook({ ...book, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="bookInfo" className="block mb-2 font-bold">Book Info:</label>
            <textarea
              id="bookInfo"
              placeholder="Enter additional book info"
              value={book.info}
              onChange={(e) => setBook({ ...book, info: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;