import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">About This Project</h1>
      <p className="text-xl text-gray-600 mb-6">This page serves as a link destination.</p>
      <Link href="/" className="text-blue-600 hover:underline">
         &larr; Go back to the To-Do List
      </Link>
    </div>
  );
}