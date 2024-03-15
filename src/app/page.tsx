// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/data/models';

const HomePage: React.FC = async () => {
  const books = await Book.findAll();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="relative">
        <Image
          src="/images/hero.webp"
          alt="Hero Image"
          width={1200}
          height={400}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold text-white">AI Powered Translation and Writing Cleaner</h1>
        </div>
      </div>

      {/* Book Cards */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src="/images/book.webp"
                  alt="Book Image"
                  width={200}
                  height={300}
                  className="w-full h-48 object-cover mb-4"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna
          tincidunt enim, eget ultricies magna augue eget sapien. Vestibulum ante ipsum primis in faucibus orci luctus
          et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.
        </p>
      </div>

      {/* Built With Claude AI */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Built With Claude AI</h2>
        <p className="text-gray-700">
          This site was built using Claude AI, an advanced artificial intelligence system. Claude AI powered the
          translation cleaning process and assisted in the development of this application.
        </p>
      </div>
    </div>
  );
};

export default HomePage;