import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import QuickAddModal from '@/components/common/QuickAddModal';

export default function MainLayout() {
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onQuickAdd={() => setQuickAddOpen(true)} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
            <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
        </div>
    );
}
