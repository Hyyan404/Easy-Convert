import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Folder, LayoutTemplate, Settings as SettingsIcon, Info, 
  User, Lock, Mail, ChevronRight, ChevronLeft, LogOut, FilePlus, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Download, Share2, Printer, Save, X, Edit3, Trash2, Check,
  Wand2, Loader2, Palette, Layout, Key, Eye, EyeOff
} from 'lucide-react';

// ==========================================
// Firebase Configuration
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBviM6rG1AS8DfAHco1dM5bqrDK0ZAgaAA",
  authDomain: "easy-convert-9ff25.firebaseapp.com",
  projectId: "easy-convert-9ff25",
  storageBucket: "easy-convert-9ff25.firebasestorage.app",
  messagingSenderId: "80422950509",
  appId: "1:80422950509:web:635b73fc73946419e31164",
  measurementId: "G-ZBTVX9SCK2"
};

// --- إعدادات الذكاء الاصطناعي (الدالة الأصلية المعدلة) ---
const apiKey = "";

async function generateWithRetry(prompt, systemInstruction, userApiKey, maxRetries = 5) {
  const key = userApiKey || apiKey;
  
  if (!key || key.trim() === '') {
    throw new Error('يرجى إدخال مفتاح API في الإعدادات');
  }
  
  const delays = [1000, 2000, 4000, 8000, 16000];
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.2 } 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `خطأ ${response.status}`;
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!result || result.length < 10) {
        throw new Error('استجابة فارغة من الذكاء الاصطناعي');
      }
      
      return result;
      
    } catch (error) {
      console.error(`محاولة ${attempt + 1} فشلت:`, error.message);
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
    }
  }
}

