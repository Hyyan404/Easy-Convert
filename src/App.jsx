import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FileText, Folder, LayoutTemplate, Settings as SettingsIcon, Info, 
  User, Lock, Mail, ChevronRight, ChevronLeft, LogOut, FilePlus, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Download, Save, X, Edit3, Trash2, Check,
  Wand2, Loader2, Palette, Layout, Key, Eye, EyeOff
} from 'lucide-react';

const PROXY_URL = "https://script.google.com/macros/s/AKfycbwut17o_1-615YXvjYzY7-O_UGdNlsiO28hjauY7CSMJcPsRZdmEHApROKUQJXPRTQW0g/exec";

const firebaseConfig = {
  apiKey: "AIzaSyBviM6rG1AS8DfAHco1dM5bqrDK0ZAgaAA",
  authDomain: "easy-convert-9ff25.firebaseapp.com",
  projectId: "easy-convert-9ff25",
  storageBucket: "easy-convert-9ff25.firebasestorage.app",
  messagingSenderId: "80422950509",
  appId: "1:80422950509:web:635b73fc73946419e31164"
};

async function generateWithRetry(prompt, systemInstruction, userApiKey) {
  const key = userApiKey || localStorage.getItem('user_api_key') || '';
  if (!key || key.trim() === '') throw new Error('يرجى إدخال مفتاح API في الإعدادات');
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: key.trim(), prompt, systemInstruction })
  });
  if (!response.ok) throw new Error(`خطأ ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'خطأ من الخادم');
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text || text.length < 10) throw new Error('استجابة فارغة');
  return text;
}

const t = {
  ar: {
    appName: "فلترك غير", login: "تسجيل الدخول", signup: "إنشاء حساب", guest: "الدخول كضيف",
    forgotPass: "نسيت كلمة المرور؟", email: "البريد الإلكتروني", password: "كلمة المرور", name: "الاسم الكامل",
    createPdf: "إنشاء PDF جديد", myDocs: "مستنداتي", templates: "القوالب", settings: "الإعدادات", about: "حول التطبيق",
    welcome: "مرحباً", write: "كتابة", config: "تنسيق الصفحة", export: "تصدير", save: "حفظ",
    title: "عنوان المستند", header: "الترويسة", footer: "التذييل", pageSize: "حجم الصفحة",
    dark: "الوضع الداكن", light: "الوضع الفاتح", language: "اللغة", docSaved: "تم الحفظ!", download: "تحميل PDF",
    delete: "حذف", search: "بحث...", noDocs: "لا توجد مستندات",
    schoolReport: "تقرير مدرسي", assignment: "واجب منزلي", resume: "سيرة ذاتية", letter: "رسالة رسمية",
    invoice: "فاتورة", notes: "ملاحظات", selectTemplate: "اختر قالباً",
    developer: "تطوير بواسطة حيان محمد", aboutDesc: "تطبيق عربي احترافي لتحويل النصوص إلى PDF",
    aiFormat: "تنسيق ذكي (AI)", aiFormatDesc: "سيقوم الذكاء الاصطناعي بتنسيق النص باحترافية",
    theme: "التصميم", colorPalette: "الألوان", applyFormat: "تطبيق التنسيق",
    formatting: "جاري التنسيق...", exporting: "جاري التصدير...",
    themes: { corporate: "شركات", academic: "أكاديمي", modern: "عصري", minimal: "بسيط", creative: "إبداعي" },
    colors: { blue: "أزرق", green: "أخضر", dark: "داكن", gold: "ذهبي", navy: "كحلي" },
    apiKey: "مفتاح API", apiKeyDesc: "أدخل مفتاح Gemini API من: aistudio.google.com/apikey",
    saveApiKey: "حفظ المفتاح", apiKeySaved: "تم الحفظ!", enterApiKey: "أدخل المفتاح",
    preview: "معاينة", emptyDoc: "المستند فارغ، اكتب شيئاً أولاً", pdfSuccess: "✅ تم تحميل PDF!",
    resetEmailSent: "تم إرسال رابط إعادة التعيين", sendResetLink: "إرسال رابط",
    enterFileName: "📄 أدخل اسم الملف:", fileNamePlaceholder: "أدخل اسم الملف...",
    downloadPdf: "تحميل PDF", cancel: "إلغاء",
  },
  en: {
    appName: "Filterak Ghair", login: "Login", signup: "Sign Up", guest: "Guest",
    forgotPass: "Forgot Password?", email: "Email", password: "Password", name: "Name",
    createPdf: "Create PDF", myDocs: "My Docs", templates: "Templates", settings: "Settings", about: "About",
    welcome: "Welcome", write: "Write", config: "Config", export: "Export", save: "Save",
    title: "Title", header: "Header", footer: "Footer", pageSize: "Page Size",
    dark: "Dark", light: "Light", language: "Language", docSaved: "Saved!", download: "Download",
    delete: "Delete", search: "Search...", noDocs: "No documents",
    schoolReport: "School Report", assignment: "Assignment", resume: "Resume", letter: "Letter",
    invoice: "Invoice", notes: "Notes", selectTemplate: "Select template",
    developer: "By Hayyan Mohamed", aboutDesc: "Professional Arabic PDF converter",
    aiFormat: "AI Format", aiFormatDesc: "AI will format your text professionally",
    theme: "Theme", colorPalette: "Colors", applyFormat: "Apply Format",
    formatting: "Formatting...", exporting: "Exporting...",
    themes: { corporate: "Corporate", academic: "Academic", modern: "Modern", minimal: "Minimal", creative: "Creative" },
    colors: { blue: "Blue", green: "Green", dark: "Dark", gold: "Gold", navy: "Navy" },
    apiKey: "API Key", apiKeyDesc: "Enter Gemini API key from aistudio.google.com/apikey",
    saveApiKey: "Save Key", apiKeySaved: "Saved!", enterApiKey: "Enter key",
    preview: "Preview", emptyDoc: "Document is empty. Write something first.", pdfSuccess: "✅ PDF downloaded!",
    resetEmailSent: "Reset link sent", sendResetLink: "Send Link",
    enterFileName: "📄 Enter file name:", fileNamePlaceholder: "Enter file name...",
    downloadPdf: "Download PDF", cancel: "Cancel",
  }
};

const templatesContent = {
  schoolReport: { title: "تقرير مدرسي", content: "<h1 style='text-align:center'>تقرير الطالب</h1><p><b>الاسم:</b> ___</p><p><b>الصف:</b> ___</p><hr><p><b>ملاحظات:</b></p>" },
  assignment: { title: "واجب منزلي", content: "<h2>المادة:</h2><p><b>التاريخ:</b></p><hr><p><b>السؤال الأول:</b></p><br><p><b>السؤال الثاني:</b></p>" },
  resume: { title: "سيرة ذاتية", content: "<h1 style='text-align:center'>الاسم</h1><p style='text-align:center'>إيميل | هاتف</p><hr><h3>خبرات:</h3><ul><li>...</li></ul><h3>تعليم:</h3><ul><li>...</li></ul>" },
  letter: { title: "رسالة رسمية", content: "<p>التاريخ: / /</p><p>إلى: ___</p><p><b>الموضوع:</b> ___</p><p>تحية طيبة،</p><br><p>التوقيع:</p>" },
  invoice: { title: "فاتورة", content: "<h1>فاتورة #001</h1><p><b>التاريخ:</b></p><hr><table border='1' width='100%'><tr><th>الوصف</th><th>المبلغ</th></tr><tr><td>خدمات</td><td>0</td></tr></table><h3>الإجمالي: 0</h3>" },
  notes: { title: "ملاحظات", content: "<h2>ملاحظات</h2><p><b>التاريخ:</b></p><ul><li>نقطة ١</li><li>نقطة ٢</li></ul>" }
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'ar');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('app_user')); } catch { return null; } });
  const [view, setView] = useState(null);
  const [docs, setDocs] = useState(() => { try { return JSON.parse(localStorage.getItem('app_docs')) || []; } catch { return []; } });
  const [activeDoc, setActiveDoc] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('user_api_key') || '');
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const loadFirebase = async () => {
      if (window.firebase && window.firebase.auth) {
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        setFirebaseReady(true);
        return;
      }

      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            // Script already being loaded or exists
            const existing = document.querySelector(`script[src="${src}"]`);
            if (window.firebase && (src.includes('auth') ? window.firebase.auth : true)) {
              resolve();
            } else {
              existing.addEventListener('load', resolve);
              existing.addEventListener('error', reject);
            }
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      try {
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js");
        
        if (window.firebase && !window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        setFirebaseReady(true);
      } catch (error) {
        console.error('Firebase load error:', error);
        setFirebaseReady(true);
      }
    };

    loadFirebase();
  }, []);

  useEffect(() => {
    if (!firebaseReady) return;

    try {
      const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
        if (u) {
          const userData = { 
            uid: u.uid, 
            email: u.email, 
            name: u.displayName || u.email?.split('@')[0] || 'User', 
            isGuest: false 
          };
          setUser(userData);
          localStorage.setItem('app_user', JSON.stringify(userData));
          setView('dashboard');
        } else {
          if (!user) {
            setView('auth');
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      if (!user) setView('auth');
    }
  }, [firebaseReady]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    localStorage.setItem('app_theme', theme);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [lang, theme]);

  useEffect(() => {
    localStorage.setItem('app_docs', JSON.stringify(docs));
  }, [docs]);

  const nav = (v, d = null) => {
    setView(v);
    if (d !== null) setActiveDoc(d);
  };

  const logout = () => {
    try {
      firebase.auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('app_user');
    setView('auth');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
    setView('dashboard');
  };

  const txt = t[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';
  const tc = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50',
    txt: isDark ? 'text-gray-100' : 'text-gray-900',
    card: isDark ? 'bg-[#171717]' : 'bg-white',
    p: 'bg-[#8b5cf6]',
    a: 'bg-[#7c3aed]',
    pt: 'text-[#8b5cf6]',
    at: 'text-[#7c3aed]'
  };

  if (!view && !firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#171717] to-[#8b5cf6]">
        <Loader2 size={48} className="animate-spin text-white" />
      </div>
    );
  }

  if (!view) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#171717] to-[#8b5cf6]">
        <Loader2 size={48} className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${tc.bg} ${tc.txt} transition-colors duration-300 w-full overflow-x-hidden pb-20`}>
      {view === 'auth' && <AuthScreen onLogin={handleLogin} txt={txt} tc={tc} isRtl={isRtl} />}
      {view === 'dashboard' && <Dashboard user={user} txt={txt} nav={nav} logout={logout} tc={tc} />}
      {view === 'editor' && (
        <Editor
          key={activeDoc?.id || 'new'}
          doc={activeDoc}
          txt={txt}
          nav={nav}
          onSave={(d) => {
            setDocs(prev => {
              if (activeDoc?.id) {
                return prev.map(x => x.id === d.id ? d : x);
              }
              return [d, ...prev];
            });
            setActiveDoc(d);
          }}
          tc={tc}
          isRtl={isRtl}
          apiKey={apiKey}
          lang={lang}
        />
      )}
      {view === 'library' && <Library docs={docs} setDocs={setDocs} txt={txt} nav={nav} tc={tc} />}
      {view === 'templates' && <Templates txt={txt} nav={nav} tc={tc} />}
      {view === 'settings' && <Settings txt={txt} nav={nav} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} tc={tc} apiKey={apiKey} setApiKey={setApiKey} />}
      {view === 'about' && <About txt={txt} nav={nav} tc={tc} />}
    </div>
  );
}

