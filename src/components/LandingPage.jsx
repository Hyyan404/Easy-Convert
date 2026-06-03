import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-white overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">فلترك <span className="text-brand-primary">غير</span></span>
        </div>
        <button
          onClick={onStart}
          className="px-6 py-2 rounded-full bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors text-sm font-medium"
        >
          ابدأ الآن
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            حوّل صورك بذكاء <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-purple-400">
              في ثوانٍ معدودة
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            استمتع بتجربة تعديل صور احترافية مدعومة بالذكاء الاصطناعي. فلاتر آيفون الأصلية، تحسين الجودة، وإزالة الخلفية - كل ذلك في مكان واحد.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-10 py-4 rounded-2xl bg-gradient-premium text-white font-bold text-lg shadow-xl shadow-brand-primary/25 flex items-center justify-center gap-2"
            >
              <Wand2 size={24} />
              ابدأ التعديل الآن
            </motion.button>

            <button className="px-10 py-4 rounded-2xl bg-brand-surface border border-brand-border hover:border-gray-600 transition-all text-white font-bold text-lg flex items-center justify-center gap-2">
              <Camera size={24} />
              شاهد الأمثلة
            </button>
          </div>
        </motion.div>

        {/* Floating elements for visual interest */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block absolute right-[10%] top-1/4 p-4 bg-brand-surface/50 backdrop-blur-md border border-brand-border rounded-2xl rotate-12"
        >
          <ImageIcon className="text-brand-primary" size={40} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block absolute left-[10%] bottom-1/4 p-4 bg-brand-surface/50 backdrop-blur-md border border-brand-border rounded-2xl -rotate-12"
        >
          <Sparkles className="text-purple-400" size={40} />
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="p-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} فلترك غير. جميع الحقوق محفوظة. تجربة تعديل صور احترافية.
      </footer>
    </div>
  );
};

export default LandingPage;
