import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import EditorLayout from './components/Editor/EditorLayout';
import FilterPanel, { filters } from './components/Editor/FilterPanel';
import AdjustPanel from './components/Editor/AdjustPanel';
import AIPanel from './components/Editor/AIPanel';
import CanvasWorkspace from './components/Editor/CanvasWorkspace';
import { exportImage, downloadDataUrl } from './utils/imageExport';
import confetti from 'canvas-confetti';
import { Upload, X, ImageIcon } from 'lucide-react';

const INITIAL_ADJUSTMENTS = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  warmth: 0,
  sharpness: 0,
  blur: 0
};

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'editor'
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('filters');
  const [activeFilter, setActiveFilter] = useState('original');
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Handle image upload
  const onImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (r) => {
        setImage(r.target.result);
        setView('editor');
        saveToHistory({ filter: 'original', adjustments: INITIAL_ADJUSTMENTS });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (r) => {
        setImage(r.target.result);
        setView('editor');
        saveToHistory({ filter: 'original', adjustments: INITIAL_ADJUSTMENTS });
      };
      reader.readAsDataURL(file);
    }
  };

  // State management
  const saveToHistory = (state) => {
    setHistory(prev => [...prev, state].slice(-20));
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const current = history[history.length - 1];
    const prev = history[history.length - 2];
    setRedoStack(rs => [current, ...rs]);
    setHistory(h => h.slice(0, -1));
    setActiveFilter(prev.filter);
    setAdjustments(prev.adjustments);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack(rs => rs.slice(1));
    setHistory(h => [...h, next]);
    setActiveFilter(next.filter);
    setAdjustments(next.adjustments);
  };

  const handleFilterSelect = (filterId) => {
    setActiveFilter(filterId);
    saveToHistory({ filter: filterId, adjustments });
  };

  const handleAdjustmentChange = (id, value) => {
    const newAdjustments = { ...adjustments, [id]: value };
    setAdjustments(newAdjustments);
    // Debounce history saving for sliders or save on change end if needed
  };

  // Save history on adjustment change end (using a simple timeout as debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const lastState = history[history.length - 1];
      if (lastState && (lastState.filter !== activeFilter || JSON.stringify(lastState.adjustments) !== JSON.stringify(adjustments))) {
        saveToHistory({ filter: activeFilter, adjustments });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [adjustments, activeFilter]);

  const resetAll = () => {
    if (confirm('هل أنت متأكد من مسح جميع التعديلات؟')) {
      setActiveFilter('original');
      setAdjustments(INITIAL_ADJUSTMENTS);
      saveToHistory({ filter: 'original', adjustments: INITIAL_ADJUSTMENTS });
    }
  };

  const handleDownload = async () => {
    const filterStyle = filters.find(f => f.id === activeFilter)?.filter || 'none';
    const dataUrl = await exportImage(image, filterStyle, adjustments);
    downloadDataUrl(dataUrl, `filterak-ghair-${Date.now()}.png`);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ffffff']
    });
  };

  const activeFilterStyle = filters.find(f => f.id === activeFilter)?.filter || 'none';

  if (view === 'landing') {
    return (
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <LandingPage onStart={() => document.getElementById('imageInput').click()} />
        <input
          id="imageInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
        />
      </div>
    );
  }

  return (
    <EditorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onDownload={handleDownload}
      onReset={resetAll}
      onBack={() => setView('landing')}
      canUndo={history.length > 1}
      canRedo={redoStack.length > 0}
      onUndo={undo}
      onRedo={redo}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <CanvasWorkspace
            image={image}
            adjustments={adjustments}
            activeFilterStyle={activeFilterStyle}
          />
        </div>

        {/* Settings Panel (Desktop Sidebar) */}
        <div className="w-80 border-r border-brand-border bg-brand-surface hidden lg:block overflow-hidden">
          {activeTab === 'filters' && (
            <FilterPanel
              activeFilter={activeFilter}
              onFilterSelect={handleFilterSelect}
              previewImage={image}
            />
          )}
          {activeTab === 'adjust' && (
            <AdjustPanel
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
            />
          )}
          {activeTab === 'ai' && <AIPanel />}
        </div>
      </div>

      {/* Mobile Bottom Sheet (Placeholder/Logic) */}
      <div className="lg:hidden border-t border-brand-border bg-brand-surface p-4 max-h-[40vh] overflow-y-auto">
          {activeTab === 'filters' && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFilterSelect(f.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 ${activeFilter === f.id ? 'text-brand-primary' : 'text-gray-500'}`}
                >
                  <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeFilter === f.id ? 'border-brand-primary' : 'border-transparent'}`}>
                     <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})`, filter: f.filter }} />
                  </div>
                  <span className="text-[10px] whitespace-nowrap">{f.name}</span>
                </button>
              ))}
            </div>
          )}
          {activeTab === 'adjust' && (
             <AdjustPanel
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
            />
          )}
          {activeTab === 'ai' && <AIPanel />}
      </div>
    </EditorLayout>
  );
}

export default App;
