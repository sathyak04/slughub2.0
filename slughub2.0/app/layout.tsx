import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import ThemeSwitcher from './components/ThemeSwitcher'; // New: Import ThemeSwitcher

// Update Metadata
export const metadata: Metadata = {
    title: 'My Simple To-Do App with Next.js',
    description: 'A simple, fast, and responsive To-Do List application built with Next.js and Tailwind CSS with light/dark mode.',
    keywords: ['To-Do List', 'Next.js', 'React', 'Dark Mode'],
    // ... (rest of your metadata)
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // suppressHydrationWarning is needed when manipulating the HTML class on the client
        <html lang="en" suppressHydrationWarning> 
            <body className={`antialiased bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>

                {/* Navigation with ONLY the Theme Switcher */}
                <nav className="p-4 bg-gray-800 text-white shadow-lg flex justify-end items-center px-8"> 
                    {/* The "justify-end" class moves all content (the button) to the far right. */}
                    
                    {/* The Div containing links has been removed */}
                    
                    <ThemeSwitcher /> {/* Theme Toggle Button */}
                </nav>

                <main className="p-4 max-w-7xl mx-auto"> 
                    {children}
                </main>
            </body>
        </html>
    );
}