// --- الترجمات والنصوص ---
const t = {
  ar: {
    appName: "التحويل الساهل",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    guest: "الدخول كضيف",
    forgotPass: "نسيت كلمة المرور؟",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم الكامل",
    createPdf: "إنشاء PDF جديد",
    myDocs: "مستنداتي",
    templates: "القوالب",
    settings: "الإعدادات",
    about: "حول التطبيق",
    welcome: "مرحباً",
    write: "كتابة",
    config: "تنسيق الصفحة",
    export: "تصدير و حفظ",
    save: "حفظ مؤقت",
    title: "عنوان المستند",
    header: "الترويسة",
    footer: "التذييل",
    pageSize: "حجم الصفحة",
    margins: "الهوامش",
    dark: "الوضع الداكن",
    light: "الوضع الفاتح",
    language: "اللغة",
    docSaved: "تم الحفظ بنجاح!",
    share: "مشاركة",
    print: "طباعة",
    download: "تحميل PDF",
    delete: "حذف",
    rename: "إعادة تسمية",
    search: "بحث عن مستند...",
    noDocs: "لا توجد مستندات محفوظة.",
    schoolReport: "تقرير مدرسي",
    assignment: "واجب منزلي",
    resume: "سيرة ذاتية",
    letter: "رسالة رسمية",
    invoice: "فاتورة",
    notes: "ملاحظات",
    selectTemplate: "اختر قالباً للبدء",
    developer: "تطوير بواسطة حيان محمد",
    aboutDesc: "تطبيق عربي احترافي يحول النصوص إلى مستندات PDF عالية الجودة بسهولة وسرعة.",
    aiFormat: "تنسيق ذكي (AI)",
    aiFormatDesc: "سيقوم الذكاء الاصطناعي بتصميم وتنسيق النص باحترافية دون تغيير المحتوى.",
    theme: "التصميم العام",
    colorPalette: "لوحة الألوان",
    applyFormat: "تطبيق التنسيق الذكي",
    formatting: "جاري التنسيق...",
    exporting: "جاري تصدير PDF...",
    themes: { corporate: "شركات", academic: "أكاديمي", modern: "عصري", minimal: "بسيط", creative: "إبداعي" },
    colors: { blue: "أزرق احترافي", green: "أخضر أعمال", dark: "داكن فاخر", gold: "ذهبي راقي", navy: "كحلي أكاديمي" },
    apiKey: "مفتاح API للذكاء الاصطناعي",
    apiKeyDesc: "أدخل مفتاح Gemini API الخاص بك لتفعيل ميزات الذكاء الاصطناعي. احصل عليه مجاناً من: https://aistudio.google.com/apikey",
    saveApiKey: "حفظ المفتاح",
    apiKeySaved: "تم حفظ المفتاح بنجاح!",
    enterApiKey: "أدخل مفتاح API",
    createAccount: "إنشاء حساب جديد",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    resetPassword: "إعادة تعيين كلمة المرور",
    sendResetLink: "إرسال رابط التعيين",
    resetEmailSent: "تم إرسال رابط التعيين إلى بريدك الإلكتروني",
    passwordMinLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    invalidEmail: "بريد إلكتروني غير صالح",
    loginError: "خطأ في تسجيل الدخول",
    signupError: "خطأ في إنشاء الحساب",
    logout: "تسجيل الخروج",
    loading: "جاري التحميل...",
    apiKeyRequired: "مفتاح API مطلوب. أضفه من الإعدادات"
  },
  en: {
    appName: "Easy Convert",
    login: "Login",
    signup: "Sign Up",
    guest: "Guest Access",
    forgotPass: "Forgot Password?",
    email: "Email Address",
    password: "Password",
    name: "Full Name",
    createPdf: "Create New PDF",
    myDocs: "My Documents",
    templates: "Templates",
    settings: "Settings",
    about: "About App",
    welcome: "Welcome",
    write: "Write",
    config: "Page Setup",
    export: "Export & Save",
    save: "Draft Save",
    title: "Document Title",
    header: "Header Text",
    footer: "Footer Text",
    pageSize: "Page Size",
    margins: "Margins",
    dark: "Dark Mode",
    light: "Light Mode",
    language: "Language",
    docSaved: "Saved Successfully!",
    share: "Share",
    print: "Print",
    download: "Download PDF",
    delete: "Delete",
    rename: "Rename",
    search: "Search document...",
    noDocs: "No saved documents.",
    schoolReport: "School Report",
    assignment: "Assignment",
    resume: "Resume",
    letter: "Formal Letter",
    invoice: "Invoice",
    notes: "Notes",
    selectTemplate: "Select a template to start",
    developer: "Developed by Hayyan Mohamed",
    aboutDesc: "A professional Arabic application that converts text into high-quality PDF documents quickly and easily.",
    aiFormat: "Smart Format (AI)",
    aiFormatDesc: "AI will automatically layout and design your document professionally without changing the text.",
    theme: "Design Theme",
    colorPalette: "Color Palette",
    applyFormat: "Apply Smart Format",
    formatting: "Formatting...",
    exporting: "Exporting PDF...",
    themes: { corporate: "Corporate", academic: "Academic", modern: "Modern", minimal: "Minimal", creative: "Creative" },
    colors: { blue: "Professional Blue", green: "Business Green", dark: "Premium Dark", gold: "Luxury Gold", navy: "Academic Navy" },
    apiKey: "AI API Key",
    apiKeyDesc: "Enter your Gemini API key. Get it free from: https://aistudio.google.com/apikey",
    saveApiKey: "Save API Key",
    apiKeySaved: "API Key saved successfully!",
    enterApiKey: "Enter API Key",
    createAccount: "Create New Account",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    resetPassword: "Reset Password",
    sendResetLink: "Send Reset Link",
    resetEmailSent: "Reset link sent to your email",
    passwordMinLength: "Password must be at least 6 characters",
    invalidEmail: "Invalid email address",
    loginError: "Login Error",
    signupError: "Signup Error",
    logout: "Logout",
    loading: "Loading...",
    apiKeyRequired: "API Key required. Add it from Settings"
  }
};

