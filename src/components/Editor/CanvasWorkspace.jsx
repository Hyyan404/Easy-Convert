import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Minimize, Eye } from 'lucide-react';

const CanvasWorkspace = ({
  image,
  adjustments,
  activeFilterStyle,
  onCompareStart,
  onCompareEnd
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isComparing, setIsComparing] = useState(false);
  const containerRef = useRef(null);

  // Construct CSS filter string from adjustments
  const getAdjustmentFilter = () => {
    const { brightness, contrast, saturation, exposure, warmth, sharpness, blur } = adjustments;
    return `
      brightness(${100 + brightness + exposure}%)
      contrast(${100 + contrast + (sharpness / 4)}%)
      saturate(${100 + saturation}%)
      sepia(${warmth > 0 ? warmth / 2 : 0}%)
      hue-rotate(${warmth < 0 ? warmth / 2 : 0}deg)
      blur(${blur}px)
    `;
  };

  const fullFilter = `${activeFilterStyle} ${getAdjustmentFilter()}`;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      <div
        ref={containerRef}
        className="relative max-w-full max-h-full aspect-auto rounded-2xl shadow-2xl overflow-hidden bg-brand-surface border border-brand-border group cursor-col-resize"
        onMouseMove={isComparing ? handleMouseMove : undefined}
        onTouchMove={isComparing ? handleTouchMove : undefined}
      >
        {/* Base Image (Edited) */}
        <img
          src={image}
          alt="Edited"
          className="max-h-[70vh] w-auto object-contain pointer-events-none"
          style={{ filter: fullFilter }}
        />

        {/* Before Layer (Original) */}
        <AnimatePresence>
          {isComparing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%`, borderLeft: '2px solid white' }}
            >
              <img
                src={image}
                alt="Original"
                className="h-full w-auto max-w-none object-cover"
                style={{
                  filter: 'none',
                  width: containerRef.current?.offsetWidth,
                  height: containerRef.current?.offsetHeight
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white z-10 pointer-events-none border border-white/10">
          المعدلة
        </div>

        {isComparing && (
          <div className="absolute top-4 left-4 bg-brand-primary/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white z-10 pointer-events-none border border-white/10">
            الأصلية
          </div>
        )}

        {/* Comparison Handle Button (only visible when not comparing) */}
        {!isComparing && (
          <button
            onClick={() => setIsComparing(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-brand-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all z-20"
          >
            <Eye size={20} />
            مقارنة قبل وبعد
          </button>
        )}

        {/* Close comparison button */}
        {isComparing && (
          <button
            onClick={() => setIsComparing(false)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-brand-primary text-white p-3 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all z-20"
          >
            إغلاق المقارنة
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p className="mt-6 text-gray-500 text-sm flex items-center gap-2">
        <Minimize size={14} />
        استخدم شريط المقارنة لمشاهدة الفرق بين الصورة الأصلية والمعدلة
      </p>
    </div>
  );
};

export default CanvasWorkspace;
