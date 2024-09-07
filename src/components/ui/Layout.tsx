import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        {/* Add your header content here */}
      </header>
      <main className="container mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white">
        {/* Add your footer content here */}
      </footer>
    </div>
  );
}
