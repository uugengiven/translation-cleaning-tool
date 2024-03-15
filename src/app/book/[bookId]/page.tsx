// app/book/[bookId]/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { BookSection, FixedTranslation, Book } from '@/data/models';

type BookPageProps = {
  params: {
    bookId: string;
  };
};

type BookPageBook = {
  id: number;
  title: string;
  author: string;
  description: string;
  info: string;
};

const BookPage: React.FC<BookPageProps> = ({ params }) => {
    const [sectionIds, setSectionIds] = useState<Number[]>([]);
    const [currentSection, setCurrentSection] = useState<number | null>(null);
    const [book, setBook] = useState<Book | BookPageBook>({
      id: 0,
      title: 'Book Title',
      author: 'Book Author',
      description: 'Book Description',
      info: 'Book Info',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [allSections, setAllSections] = useState<(BookSection & { fixedTranslation: FixedTranslation | null })[]>([]);
    const [isFixingTranslation, setIsFixingTranslation] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
    useEffect(() => {
      const fetchSectionIds = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/getSectionIds?bookId=${params.bookId}`);
        const ids = await response.json();
        setSectionIds(ids);
        setIsLoading(false);
      };
  
      const fetchBook = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/Book?bookId=${params.bookId}`);
        const bookData = await response.json();
        setBook(bookData);
        setIsLoading(false);
      };
  
      fetchBook();
      fetchSectionIds();
    }, [params.bookId]);
  
    const loadSection = async (sectionId: Number) => {
      const response = await fetch(`/api/getSection?sectionId=${sectionId}`);
      const sectionData:(BookSection & { fixedTranslation: FixedTranslation | null }) = await response.json();
      if(!allSections.some((section) => section.id === sectionData.id)){
        setAllSections([...allSections, sectionData]);
      }
    };
  
    const getVisibleSections = () => {
      if (currentSection === null) return [];
  
      const visibleSections = [allSections[currentSection]] ? [allSections[currentSection]] : [];
      if (currentSection > 0) {
        visibleSections.unshift(allSections[currentSection - 1]);
      }
      if (currentSection < allSections.length - 1) {
        visibleSections.push(allSections[currentSection + 1]);
      }
      return visibleSections.filter((section) => section);
    };
  
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollBuffer = 100;
  
      sectionRefs.current.forEach((sectionRef, index) => {
        if (sectionRef) {
          const sectionTop = sectionRef.offsetTop;
          const sectionBottom = sectionTop + sectionRef.offsetHeight;
  
          if (scrollTop >= sectionTop - scrollBuffer && scrollTop <= sectionBottom - scrollBuffer) {
            setCurrentSection(index);
          }
        }
      });
    };
  
    useEffect(() => {
      if (sectionIds.length > 0) {
        loadSection(sectionIds[0]);
        setCurrentSection(0);
      }
    }, [sectionIds]);
  
    useEffect(() => {
      if (currentSection !== null) {
        const prevSectionId = sectionIds[currentSection - 1];
        const nextSectionId = sectionIds[currentSection + 1];
  
        if (prevSectionId && !allSections.some((section) => section.id === prevSectionId)) {
          loadSection(prevSectionId);
        }
        if (nextSectionId && !allSections.some((section) => section.id === nextSectionId)) {
          loadSection(nextSectionId);
        }
      }
    }, [currentSection, sectionIds, allSections]);
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    const handleFixTranslation = async (sectionId: string) => {
      setIsFixingTranslation({ ...isFixingTranslation, [sectionId]: true });
      await fetch(`/api/fixTranslation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      });
      const sectionResponse = await fetch(`/api/getSection?sectionId=${sectionId}`);
      const sectionData = await sectionResponse.json();
      setAllSections(allSections.map((section) => (section.id === sectionData.id ? sectionData : section)));
      setIsFixingTranslation((prevState) => ({ ...prevState, [sectionId]: false }));
    };
  
    const convertToParagraphs = (text: string) => {
      return text.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ));
    };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : (
        <>
          <div className="sticky top-0 bg-white py-4 px-6 shadow-md z-10 flex justify-around">
            <h1 className="text-4xl font-bold">{book.title}</h1>
            <h2 className="text-2xl">
              <span className="text-xl">by</span> {book.author}
            </h2>
            {currentSection !== null && (
              <p className="text-xl">Current Section: {allSections[currentSection]?.sectionNumber}</p>
            )}
          </div>
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {getVisibleSections().map((section, index) => (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.sectionNumber - 1] = el)}
                className={`flex flex-col mb-8 p-6 rounded-lg shadow-md ${
                  index % 2 === 0 ? 'bg-gradient-to-r from-gray-100 to-gray-200' : 'bg-gradient-to-l from-gray-100 to-gray-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Section {section.sectionNumber}</h2>
                    <button
                      className={`flex items-center px-4 py-2 rounded-md ${
                        isFixingTranslation[section.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                      } text-gray-600`}
                      onClick={() => handleFixTranslation(String(section.id))}
                      disabled={isFixingTranslation[section.id]}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 mr-2">
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 336c-23.1 0-41 11.1-46.3 14.8c-1.1 .8-2.4 1.2-3.7 1.2c-3.3 0-5.9-2.7-5.9-5.9V185.3c0-5.8 3.1-11.1 8.3-13.5c10.4-4.7 29.1-11.9 47.7-11.9s37.2 7.1 47.7 11.9c5.2 2.4 8.3 7.7 8.3 13.5V346.1c0 3.3-2.7 5.9-5.9 5.9c-1.3 0-2.6-.4-3.7-1.2C225 347.1 207.1 336 184 336zm144 0c-23.1 0-41 11.1-46.3 14.8c-1.1 .8-2.4 1.2-3.7 1.2c-3.3 0-5.9-2.7-5.9-5.9V185.3c0-5.8 3.1-11.1 8.3-13.5c10.4-4.7 29.1-11.9 47.7-11.9s37.2 7.1 47.7 11.9c5.2 2.4 8.3 7.7 8.3 13.5V346.1c0 3.3-2.7 5.9-5.9 5.9c-1.3 0-2.6-.4-3.7-1.2C369 347.1 351.1 336 328 336z" />
                      </svg>
                      <span>Generate Rewrite</span>
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/2 mb-4 md:mb-0 md:mr-8">
                    <h3 className="text-xl font-bold mb-4">Original Text</h3>
                    <div className="text-gray-700">{convertToParagraphs(section.content)}</div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold mb-4">Fixed Translation</h3>
                    <div className="text-gray-700">
                      {convertToParagraphs(String(section.fixedTranslation) || 'Translation not available')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookPage;