import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import QuickAddModal from '@/components/common/QuickAddModal';

export default function MainLayout() {
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <a
                href="#main-content"
                className="sr-only absolute left-4 top-4 z-[100] rounded-xl bg-slate-900 px-4 py-2 font-bold text-white focus:not-sr-only"
            >
                Saltar al contenido principal
            </a>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onQuickAdd={() => setQuickAddOpen(true)} />
                <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
        </div>
    );
}
