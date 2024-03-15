// app/upload/page.tsx
'use client';

import React, { useState } from 'react';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sectionBreakPatterns, setSectionBreakPatterns] = useState<string>('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookInfo, setBookInfo] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  
  const handleSectionBreakPatternsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSectionBreakPatterns(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sectionBreakPatterns', sectionBreakPatterns);
    formData.append('bookTitle', bookTitle);
    formData.append('bookAuthor', bookAuthor);
    formData.append('bookDescription', bookDescription);
    formData.append('bookInfo', bookInfo);

    const response = await fetch('/api/uploadText', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      // Handle successful file upload
    } else {
      console.error('File upload failed');
      // Handle file upload error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Upload Book Text</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2 font-bold">Book File:</label>
            <input
              type="file"
              id="file"
              accept=".txt"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sectionBreakPatterns" className="block mb-2 font-bold">Section Break Patterns:</label>
            <input
              type="text"
              id="sectionBreakPatterns"
              placeholder="Enter section break patterns (comma-separated)"
              value={sectionBreakPatterns}
              onChange={handleSectionBreakPatternsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bookTitle" className="block mb-2 font-bold">Book Title:</label>
            <input
              type="text"
              id="bookTitle"
              placeholder="Enter book title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bookAuthor" className="block mb-2 font-bold">Book Author:</label>
            <input
              type="text"
              id="bookAuthor"
              placeholder="Enter book author"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bookDescription" className="block mb-2 font-bold">Book Description:</label>
            <textarea
              id="bookDescription"
              placeholder="Enter book description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="bookInfo" className="block mb-2 font-bold">Book Info:</label>
            <textarea
              id="bookInfo"
              placeholder="Enter additional book info"
              value={bookInfo}
              onChange={(e) => setBookInfo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </form>
      </div>
    </div>  
  );
};

export default UploadPage;