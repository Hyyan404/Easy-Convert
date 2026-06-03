import React from 'react';
import { Sun, Contrast, Droplets, Zap, Wind, Thermometer, Maximize, Scissors, Cloud } from 'lucide-react';

const AdjustmentSlider = ({ label, icon: Icon, value, min, max, onChange, step = 1 }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <span className="text-brand-primary font-mono">{value > 0 ? `+${value}` : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
    />
  </div>
);

const AdjustPanel = ({ adjustments, onAdjustmentChange }) => {
  const tools = [
    { id: 'brightness', label: 'السطوع', icon: Sun, min: -100, max: 100 },
    { id: 'contrast', label: 'التباين', icon: Contrast, min: -100, max: 100 },
    { id: 'saturation', label: 'التشبع', icon: Droplets, min: -100, max: 100 },
    { id: 'exposure', label: 'التعريض', icon: Zap, min: -100, max: 100 },
    { id: 'warmth', label: 'الدفء', icon: Thermometer, min: -100, max: 100 },
    { id: 'sharpness', label: 'الحدة', icon: Wind, min: 0, max: 100 },
    { id: 'blur', label: 'التمويه', icon: Cloud, min: 0, max: 20 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border">
        <h3 className="font-bold text-lg">تعديل يدوي</h3>
        <p className="text-xs text-gray-500">تحكم كامل في تفاصيل الصورة</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide pb-24">
        {tools.map((tool) => (
          <AdjustmentSlider
            key={tool.id}
            label={tool.label}
            icon={tool.icon}
            value={adjustments[tool.id]}
            min={tool.min}
            max={tool.max}
            onChange={(val) => onAdjustmentChange(tool.id, val)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdjustPanel;
