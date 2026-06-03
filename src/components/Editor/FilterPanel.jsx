import React from 'react';

const filters = [
  { id: 'original', name: 'الأصلي', filter: 'none' },
  { id: 'vivid', name: 'iPhone Vivid', filter: 'saturate(1.4) contrast(1.1) brightness(1.05)' },
  { id: 'vivid_warm', name: 'iPhone Warm', filter: 'saturate(1.3) sepia(0.2) brightness(1.05)' },
  { id: 'vivid_cool', name: 'iPhone Cool', filter: 'saturate(1.3) hue-rotate(10deg) brightness(1.05)' },
  { id: 'dramatic', name: 'iPhone Dramatic', filter: 'contrast(1.4) brightness(0.9) saturate(0.8)' },
  { id: 'mono', name: 'Black & White', filter: 'grayscale(1)' },
  { id: 'noir', name: 'Noir', filter: 'grayscale(1) contrast(1.5) brightness(0.8)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.5) contrast(0.9) brightness(1.1)' },
  { id: 'retro', name: 'Retro', filter: 'contrast(1.2) saturate(0.8) sepia(0.3) hue-rotate(-10deg)' },
  { id: 'cinematic', name: 'Cinematic', filter: 'contrast(1.2) saturate(1.1) brightness(0.9) hue-rotate(-5deg)' },
  { id: 'golden_hour', name: 'Golden Hour', filter: 'sepia(0.3) saturate(1.5) brightness(1.1) contrast(1.1)' },
  { id: 'sunset', name: 'Sunset', filter: 'saturate(1.8) brightness(0.9) contrast(1.2) hue-rotate(-15deg)' },
  { id: 'matte', name: 'Matte', filter: 'contrast(0.8) brightness(1.1) saturate(0.9)' },
  { id: 'hdr', name: 'HDR', filter: 'contrast(1.3) saturate(1.4) brightness(1.1) sharpness(1.5)' },
  { id: 'high_contrast', name: 'High Contrast', filter: 'contrast(1.8) brightness(1.1)' },
  { id: 'film', name: 'Film Camera', filter: 'contrast(1.1) saturate(0.9) sepia(0.2) blur(0.2px)' },
  { id: 'soft_portrait', name: 'Soft Portrait', filter: 'brightness(1.1) saturate(1.1) blur(0.5px) contrast(0.9)' },
  { id: 'neon', name: 'Neon', filter: 'saturate(2.5) contrast(1.2) brightness(1.1) hue-rotate(10deg)' },
  { id: 'moody', name: 'Moody', filter: 'contrast(1.3) brightness(0.7) saturate(0.6) blue(0.2)' },
  { id: 'studio', name: 'Professional Studio', filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }
];

const FilterPanel = ({ activeFilter, onFilterSelect, previewImage }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border">
        <h3 className="font-bold text-lg">الفلاتر</h3>
        <p className="text-xs text-gray-500">اختر فلترًا لإضافته فورًا</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="grid grid-cols-2 gap-4 pb-20">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterSelect(f.id)}
              className={`flex flex-col gap-2 transition-all ${
                activeFilter === f.id ? 'scale-95' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeFilter === f.id ? 'border-brand-primary' : 'border-transparent'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${previewImage})`,
                    filter: f.filter
                  }}
                />
              </div>
              <span className={`text-xs font-medium text-center ${
                activeFilter === f.id ? 'text-brand-primary' : 'text-gray-400'
              }`}>
                {f.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
export { filters };
