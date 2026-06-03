import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  UserMinus,
  Image as ImageIcon,
  Maximize2,
  Smile,
  Palette,
  Scissors,
  Brush
} from 'lucide-react';

const AIActionCard = ({ title, description, icon: Icon, onClick, isNew }) => (
  <motion.button
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full p-4 bg-brand-dark border border-brand-border rounded-2xl flex items-start gap-4 text-right hover:border-brand-primary transition-all group relative overflow-hidden"
  >
    <div className="p-3 bg-brand-surface rounded-xl group-hover:bg-brand-primary/10 transition-colors">
      <Icon className="text-brand-primary" size={24} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-sm">{title}</h4>
        {isNew && <span className="text-[10px] bg-brand-primary px-1.5 py-0.5 rounded-full text-white">جديد</span>}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  </motion.button>
);

const AIPanel = () => {
  const features = [
    {
      id: 'enhance',
      title: 'تحسين الصورة تلقائياً',
      description: 'استخدام الذكاء الاصطناعي لتحسين الإضاءة والتفاصيل بضغطة واحدة.',
      icon: Sparkles,
      isNew: false
    },
    {
      id: 'bg-remove',
      title: 'إزالة الخلفية',
      description: 'قص العناصر بدقة عالية بذكاء اصطناعي متطور.',
      icon: UserMinus,
      isNew: true
    },
    {
      id: 'upscale',
      title: 'رفع الجودة (HD/4K)',
      description: 'زيادة دقة الصورة مع الحفاظ على التفاصيل الحادة.',
      icon: Maximize2,
      isNew: false
    },
    {
      id: 'skin',
      title: 'تنعيم البشرة',
      description: 'تحسين ملامح الوجه وإزالة العيوب بشكل طبيعي.',
      icon: Smile,
      isNew: true
    },
    {
      id: 'anime',
      title: 'تحويل إلى أنمي',
      description: 'حوّل صورك الشخصية إلى شخصيات أنمي جذابة.',
      icon: Palette,
      isNew: false
    },
    {
      id: 'restoration',
      title: 'ترميم الصور القديمة',
      description: 'إصلاح الخدوش وتحسين الألوان في الصور التاريخية.',
      icon: Brush,
      isNew: false
    }
  ];

  const handleAction = (id) => {
    alert('هذه الميزة ستكون متوفرة قريباً في الإصدار القادم!');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border bg-brand-primary/5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-brand-primary" size={20} />
          <h3 className="font-bold text-lg">أدوات الذكاء الاصطناعي</h3>
        </div>
        <p className="text-xs text-gray-500">ميزات سحرية مدعومة بأحدث التقنيات</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide pb-24">
        {features.map((feature) => (
          <AIActionCard
            key={feature.id}
            {...feature}
            onClick={() => handleAction(feature.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AIPanel;