// ──────────────────────────────────────────────
// AUTH SCREEN
// ──────────────────────────────────────────────
function AuthScreen({ onLogin, txt, tc, isRtl }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('❌ أدخل البريد الإلكتروني'); return; }
    if (mode !== 'forgot' && !password) { setError('❌ أدخل كلمة المرور'); return; }
    if (mode === 'signup' && password.length < 6) { setError('❌ كلمة المرور قصيرة جداً (6 أحرف على الأقل)'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        const r = await firebase.auth().signInWithEmailAndPassword(email, password);
        onLogin({ uid: r.user.uid, email: r.user.email, name: r.user.displayName || email.split('@')[0], isGuest: false });
      } else if (mode === 'signup') {
        const r = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (name) await r.user.updateProfile({ displayName: name });
        onLogin({ uid: r.user.uid, email: r.user.email, name: name || email.split('@')[0], isGuest: false });
      } else {
        await firebase.auth().sendPasswordResetEmail(email);
        setResetSent(true);
      }
    } catch (err) {
      const msgs = {
        'auth/user-not-found': '❌ لا يوجد حساب بهذا البريد',
        'auth/wrong-password': '❌ كلمة المرور غير صحيحة',
        'auth/invalid-credential': '❌ البريد أو كلمة المرور غير صحيحة',
        'auth/email-already-in-use': '❌ البريد الإلكتروني مستخدم بالفعل',
        'auth/invalid-email': '❌ البريد الإلكتروني غير صالح',
        'auth/network-request-failed': '❌ خطأ في الاتصال بالإنترنت',
      };
      setError(msgs[err.code] || '❌ ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0a0a0a] via-[#171717] to-[#8b5cf6]">
      <div className={`${tc.card} p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/5`}>
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-[#8b5cf6] to-[#7c3aed] text-white p-4 rounded-full shadow-lg">
            <FileText size={48} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">{txt.appName}</h1>
        <p className="text-center text-gray-500 mb-8">
          {mode === 'login' ? txt.login : mode === 'signup' ? txt.signup : txt.forgotPass}
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        
        {resetSent ? (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-center">
            <p>✅ {txt.resetEmailSent}</p>
            <button onClick={() => { setMode('login'); setResetSent(false); }} className="mt-3 text-[#00b4d8] font-bold">⬅ العودة لتسجيل الدخول</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className={`absolute top-3.5 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                <input type="text" placeholder={txt.name} value={name} onChange={e => setName(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
              </div>
            )}
            <div className="relative">
              <Mail className={`absolute top-3.5 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
              <input type="email" placeholder={txt.email} value={email} onChange={e => setEmail(e.target.value)} required
                className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
            </div>
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className={`absolute top-3.5 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                <input type={show ? "text" : "password"} placeholder={txt.password} value={password} onChange={e => setPassword(e.target.value)} required
                  className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
                <button type="button" onClick={() => setShow(!show)} className={`absolute top-3.5 ${isRtl ? 'left-3' : 'right-3'} text-gray-400`}>
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-3 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition disabled:opacity-60">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" /> جاري...</span>
                : mode === 'login' ? txt.login : mode === 'signup' ? txt.signup : txt.sendResetLink}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center space-y-3">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} className="text-sm text-[#00b4d8]">{txt.forgotPass}</button>
              <button onClick={() => setMode('signup')} className="text-sm text-gray-500">{txt.signup} →</button>
            </>
          )}
          {mode === 'signup' && <button onClick={() => setMode('login')} className="text-sm text-gray-500">← {txt.login}</button>}
          {mode === 'forgot' && <button onClick={() => setMode('login')} className="text-sm text-gray-500">← العودة</button>}
          <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-3">
            <button onClick={() => onLogin({ name: 'Guest', isGuest: true })}
              className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0f2c59] transition">
              <User size={18} /> {txt.guest}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────
function Dashboard({ user, txt, nav, logout, tc }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h2 className="text-sm text-gray-500">{txt.welcome},</h2>
          <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
        </div>
        <button onClick={logout} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full text-red-500 hover:bg-red-50 transition">
          <LogOut size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card icon={<FilePlus size={32} />} title={txt.createPdf} color="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]" textCol="text-white" onClick={() => nav('editor', null)} />
        <Card icon={<Folder size={32} />} title={txt.myDocs} color="bg-gradient-to-br from-[#171717] to-[#0a0a0a]" textCol="text-white" onClick={() => nav('library')} />
        <Card icon={<LayoutTemplate size={32} />} title={txt.templates} color={tc.card} onClick={() => nav('templates')} />
        <Card icon={<SettingsIcon size={32} />} title={txt.settings} color={tc.card} onClick={() => nav('settings')} />
      </div>
      <div className="mt-8">
        <div className={`${tc.card} p-6 rounded-3xl flex items-center justify-between cursor-pointer shadow-sm border border-white/5`} onClick={() => nav('about')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-gray-800 rounded-xl text-[#8b5cf6]"><Info size={24} /></div>
            <span className="font-bold text-lg">{txt.about}</span>
          </div>
          <ChevronRight size={24} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, color, textCol, onClick }) {
  return (
    <div onClick={onClick} className={`${color} ${textCol || ''} p-6 rounded-3xl aspect-square flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-md transition active:scale-95`}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}

// ──────────────────────────────────────────────
// EDITOR - النسخة النهائية مع الحفظ الصحيح
// ──────────────────────────────────────────────
function Editor({ doc, txt, nav, onSave, tc, isRtl, apiKey, lang }) {
  const [tab, setTab] = useState('write');
  const [content, setContent] = useState(doc?.content || '');
  const [title, setTitle] = useState(doc?.title || txt.createPdf);
  const [header, setHeader] = useState(doc?.header || '');
  const [footer, setFooter] = useState(doc?.footer || '');
  const [pageSize, setPageSize] = useState(doc?.pageSize || 'A4');
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [aiModal, setAiModal] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [aiTheme, setAiTheme] = useState('corporate');
  const [aiColor, setAiColor] = useState('blue');
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [customFileName, setCustomFileName] = useState('');

  const editorRef = useRef(null);
  const editorInitialized = useRef(false);

  useEffect(() => {
    if (tab === 'write' && editorRef.current) {
      if (!editorInitialized.current || editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
        editorInitialized.current = true;
      }
    }
  }, [tab, content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const execCmd = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const getCurrentContent = () => {
    return editorRef.current ? editorRef.current.innerHTML : content;
  };

  const save = () => {
    const currentContent = getCurrentContent();
    const d = {
      id: doc?.id || Date.now().toString(),
      title,
      content: currentContent,
      header,
      footer,
      pageSize,
      date: new Date().toISOString()
    };
    setContent(currentContent);
    onSave(d);
    showToast(txt.docSaved);
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // فتح نافذة تغيير اسم الملف
  const openFileNameModal = () => {
    const currentContent = getCurrentContent();
    const stripped = currentContent.replace(/<[^>]*>/g, '').trim();
    if (!stripped && !header && !footer) {
      alert(txt.emptyDoc);
      return;
    }
    const defaultName = (title || 'document').replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-_\.]/g, '');
    setCustomFileName(defaultName);
    setShowFileNameModal(true);
  };

  // حفظ الملف مباشرة
  const saveFileDirectly = (blob, fileName) => {
    return new Promise((resolve) => {
      try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve(true);
        }, 500);
      } catch (error) {
        console.error('Save error:', error);
        resolve(false);
      }
    });
  };

  // تصدير PDF
  const exportPDF = async (fileName) => {
    const currentContent = getCurrentContent();
    setContent(currentContent);

    if (!fileName || fileName.trim() === '') {
      fileName = (title || 'document').replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-_\.]/g, '') + '.pdf';
    }
    
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }

    setExporting(true);

    try {
      // تحميل المكتبات
      if (!window.html2canvas) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      }
      if (!window.jspdf) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // إنشاء div مؤقت
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 210mm;
        background: white;
        padding: 20mm 15mm;
        direction: ${isRtl ? 'rtl' : 'ltr'};
        text-align: ${isRtl ? 'right' : 'left'};
        font-family: 'Segoe UI', 'Arial', 'Traditional Arabic', 'Tahoma', sans-serif;
        font-size: 14px;
        line-height: 1.8;
        color: #111;
      `;
      
      tempDiv.innerHTML = `
        ${header ? `<div style="color:#555;border-bottom:1px solid #ddd;padding-bottom:10px;margin-bottom:24px;text-align:center;font-size:12px;font-weight:bold;">${header}</div>` : ''}
        <div>${currentContent}</div>
        ${footer ? `<div style="color:#555;border-top:1px solid #ddd;padding-top:10px;margin-top:30px;text-align:center;font-size:12px;font-weight:bold;">${footer}</div>` : ''}
      `;
      
      document.body.appendChild(tempDiv);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await window.html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
      const x = (pdfWidth - imgWidth) / 2;

      pdf.addImage(imgData, 'JPEG', x, 0, imgWidth, imgHeight);

      // معالجة الصفحات المتعددة
      let heightLeft = imgHeight - pdfHeight;
      let pageNum = 1;
      while (heightLeft > 0) {
        pdf.addPage();
        pageNum++;
        pdf.addImage(imgData, 'JPEG', x, -(pdfHeight * (pageNum - 1)), imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // حفظ الملف مباشرة
      const pdfBlob = pdf.output('blob');
      await saveFileDirectly(pdfBlob, fileName);

      // حفظ المستند
      const d = {
        id: doc?.id || Date.now().toString(),
        title,
        content: currentContent,
        header,
        footer,
        pageSize,
        date: new Date().toISOString()
      };
      onSave(d);
      
      showToast(txt.pdfSuccess);

    } catch (error) {
      console.error('PDF Export Error:', error);
      try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const textContent = currentContent.replace(/<[^>]*>/g, '').substring(0, 1000);
        pdf.text(textContent, 10, 10);
        const pdfBlob = pdf.output('blob');
        await saveFileDirectly(pdfBlob, fileName);
        showToast(txt.pdfSuccess);
      } catch (e) {
        alert('❌ خطأ في التصدير: ' + error.message);
      }
    } finally {
      setExporting(false);
    }
  };

  const handleFileNameSubmit = () => {
    setShowFileNameModal(false);
    exportPDF(customFileName);
  };

  const smartFormat = async () => {
    const key = apiKey || localStorage.getItem('user_api_key') || '';
    if (!key || key.trim() === '') { alert('❌ أضف مفتاح API في الإعدادات'); return; }

    const rawContent = getCurrentContent();
    if (!rawContent.replace(/<[^>]*>/g, '').trim()) {
      alert('❌ المستند فارغ. اكتب شيئاً أولاً');
      return;
    }

    setFormatting(true);
    const colors = { blue: '#1E3A8A', green: '#065F46', dark: '#1F2937', gold: '#B45309', navy: '#111827' };
    const si = `You are an expert document formatter. Format the provided HTML text into a professional, clean HTML document.
Rules:
- Keep ALL original text intact, do not translate or change wording
- Use inline CSS styles only
- Support RTL Arabic text naturally
- Use the accent color: ${colors[aiColor]}
- Apply ${txt.themes[aiTheme]} style
- Make headings bold and styled with the accent color
- Ensure proper spacing and readable typography
- Return ONLY the HTML body content, no <html> or <body> tags, no markdown code fences`;

    try {
      const html = await generateWithRetry(rawContent, si, key);
      let clean = html.replace(/```html\n?/gi, '').replace(/```/g, '').trim();
      if (!clean || clean.length < 10) throw new Error('استجابة فارغة من AI');
      setContent(clean);
      if (editorRef.current) editorRef.current.innerHTML = clean;
      setAiModal(false);
      setTab('preview');
      const d = { id: doc?.id || Date.now().toString(), title, content: clean, header, footer, pageSize, date: new Date().toISOString() };
      onSave(d);
      showToast('✅ تم التنسيق بنجاح!');
    } catch (err) {
      alert('❌ خطأ في التنسيق: ' + (err.message || 'تأكد من صحة مفتاح API'));
    }
    setFormatting(false);
  };

  const tabs = [
    { id: 'write', label: txt.write },
    { id: 'config', label: txt.config },
    { id: 'preview', label: txt.preview },
  ];

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className={`p-4 ${tc.card} flex items-center justify-between shadow-sm z-10 flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <button onClick={() => nav('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            {isRtl ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="bg-transparent font-bold text-lg outline-none w-28 md:w-auto truncate" placeholder={txt.title} />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold text-sm flex items-center gap-1">
            <Save size={16} /><span className="hidden md:inline">{txt.save}</span>
          </button>
          <button onClick={() => setAiModal(true)}
            className="px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-md">
            <Wand2 size={16} /><span className="hidden md:inline">{txt.aiFormat}</span>
          </button>
          <button 
            onClick={openFileNameModal}
            disabled={exporting}
            className="px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition active:scale-95 disabled:opacity-60">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden md:inline">{exporting ? txt.exporting : txt.export}</span>
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex px-4 gap-1 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`py-3 px-4 font-bold text-sm transition-all ${tab === tb.id ? 'border-b-2 border-[#00b4d8] text-[#00b4d8]' : 'text-gray-500 hover:text-gray-700'}`}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-950 p-4 md:p-8">
        {/* WRITE TAB */}
        <div className={`${tab === 'write' ? 'flex' : 'hidden'} flex-col max-w-4xl mx-auto h-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden`}
          style={{ minHeight: '70vh' }}>
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <TB icon={<Bold size={16} />} onClick={() => execCmd('bold')} />
            <TB icon={<Italic size={16} />} onClick={() => execCmd('italic')} />
            <TB icon={<Underline size={16} />} onClick={() => execCmd('underline')} />
            <Sep />
            <TB icon={<AlignLeft size={16} />} onClick={() => execCmd('justifyLeft')} />
            <TB icon={<AlignCenter size={16} />} onClick={() => execCmd('justifyCenter')} />
            <TB icon={<AlignRight size={16} />} onClick={() => execCmd('justifyRight')} />
            <Sep />
            <TB icon={<List size={16} />} onClick={() => execCmd('insertUnorderedList')} />
            <TB icon={<ListOrdered size={16} />} onClick={() => execCmd('insertOrderedList')} />
            <Sep />
            <select onChange={e => execCmd('formatBlock', e.target.value)}
              className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 dark:text-white cursor-pointer">
              <option value="p">Normal</option>
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>
            <input type="color" onChange={e => execCmd('foreColor', e.target.value)}
              className="w-8 h-8 p-0.5 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-transparent" />
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleInput}
            className="flex-1 p-6 md:p-10 outline-none overflow-y-auto text-gray-900 dark:text-gray-100"
            style={{ direction: isRtl ? 'rtl' : 'ltr', minHeight: '400px' }}
          />
        </div>

        {/* CONFIG TAB */}
        {tab === 'config' && (
          <div className={`max-w-lg mx-auto ${tc.card} rounded-2xl shadow-lg p-6 space-y-6`}>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">{txt.pageSize}</label>
              <select value={pageSize} onChange={e => setPageSize(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00b4d8]">
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="A5">A5 (148 × 210 mm)</option>
                <option value="Letter">Letter (8.5 × 11 in)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">{txt.header}</label>
              <input type="text" value={header} onChange={e => setHeader(e.target.value)} placeholder="نص الترويسة..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">{txt.footer}</label>
              <input type="text" value={footer} onChange={e => setFooter(e.target.value)} placeholder="نص التذييل..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            </div>
          </div>
        )}

        {/* PREVIEW TAB */}
        {tab === 'preview' && (
          <div className="flex justify-center items-start pb-10">
            <div className="bg-white shadow-2xl"
              style={{
                width: pageSize === 'A4' ? '794px' : pageSize === 'A5' ? '559px' : '816px',
                minHeight: pageSize === 'A4' ? '1123px' : pageSize === 'A5' ? '794px' : '1056px',
                padding: '60px',
                transform: 'scale(0.75)',
                transformOrigin: 'top center',
                color: '#111',
                direction: isRtl ? 'rtl' : 'ltr',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.8',
              }}>
              {header && (
                <div style={{ color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                  {header}
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: content }} style={{ wordBreak: 'break-word' }} />
              {footer && (
                <div style={{ color: '#555', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '30px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                  {footer}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Format Modal */}
      {aiModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${tc.card} w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3 text-purple-500">
                <Wand2 size={24} />
                <h2 className="text-xl font-bold">{txt.aiFormat}</h2>
              </div>
              <button onClick={() => setAiModal(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">{txt.aiFormatDesc}</p>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3"><Layout size={16} />{txt.theme}</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(txt.themes).map(k => (
                    <button key={k} onClick={() => setAiTheme(k)}
                      className={`p-2.5 rounded-xl text-sm border-2 transition ${aiTheme === k ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {txt.themes[k]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3"><Palette size={16} />{txt.colorPalette}</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries({ blue: 'bg-blue-500', green: 'bg-emerald-600', dark: 'bg-gray-800', gold: 'bg-amber-500', navy: 'bg-indigo-900' }).map(([k, bg]) => (
                    <button key={k} onClick={() => setAiColor(k)}
                      className={`p-2.5 rounded-xl text-sm border-2 flex items-center gap-2 transition ${aiColor === k ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <span className={`w-4 h-4 rounded-full ${bg} flex-shrink-0`}></span>
                      {txt.colors[k]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={smartFormat} disabled={formatting}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60">
              {formatting ? <><Loader2 size={20} className="animate-spin" />{txt.formatting}</> : <><Wand2 size={20} />{txt.applyFormat}</>}
            </button>
          </div>
        </div>
      )}

      {/* File Name Modal */}
      {showFileNameModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${tc.card} w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/5`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Download size={24} className="text-[#8b5cf6]" />
                <h2 className="text-xl font-bold">{txt.downloadPdf}</h2>
              </div>
              <button onClick={() => setShowFileNameModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">{txt.enterFileName}</p>
            
            <div className="relative">
              <input
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder={txt.fileNamePlaceholder}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-16 outline-none focus:ring-2 focus:ring-[#00b4d8]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFileNameSubmit();
                }}
              />
              <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-bold">.pdf</span>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFileNameModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 font-bold text-sm transition hover:opacity-80">
                {txt.cancel}
              </button>
              <button
                onClick={handleFileNameSubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-bold text-sm transition hover:opacity-90">
                {txt.download}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 whitespace-nowrap">
          <Check size={20} />{toastMsg}
        </div>
      )}
    </div>
  );
}

function TB({ icon, onClick }) {
  return (
    <button onClick={onClick}
      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition active:scale-95">
      {icon}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />;
}

// ──────────────────────────────────────────────
// LIBRARY
// ──────────────────────────────────────────────
function Library({ docs, setDocs, txt, nav, tc }) {
  const [search, setSearch] = useState('');
  const filtered = docs.filter(d => d.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={txt.myDocs} nav={nav} tc={tc} />
      <div className="p-6">
        <div className="relative mb-6">
          <input type="text" placeholder={txt.search} value={search} onChange={e => setSearch(e.target.value)}
            className={`w-full ${tc.card} rounded-xl py-3 px-4 outline-none shadow-sm focus:ring-2 focus:ring-[#00b4d8]`} />
        </div>
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <Folder size={64} className="mb-4 opacity-50 mx-auto" />
            <p>{txt.noDocs}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(d => (
              <div key={d.id} className={`${tc.card} p-4 rounded-2xl shadow-sm flex items-center justify-between`}>
                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => nav('editor', d)}>
                  <div className="p-3 bg-purple-50 dark:bg-gray-800 rounded-xl text-[#8b5cf6]"><FileText size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg">{d.title}</h3>
                    <p className="text-xs text-gray-500">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => { if (confirm('حذف هذا المستند؟')) setDocs(docs.filter(x => x.id !== d.id)); }}
                  className="p-2 text-red-400 hover:text-red-600 transition">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// TEMPLATES
// ──────────────────────────────────────────────
function Templates({ txt, nav, tc }) {
  const tpls = [
    { id: 'schoolReport', icon: <FileText size={32} />, title: txt.schoolReport, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'assignment', icon: <Edit3 size={32} />, title: txt.assignment, color: 'bg-green-100 text-green-600' },
    { id: 'resume', icon: <User size={32} />, title: txt.resume, color: 'bg-blue-100 text-blue-600' },
    { id: 'letter', icon: <Mail size={32} />, title: txt.letter, color: 'bg-orange-100 text-orange-600' },
    { id: 'invoice', icon: <ListOrdered size={32} />, title: txt.invoice, color: 'bg-purple-100 text-purple-600' },
    { id: 'notes', icon: <AlignLeft size={32} />, title: txt.notes, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={txt.templates} nav={nav} tc={tc} />
      <div className="p-6">
        <p className="text-gray-500 mb-6">{txt.selectTemplate}</p>
        <div className="grid grid-cols-2 gap-4">
          {tpls.map(t => (
            <div key={t.id}
              onClick={() => {
                const c = templatesContent[t.id];
                nav('editor', { title: c.title, content: c.content, pageSize: 'A4', header: '', footer: '' });
              }}
              className={`${tc.card} p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition cursor-pointer active:scale-95`}>
              <div className={`p-4 rounded-2xl mb-4 ${t.color}`}>{t.icon}</div>
              <h3 className="font-bold">{t.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// SETTINGS
// ──────────────────────────────────────────────
function Settings({ txt, nav, lang, setLang, theme, setTheme, tc, apiKey, setApiKey }) {
  const [key, setKey] = useState(apiKey);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveKey = () => {
    setApiKey(key);
    localStorage.setItem('user_api_key', key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={txt.settings} nav={nav} tc={tc} />
      <div className="p-6 space-y-6">
        <div className={`${tc.card} rounded-3xl p-6 shadow-sm space-y-6 border border-white/5`}>
          <div className="flex justify-between items-center">
            <span className="font-bold">{txt.language}</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={() => setLang('ar')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${lang === 'ar' ? 'bg-white shadow text-[#8b5cf6]' : 'text-gray-500'}`}>عربي</button>
              <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${lang === 'en' ? 'bg-white shadow text-[#8b5cf6]' : 'text-gray-500'}`}>English</button>
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex justify-between items-center">
            <span className="font-bold">{theme === 'dark' ? txt.dark : txt.light}</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${theme === 'light' ? 'bg-white shadow text-[#8b5cf6]' : 'text-gray-500'}`}>{txt.light}</button>
              <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${theme === 'dark' ? 'bg-white shadow text-[#8b5cf6]' : 'text-gray-500'}`}>{txt.dark}</button>
            </div>
          </div>
        </div>

        <div className={`${tc.card} rounded-3xl p-6 shadow-sm space-y-4 border border-white/5`}>
          <div className="flex items-center gap-2">
            <Key size={20} className="text-[#8b5cf6]" />
            <h3 className="font-bold text-lg">{txt.apiKey}</h3>
          </div>
          <p className="text-sm text-gray-500">{txt.apiKeyDesc}</p>
          <div className="relative">
            <input type={show ? "text" : "password"} value={key} onChange={e => setKey(e.target.value)}
              placeholder={txt.enterApiKey}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-12 outline-none focus:ring-2 focus:ring-[#00b4d8]" />
            <button onClick={() => setShow(!show)} className="absolute top-3.5 right-3 text-gray-400">
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button onClick={saveKey} className="w-full bg-[#00b4d8] text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
            {txt.saveApiKey}
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <Check size={16} />{txt.apiKeySaved}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// ABOUT
// ──────────────────────────────────────────────
function About({ txt, nav, tc }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={txt.about} nav={nav} tc={tc} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-gradient-to-tr from-[#8b5cf6] to-[#7c3aed] rounded-full flex items-center justify-center text-white shadow-2xl mb-8">
          <FileText size={64} />
        </div>
        <h1 className="text-3xl font-bold mb-2">{txt.appName}</h1>
        <p className="text-gray-500 mb-8 max-w-sm">{txt.aboutDesc}</p>
        <div className={`${tc.card} px-6 py-4 rounded-2xl shadow-sm border border-white/5`}>
          <p className="font-bold text-[#8b5cf6]">{txt.developer}</p>
          <p className="text-sm text-gray-400 mt-1">Version 5.0 (Filterak Ghair)</p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// TOP BAR
// ──────────────────────────────────────────────
function TopBar({ title, nav, tc }) {
  const isRtl = document.documentElement.dir === 'rtl';
  return (
    <div className={`p-4 ${tc.card} flex items-center shadow-sm sticky top-0 z-10`}>
      <button onClick={() => nav('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-3 transition">
        {isRtl ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
