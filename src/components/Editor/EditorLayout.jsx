import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  ChevronRight,
  RotateCcw,
  Undo,
  Redo,
  Sparkles,
  Layers,
  Sliders,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';

const EditorLayout = ({
  children,
  activeTab,
  setActiveTab,
  onDownload,
  onReset,
  onBack,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const tabs = [
    { id: 'filters', icon: <Layers size={20} />, label: 'الفلاتر' },
    { id: 'adjust', icon: <Sliders size={20} />, label: 'تعديل يدوي' },
    { id: 'ai', icon: <Wand2 size={20} />, label: 'ذكاء اصطناعي' }
  ];

  return (
    <div className="h-screen bg-brand-dark flex flex-col text-white overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-4 bg-brand-surface/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-brand-border rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-primary" size={20} />
            <span className="font-bold">فلترك <span className="text-brand-primary">غير</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 bg-brand-dark rounded-xl p-1 border border-brand-border">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 hover:bg-brand-surface rounded-lg disabled:opacity-30"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 hover:bg-brand-surface rounded-lg disabled:opacity-30"
            >
              <Redo size={18} />
            </button>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-all"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">إعادة تعيين</span>
          </button>

          <button
            onClick={onDownload}
            className="bg-gradient-premium px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all active:scale-95"
          >
            <Download size={18} />
            <span>تنزيل</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-l border-brand-border bg-brand-surface flex flex-col z-10">
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex flex-col md:flex-row items-center gap-3 p-3 md:px-4 md:py-3 rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'hover:bg-brand-border text-gray-400'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] md:text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-brand-border hidden md:block">
            <div className="p-4 bg-brand-dark rounded-2xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                <ImageIcon className="text-brand-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">الوضع الحالي</p>
                <p className="text-sm font-bold">تعديل احترافي</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 bg-brand-dark relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
