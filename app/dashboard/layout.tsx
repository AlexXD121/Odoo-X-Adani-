import React from 'react';
import { Navbar } from '@/components/ui/navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans">
            <Navbar />
            <main className="container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