// --- محتوى القوالب ---
const templatesContent = {
  schoolReport: { title: "تقرير مدرسي", content: "<h1 style='text-align: center;'>تقرير أداء الطالب</h1><p><strong>اسم الطالب:</strong> _________________</p><p><strong>الصف:</strong> _________________</p><hr/><p><strong>الملاحظات الأكاديمية:</strong></p><p><br></p>" },
  assignment: { title: "واجب منزلي", content: "<h2>المادة: </h2><p><strong>التاريخ:</strong> </p><hr/><p><strong>السؤال الأول:</strong></p><p><br></p><p><strong>السؤال الثاني:</strong></p>" },
  resume: { title: "سيرة ذاتية", content: "<h1 style='text-align: center;'>الاسم الكامل</h1><p style='text-align: center;'>البريد الإلكتروني | رقم الهاتف</p><hr/><h3>الخبرات العملية:</h3><ul><li>...</li></ul><h3>التعليم:</h3><ul><li>...</li></ul>" },
  letter: { title: "رسالة رسمية", content: "<p>التاريخ: __/__/____</p><p>إلى السيد/ة: _____________</p><p><strong>الموضوع:</strong> _________________</p><p>تحية طيبة وبعد،</p><p><br></p><p>وتفضلوا بقبول فائق الاحترام،</p><p>التوقيع:</p>" },
  invoice: { title: "فاتورة", content: "<h1>فاتورة رقم #001</h1><p><strong>تاريخ الإصدار:</strong> </p><hr/><table style='width:100%; border-collapse: collapse;' border='1'><tr><th>الوصف</th><th>المبلغ</th></tr><tr><td>خدمات عامة</td><td>0.00</td></tr></table><h3 style='text-align: left;'>الإجمالي: 0.00</h3>" },
  notes: { title: "ملاحظات", content: "<h2>ملاحظات الاجتماع</h2><p><strong>التاريخ:</strong> </p><ul><li>النقطة الأولى:</li><li>النقطة الثانية:</li></ul>" }
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'ar');
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('app_user')));
  const [currentView, setCurrentView] = useState(user ? 'dashboard' : 'auth');
  const [documents, setDocuments] = useState(JSON.parse(localStorage.getItem('app_docs')) || []);
  const [activeDoc, setActiveDoc] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('user_api_key') || '');
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (!window.firebase) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }
        
        if (!window.firebase?.auth) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }

        if (!window.firebase.apps?.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        
        window.firebase.auth().onAuthStateChanged((fbUser) => {
          if (fbUser) {
            const u = { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName || fbUser.email?.split('@')[0], isGuest: false };
            setUser(u);
            localStorage.setItem('app_user', JSON.stringify(u));
          }
        });

        setFirebaseReady(true);
      } catch (error) {
        console.error('Firebase init error:', error);
      }
    };
    initFirebase();
  }, []);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    localStorage.setItem('app_theme', theme);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [lang, theme]);

  useEffect(() => { localStorage.setItem('app_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('app_docs', JSON.stringify(documents)); }, [documents]);

  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      script.onload = () => setPdfLibLoaded(true);
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    } else {
      setPdfLibLoaded(true);
    }
  }, []);

  const navigate = (view, doc = null) => { setCurrentView(view); if (doc) setActiveDoc(doc); };

  const logout = () => {
    if (window.firebase?.auth) window.firebase.auth().signOut();
    setUser(null);
    localStorage.removeItem('app_user');
    setCurrentView('auth');
  };

  const text = t[lang];
  const isDark = theme === 'dark';
  const isRtl = lang === 'ar';

  const themeClasses = {
    bgMain: isDark ? 'bg-gray-950' : 'bg-gray-50',
    textMain: isDark ? 'text-gray-100' : 'text-gray-900',
    cardBg: isDark ? 'bg-gray-900' : 'bg-white',
    primaryColor: 'bg-[#0f2c59]', 
    primaryText: 'text-[#0f2c59]',
    accentColor: 'bg-[#00b4d8]', 
    accentText: 'text-[#00b4d8]',
  };

  return (
    <div className={`min-h-screen font-sans ${themeClasses.bgMain} ${themeClasses.textMain} transition-colors duration-300 w-full overflow-x-hidden pb-20`}>
      {currentView === 'auth' && (
        <AuthScreen onLogin={(u) => { setUser(u); setCurrentView('dashboard'); }} text={text} themeClasses={themeClasses} isRtl={isRtl} firebaseReady={firebaseReady} />
      )}
      {currentView === 'dashboard' && (
        <DashboardScreen user={user} text={text} navigate={navigate} logout={logout} themeClasses={themeClasses} />
      )}
      {currentView === 'editor' && (
        <EditorScreen doc={activeDoc} text={text} navigate={navigate} onSave={(d) => { setDocuments(activeDoc?.id ? documents.map(x => x.id === d.id ? d : x) : [d, ...documents]); setActiveDoc(d); }} isDark={isDark} themeClasses={themeClasses} isRtl={isRtl} pdfLibLoaded={pdfLibLoaded} userApiKey={userApiKey} />
      )}
      {currentView === 'library' && (
        <LibraryScreen documents={documents} setDocuments={setDocuments} text={text} navigate={navigate} themeClasses={themeClasses} isRtl={isRtl} />
      )}
      {currentView === 'templates' && (
        <TemplatesScreen text={text} navigate={navigate} themeClasses={themeClasses} />
      )}
      {currentView === 'settings' && (
        <SettingsScreen text={text} navigate={navigate} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} themeClasses={themeClasses} userApiKey={userApiKey} setUserApiKey={setUserApiKey} />
      )}
      {currentView === 'about' && (
        <AboutScreen text={text} navigate={navigate} themeClasses={themeClasses} />
      )}
    </div>
  );
}

// ==========================================
// AUTH SCREEN - رسائل خطأ واضحة
// ==========================================
function AuthScreen({ onLogin, text, themeClasses, isRtl, firebaseReady }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور'); return; }
    setError(''); setLoading(true);
    try {
      const result = await window.firebase.auth().signInWithEmailAndPassword(email, password);
      onLogin({ uid: result.user.uid, email: result.user.email, name: result.user.displayName || email.split('@')[0], isGuest: false });
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('❌ لا يوجد حساب بهذا البريد الإلكتروني');
      else if (err.code === 'auth/wrong-password') setError('❌ كلمة المرور غير صحيحة');
      else if (err.code === 'auth/invalid-credential') setError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة');
      else if (err.code === 'auth/invalid-email') setError('❌ صيغة البريد الإلكتروني غير صحيحة');
      else if (err.code === 'auth/too-many-requests') setError('❌ محاولات كثيرة. انتظر قليلاً');
      else setError('❌ ' + err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور'); return; }
    if (password.length < 6) { setError('❌ كلمة المرور قصيرة جداً. 6 أحرف على الأقل'); return; }
    setError(''); setLoading(true);
    try {
      const result = await window.firebase.auth().createUserWithEmailAndPassword(email, password);
      if (name) await result.user.updateProfile({ displayName: name });
      onLogin({ uid: result.user.uid, email: result.user.email, name: name || email.split('@')[0], isGuest: false });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('❌ البريد الإلكتروني مستخدم بالفعل');
      else if (err.code === 'auth/weak-password') setError('❌ كلمة المرور ضعيفة');
      else if (err.code === 'auth/invalid-email') setError('❌ صيغة البريد الإلكتروني غير صحيحة');
      else setError('❌ ' + err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) { setError('❌ يرجى إدخال البريد الإلكتروني'); return; }
    setError(''); setLoading(true);
    try {
      await window.firebase.auth().sendPasswordResetEmail(email);
      setResetSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('❌ لا يوجد حساب بهذا البريد الإلكتروني');
      else setError('❌ ' + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    if (mode === 'login') handleLogin(e);
    else if (mode === 'signup') handleSignup(e);
    else handleForgotPassword(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f2c59] to-[#00b4d8]">
      <div className={`${themeClasses.cardBg} p-8 rounded-3xl shadow-2xl w-full max-w-md`}>
        <div className="flex justify-center mb-6">
          <div className={`${themeClasses.primaryColor} text-white p-4 rounded-full shadow-lg`}><FileText size={48} /></div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">{text.appName}</h1>
        <p className="text-center text-gray-500 mb-8">{mode === 'login' ? text.login : mode === 'signup' ? text.signup : text.forgotPass}</p>

        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 text-sm">⚠️ {error}</div>}
        {resetSent && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-green-600 text-sm text-center">✅ {text.resetEmailSent}<br/><button onClick={() => { setMode('login'); setResetSent(false); }} className="mt-2 text-[#00b4d8]">العودة لتسجيل الدخول</button></div>}

        {!resetSent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                <input type="text" placeholder={text.name} value={name} onChange={(e) => setName(e.target.value)} className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
              </div>
            )}
            <div className="relative">
              <Mail className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
              <input type="email" placeholder={text.email} value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
            </div>
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                <input type={showPassword ? "text" : "password"} placeholder={text.password} value={password} onChange={(e) => setPassword(e.target.value)} required className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-3 ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} outline-none focus:ring-2 focus:ring-[#00b4d8]`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} text-gray-400`}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            )}
            <button type="submit" disabled={loading} className={`w-full ${themeClasses.primaryColor} text-white py-3 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition disabled:opacity-50`}>
              {loading ? '⏳ جاري التحميل...' : mode === 'login' ? text.login : mode === 'signup' ? text.signup : text.sendResetLink}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center space-y-2">
          {mode === 'login' && <><button onClick={() => setMode('forgot')} className={`text-sm ${themeClasses.accentText}`}>{text.forgotPass}</button><button onClick={() => setMode('signup')} className="text-sm text-gray-500">{text.signup}</button></>}
          {mode === 'signup' && <button onClick={() => setMode('login')} className="text-sm text-gray-500">{text.login}</button>}
          {mode === 'forgot' && <button onClick={() => setMode('login')} className="text-sm text-gray-500">⬅ العودة</button>}
          <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
          <button onClick={() => onLogin({ name: 'Guest', isGuest: true })} className="flex items-center text-gray-600 dark:text-gray-400"><User size={18} className="mx-2"/> {text.guest}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD SCREEN
// ==========================================
function DashboardScreen({ user, text, navigate, logout, themeClasses }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 pt-4">
        <div><h2 className="text-sm text-gray-500">{text.welcome},</h2><h1 className="text-2xl font-bold">{user?.name}</h1></div>
        <button onClick={logout} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full text-red-500"><LogOut size={20} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DashboardCard icon={<FilePlus size={32} />} title={text.createPdf} color="bg-[#0f2c59]" textCol="text-white" onClick={() => navigate('editor')} />
        <DashboardCard icon={<Folder size={32} />} title={text.myDocs} color="bg-[#00b4d8]" textCol="text-white" onClick={() => navigate('library')} />
        <DashboardCard icon={<LayoutTemplate size={32} />} title={text.templates} color={themeClasses.cardBg} onClick={() => navigate('templates')} />
        <DashboardCard icon={<SettingsIcon size={32} />} title={text.settings} color={themeClasses.cardBg} onClick={() => navigate('settings')} />
      </div>
      <div className="mt-8">
        <div className={`${themeClasses.cardBg} p-6 rounded-3xl flex items-center justify-between cursor-pointer shadow-sm`} onClick={() => navigate('about')}>
          <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-xl text-[#0f2c59] dark:text-[#00b4d8]"><Info size={24} /></div><span className="font-bold text-lg">{text.about}</span></div>
          <ChevronRight size={24} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, color, textCol, onClick }) {
  return <div onClick={onClick} className={`${color} ${textCol||''} p-6 rounded-3xl aspect-square flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-md transition active:scale-95`}><div className="mb-4">{icon}</div><h3 className="font-bold">{title}</h3></div>;
}

// ==========================================
// EDITOR SCREEN - مع التنسيق الذكي المعدل
// ==========================================
function EditorScreen({ doc, text, navigate, onSave, isDark, themeClasses, isRtl, pdfLibLoaded, userApiKey }) {
  const [activeTab, setActiveTab] = useState('write');
  const [content, setContent] = useState(doc?.content || '');
  const [title, setTitle] = useState(doc?.title || text.createPdf);
  const [header, setHeader] = useState(doc?.header || '');
  const [footer, setFooter] = useState(doc?.footer || '');
  const [pageSize, setPageSize] = useState(doc?.pageSize || 'A4');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiTheme, setAiTheme] = useState('corporate');
  const [aiColor, setAiColor] = useState('blue');
  const editorRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => { if (editorRef.current && activeTab === 'write' && editorRef.current.innerHTML !== content) editorRef.current.innerHTML = content; }, [activeTab, content]);

  const handleInput = () => { if (editorRef.current) setContent(editorRef.current.innerHTML); };
  const execCmd = (cmd, val = null) => { document.execCommand(cmd, false, val); handleInput(); editorRef.current?.focus(); };

  const saveDoc = () => {
    const d = { id: doc?.id || Date.now().toString(), title, content, header, footer, pageSize, date: new Date().toISOString() };
    onSave(d);
    setToastMsg(text.docSaved);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const exportPDF = async () => {
    if (window.html2pdf && printRef.current) {
      setIsExporting(true);
      const el = printRef.current;
      el.style.display = 'block';
      try {
        const pdf = await window.html2pdf().set({ margin: [15,15,15,15], filename: `${title}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: pageSize.toLowerCase(), orientation: 'portrait' } }).from(el).outputPdf('blob');
        const url = URL.createObjectURL(pdf);
        const a = document.createElement('a'); a.href = url; a.download = `${title}.pdf`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToastMsg('تم التحميل!');
        setShowToast(true);
      } catch (e) { alert("خطأ في التصدير"); }
      el.style.display = 'none';
      setIsExporting(false);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleSmartFormat = async () => {
    const key = userApiKey || localStorage.getItem('user_api_key') || '';
    if (!key || key.trim() === '') {
      alert('❌ يرجى إدخال مفتاح API في الإعدادات أولاً');
      return;
    }

    setIsFormatting(true);

    const colorHexMap = { blue: '#1E3A8A', green: '#065F46', dark: '#1F2937', gold: '#B45309', navy: '#111827' };
    const selectedColorHex = colorHexMap[aiColor] || '#1E3A8A';

    const systemInstruction = `You are an expert document designer. Format the following text into a professional HTML document. RULES: 1. DO NOT change text content. 2. Use INLINE CSS only. 3. Return ONLY raw HTML, no markdown. 4. Make it RTL for Arabic. 5. Primary color: ${selectedColorHex}. 6. Style: ${text.themes[aiTheme]}. Add beautiful formatting with headers, borders, cards, and proper spacing.`;

    try {
      const rawText = editorRef.current?.innerHTML || content || '<p>أدخل النص هنا</p>';
      const formattedHtml = await generateWithRetry(rawText, systemInstruction, key);
      
      let cleanHtml = formattedHtml
        .replace(/```html\n?/g, '')
        .replace(/```/g, '')
        .trim();

      if (!cleanHtml || cleanHtml.length < 10) {
        throw new Error('استجابة فارغة');
      }

      setContent(cleanHtml);
      setShowAiModal(false);
      setActiveTab('preview');

      const d = { id: doc?.id || Date.now().toString(), title, content: cleanHtml, header, footer, pageSize, date: new Date().toISOString() };
      onSave(d);

      setToastMsg('✅ تم التنسيق بنجاح!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Format error:', err);
      alert('❌ خطأ في التنسيق:\n' + (err.message || 'تأكد من صحة مفتاح API'));
    }
    setIsFormatting(false);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <div className={`p-4 ${themeClasses.cardBg} flex items-center justify-between shadow-sm z-10 sticky top-0`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">{isRtl ? <ChevronRight /> : <ChevronLeft />}</button>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-transparent font-bold text-lg outline-none w-24 md:w-auto" placeholder={text.title} />
        </div>
        <div className="flex gap-1 md:gap-2">
          <button onClick={() => setShowAiModal(true)} className="px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-md hover:scale-105 transition"><Wand2 size={16} /> <span className="hidden md:inline">{text.aiFormat}</span></button>
          <button onClick={exportPDF} disabled={isExporting} className={`px-4 py-2 rounded-xl ${themeClasses.primaryColor} text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50`}>{isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} <span className="hidden md:inline">{isExporting ? text.exporting : text.export}</span></button>
        </div>
      </div>

      <div className="flex px-4 py-2 gap-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        {['write','config','preview'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 px-2 font-bold capitalize ${activeTab === tab ? `border-b-2 border-[#00b4d8] ${themeClasses.accentText}` : 'text-gray-500'}`}>{tab === 'write' ? text.write : tab === 'config' ? text.config : 'Preview'}</button>)}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-200 dark:bg-black p-4 md:p-8">
        <div className={`${activeTab === 'write' ? 'block' : 'hidden'} max-w-4xl mx-auto flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden`}>
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
            <ToolBtn icon={<Bold size={16}/>} onClick={() => execCmd('bold')} />
            <ToolBtn icon={<Italic size={16}/>} onClick={() => execCmd('italic')} />
            <ToolBtn icon={<Underline size={16}/>} onClick={() => execCmd('underline')} />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            <ToolBtn icon={<AlignLeft size={16}/>} onClick={() => execCmd('justifyLeft')} />
            <ToolBtn icon={<AlignCenter size={16}/>} onClick={() => execCmd('justifyCenter')} />
            <ToolBtn icon={<AlignRight size={16}/>} onClick={() => execCmd('justifyRight')} />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            <ToolBtn icon={<List size={16}/>} onClick={() => execCmd('insertUnorderedList')} />
            <ToolBtn icon={<ListOrdered size={16}/>} onClick={() => execCmd('insertOrderedList')} />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
            <select onChange={(e) => execCmd('formatBlock', e.target.value)} className="text-sm bg-transparent border border-gray-300 rounded px-1 dark:text-white dark:border-gray-600"><option value="P">Normal</option><option value="H1">Heading 1</option><option value="H2">Heading 2</option><option value="H3">Heading 3</option></select>
            <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
          </div>
          <div ref={editorRef} contentEditable onInput={handleInput} onBlur={handleInput} className="flex-1 p-6 md:p-10 outline-none overflow-y-auto text-gray-900 dark:text-gray-100 min-h-[50vh]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}></div>
        </div>

        <div className={`${activeTab === 'config' ? 'block' : 'hidden'} max-w-lg mx-auto ${themeClasses.cardBg} rounded-2xl shadow-lg p-6 space-y-6`}>
          <div><label className="block text-sm font-bold text-gray-500 mb-2">{text.pageSize}</label><select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none"><option value="A4">A4</option><option value="A5">A5</option><option value="Letter">Letter</option></select></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-2">{text.header}</label><input type="text" value={header} onChange={(e) => setHeader(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-2">{text.footer}</label><input type="text" value={footer} onChange={(e) => setFooter(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none" /></div>
        </div>

        <div className={`${activeTab === 'preview' ? 'flex' : 'hidden'} justify-center items-start pb-10`}>
          <div className="bg-white shadow-2xl relative" style={{ width: pageSize === 'A4' ? '210mm' : pageSize === 'A5' ? '148mm' : '8.5in', minHeight: pageSize === 'A4' ? '297mm' : pageSize === 'A5' ? '210mm' : '11in', padding: '15mm', transform: 'scale(0.9)', transformOrigin: 'top center', color: 'black', direction: isRtl ? 'rtl' : 'ltr' }}>
            {header && <div className="text-gray-500 text-sm border-b pb-2 mb-6 text-center font-bold">{header}</div>}
            <div dangerouslySetInnerHTML={{__html: content}} className="pdf-content prose max-w-none break-words"></div>
            {footer && <div className="text-gray-500 text-sm border-t pt-2 mt-6 text-center absolute bottom-[15mm] left-[15mm] right-[15mm] font-bold">{footer}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <div ref={printRef} style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: '#fff', direction: isRtl ? 'rtl' : 'ltr', lineHeight: '1.6' }}>
          {header && <div style={{ color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{header}</div>}
          <div dangerouslySetInnerHTML={{__html: content}} style={{ wordWrap: 'break-word' }}></div>
          {footer && <div style={{ color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '30px', textAlign: 'center', fontWeight: 'bold' }}>{footer}</div>}
        </div>
      </div>

      {showAiModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${themeClasses.cardBg} w-full max-w-md rounded-3xl p-6 shadow-2xl`}>
            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3 text-purple-500"><Wand2 size={24} /><h2 className="text-xl font-bold text-gray-900 dark:text-white">{text.aiFormat}</h2></div><button onClick={() => setShowAiModal(false)} className="text-gray-400"><X size={24} /></button></div>
            <p className="text-sm text-gray-500 mb-6">{text.aiFormatDesc}</p>
            <div className="space-y-6">
              <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"><Layout size={16} /> {text.theme}</label><div className="grid grid-cols-2 gap-2">{Object.keys(text.themes).map(k => <button key={k} onClick={() => setAiTheme(k)} className={`p-2 rounded-xl text-sm border-2 transition ${aiTheme === k ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 font-bold' : 'border-gray-200 dark:border-gray-700 text-gray-600'}`}>{text.themes[k]}</button>)}</div></div>
              <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"><Palette size={16} /> {text.colorPalette}</label><div className="grid grid-cols-2 gap-2">{Object.keys(text.colors).map(k => { const bg = { blue: 'bg-blue-500', green: 'bg-emerald-600', dark: 'bg-gray-800', gold: 'bg-amber-500', navy: 'bg-indigo-900' }; return <button key={k} onClick={() => setAiColor(k)} className={`p-2 rounded-xl text-sm border-2 flex items-center gap-2 transition ${aiColor === k ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 font-bold' : 'border-gray-200 dark:border-gray-700 text-gray-600'}`}><span className={`w-4 h-4 rounded-full ${bg[k]}`}></span>{text.colors[k]}</button>; })}</div></div>
            </div>
            <button onClick={handleSmartFormat} disabled={isFormatting} className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-70">{isFormatting ? <><Loader2 size={20} className="animate-spin" />{text.formatting}</> : <><Wand2 size={20} />{text.applyFormat}</>}</button>
          </div>
        </div>
      )}

      {showToast && <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-50"><Check size={20} /> {toastMsg}</div>}
    </div>
  );
}

function ToolBtn({ icon, onClick }) { return <button onClick={onClick} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition">{icon}</button>; }

// ==========================================
// LIBRARY SCREEN
// ==========================================
function LibraryScreen({ documents, setDocuments, text, navigate, themeClasses, isRtl }) {
  const [search, setSearch] = useState('');
  const filteredDocs = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={text.myDocs} navigate={navigate} themeClasses={themeClasses} isRtl={isRtl} />
      <div className="p-6">
        <div className="relative mb-6"><input type="text" placeholder={text.search} value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full ${themeClasses.cardBg} rounded-xl py-3 px-4 outline-none shadow-sm focus:ring-2 focus:ring-[#00b4d8]`} /></div>
        {filteredDocs.length === 0 ? <div className="text-center text-gray-400 mt-20 flex flex-col items-center"><Folder size={64} className="mb-4 opacity-50" /><p>{text.noDocs}</p></div> :
          <div className="space-y-4">{filteredDocs.map(doc => (
            <div key={doc.id} className={`${themeClasses.cardBg} p-4 rounded-2xl shadow-sm flex items-center justify-between`}>
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => navigate('editor', doc)}><div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-xl text-[#0f2c59] dark:text-[#00b4d8]"><FileText size={24} /></div><div><h3 className="font-bold text-lg">{doc.title}</h3><p className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString()}</p></div></div>
              <button onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><Trash2 size={20} /></button>
            </div>
          ))}</div>
        }
      </div>
    </div>
  );
}

// ==========================================
// TEMPLATES SCREEN
// ==========================================
function TemplatesScreen({ text, navigate, themeClasses }) {
  const templates = [
    { id: 'schoolReport', icon: <FileText size={32}/>, title: text.schoolReport, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' },
    { id: 'assignment', icon: <Edit3 size={32}/>, title: text.assignment, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
    { id: 'resume', icon: <User size={32}/>, title: text.resume, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { id: 'letter', icon: <Mail size={32}/>, title: text.letter, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
    { id: 'invoice', icon: <ListOrdered size={32}/>, title: text.invoice, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    { id: 'notes', icon: <AlignLeft size={32}/>, title: text.notes, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={text.templates} navigate={navigate} themeClasses={themeClasses} />
      <div className="p-6"><p className="text-gray-500 mb-6">{text.selectTemplate}</p>
        <div className="grid grid-cols-2 gap-4">{templates.map(tpl => (
          <div key={tpl.id} onClick={() => { const c = templatesContent[tpl.id]; navigate('editor', { title: c.title, content: c.content, pageSize: 'A4' }); }} className={`${themeClasses.cardBg} p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition cursor-pointer`}>
            <div className={`p-4 rounded-2xl mb-4 ${tpl.color}`}>{tpl.icon}</div><h3 className="font-bold">{tpl.title}</h3>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ==========================================
// SETTINGS SCREEN
// ==========================================
function SettingsScreen({ text, navigate, lang, setLang, theme, setTheme, themeClasses, userApiKey, setUserApiKey }) {
  const [apiKeyInput, setApiKeyInput] = useState(userApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={text.settings} navigate={navigate} themeClasses={themeClasses} />
      <div className="p-6 space-y-6">
        <div className={`${themeClasses.cardBg} rounded-3xl p-6 shadow-sm space-y-6`}>
          <div className="flex justify-between items-center"><span className="font-bold">{text.language}</span><div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1"><button onClick={() => setLang('ar')} className={`px-4 py-2 rounded-lg text-sm font-bold ${lang==='ar'?'bg-white dark:bg-gray-700 shadow text-[#0f2c59]':'text-gray-500'}`}>عربي</button><button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm font-bold ${lang==='en'?'bg-white dark:bg-gray-700 shadow text-[#0f2c59]':'text-gray-500'}`}>English</button></div></div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
          <div className="flex justify-between items-center"><span className="font-bold">{theme==='dark'?text.dark:text.light}</span><div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1"><button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg text-sm font-bold ${theme==='light'?'bg-white dark:bg-gray-700 shadow text-[#0f2c59]':'text-gray-500'}`}>{text.light}</button><button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg text-sm font-bold ${theme==='dark'?'bg-white dark:bg-gray-700 shadow text-[#0f2c59]':'text-gray-500'}`}>{text.dark}</button></div></div>
        </div>
        <div className={`${themeClasses.cardBg} rounded-3xl p-6 shadow-sm space-y-4`}>
          <div className="flex items-center gap-2"><Key size={20} className="text-[#00b4d8]" /><h3 className="font-bold text-lg">{text.apiKey}</h3></div>
          <p className="text-sm text-gray-500">{text.apiKeyDesc}</p>
          <div className="relative"><input type={showApiKey?"text":"password"} value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder={text.enterApiKey} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-[#00b4d8]" /><button onClick={() => setShowApiKey(!showApiKey)} className="absolute top-3 right-3 text-gray-400">{showApiKey?<EyeOff size={20}/>:<Eye size={20}/>}</button></div>
          <button onClick={() => { setUserApiKey(apiKeyInput); localStorage.setItem('user_api_key', apiKeyInput); setApiKeySaved(true); setTimeout(() => setApiKeySaved(false), 2000); }} className="w-full bg-[#00b4d8] text-white py-2 rounded-xl font-bold">{text.saveApiKey}</button>
          {apiKeySaved && <div className="flex items-center gap-2 text-green-500 text-sm"><Check size={16} />{text.apiKeySaved}</div>}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABOUT SCREEN
// ==========================================
function AboutScreen({ text, navigate, themeClasses }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={text.about} navigate={navigate} themeClasses={themeClasses} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-[#0f2c59] rounded-full flex items-center justify-center text-white shadow-2xl mb-8"><FileText size={64} /></div>
        <h1 className="text-3xl font-bold mb-2">{text.appName}</h1>
        <p className="text-gray-500 mb-8 max-w-sm">{text.aboutDesc}</p>
        <div className={`${themeClasses.cardBg} px-6 py-4 rounded-2xl shadow-sm`}><p className="font-bold text-[#00b4d8]">{text.developer}</p><p className="text-sm text-gray-400 mt-1">Version 2.0.0</p></div>
      </div>
    </div>
  );
}

function TopBar({ title, navigate, themeClasses, isRtl }) {
  return (
    <div className={`p-4 ${themeClasses.cardBg} flex items-center shadow-sm sticky top-0 z-10`}>
      <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-4">{document.documentElement.dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}</button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
