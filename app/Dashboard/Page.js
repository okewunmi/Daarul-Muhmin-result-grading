'use client'
import { useState, useEffect } from 'react';
import { 
  Sun, Moon, BookOpen, Calendar, GraduationCap, Users, Settings, 
  Plus, LogOut, Edit2, Trash2, Eye, X, Check, BookA, FileText, Printer, Download
} from 'lucide-react';
import { 
  academicSessionsManager,
  classesManager,
  studentsManager,
  subjectsManager,
  resultsManager,
  gradingSystem
} from '../../lib/appwrite';

// ============================================
// REUSABLE COMPONENTS
// ============================================

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-green-500 hover:shadow-lg',
    secondary: 'bg-gray-700 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, required = false, type = 'text', dir = 'ltr' }) => (
  <div className="mb-4">
    <label className="block text-gray-300 mb-2 text-sm sm:text-base">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      dir={dir}
      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
      required={required}
    />
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-8 sm:py-12">
    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
      <Icon className="text-gray-400" size={32} />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 text-sm sm:text-base">{description}</p>
    {action}
  </div>
);


const toArabicNumerals = (num) => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
};

// Number to Arabic words converter (Explicit 0-100)
const numberToArabicWords = (num) => {
  // Convert to integer
  const n = parseInt(num);
  
  // Explicit mapping for all numbers 0-100
  switch(n) {
    case 0: return 'صفر';
    case 1: return 'واحد';
    case 2: return 'اثنان';
    case 3: return 'ثلاثة';
    case 4: return 'أربعة';
    case 5: return 'خمسة';
    case 6: return 'ستة';
    case 7: return 'سبعة';
    case 8: return 'ثمانية';
    case 9: return 'تسعة';
    case 10: return 'عشرة';
    case 11: return 'أحد عشر';
    case 12: return 'اثنا عشر';
    case 13: return 'ثلاثة عشر';
    case 14: return 'أربعة عشر';
    case 15: return 'خمسة عشر';
    case 16: return 'ستة عشر';
    case 17: return 'سبعة عشر';
    case 18: return 'ثمانية عشر';
    case 19: return 'تسعة عشر';
    case 20: return 'عشرون';
    case 21: return 'واحد وعشرون';
    case 22: return 'اثنان وعشرون';
    case 23: return 'ثلاثة وعشرون';
    case 24: return 'أربعة وعشرون';
    case 25: return 'خمسة وعشرون';
    case 26: return 'ستة وعشرون';
    case 27: return 'سبعة وعشرون';
    case 28: return 'ثمانية وعشرون';
    case 29: return 'تسعة وعشرون';
    case 30: return 'ثلاثون';
    case 31: return 'واحد وثلاثون';
    case 32: return 'اثنان وثلاثون';
    case 33: return 'ثلاثة وثلاثون';
    case 34: return 'أربعة وثلاثون';
    case 35: return 'خمسة وثلاثون';
    case 36: return 'ستة وثلاثون';
    case 37: return 'سبعة وثلاثون';
    case 38: return 'ثمانية وثلاثون';
    case 39: return 'تسعة وثلاثون';
    case 40: return 'أربعون';
    case 41: return 'واحد وأربعون';
    case 42: return 'اثنان وأربعون';
    case 43: return 'ثلاثة وأربعون';
    case 44: return 'أربعة وأربعون';
    case 45: return 'خمسة وأربعون';
    case 46: return 'ستة وأربعون';
    case 47: return 'سبعة وأربعون';
    case 48: return 'ثمانية وأربعون';
    case 49: return 'تسعة وأربعون';
    case 50: return 'خمسون';
    case 51: return 'واحد وخمسون';
    case 52: return 'اثنان وخمسون';
    case 53: return 'ثلاثة وخمسون';
    case 54: return 'أربعة وخمسون';
    case 55: return 'خمسة وخمسون';
    case 56: return 'ستة وخمسون';
    case 57: return 'سبعة وخمسون';
    case 58: return 'ثمانية وخمسون';
    case 59: return 'تسعة وخمسون';
    case 60: return 'ستون';
    case 61: return 'واحد وستون';
    case 62: return 'اثنان وستون';
    case 63: return 'ثلاثة وستون';
    case 64: return 'أربعة وستون';
    case 65: return 'خمسة وستون';
    case 66: return 'ستة وستون';
    case 67: return 'سبعة وستون';
    case 68: return 'ثمانية وستون';
    case 69: return 'تسعة وستون';
    case 70: return 'سبعون';
    case 71: return 'واحد وسبعون';
    case 72: return 'اثنان وسبعون';
    case 73: return 'ثلاثة وسبعون';
    case 74: return 'أربعة وسبعون';
    case 75: return 'خمسة وسبعون';
    case 76: return 'ستة وسبعون';
    case 77: return 'سبعة وسبعون';
    case 78: return 'ثمانية وسبعون';
    case 79: return 'تسعة وسبعون';
    case 80: return 'ثمانون';
    case 81: return 'واحد وثمانون';
    case 82: return 'اثنان وثمانون';
    case 83: return 'ثلاثة وثمانون';
    case 84: return 'أربعة وثمانون';
    case 85: return 'خمسة وثمانون';
    case 86: return 'ستة وثمانون';
    case 87: return 'سبعة وثمانون';
    case 88: return 'ثمانية وثمانون';
    case 89: return 'تسعة وثمانون';
    case 90: return 'تسعون';
    case 91: return 'واحد وتسعون';
    case 92: return 'اثنان وتسعون';
    case 93: return 'ثلاثة وتسعون';
    case 94: return 'أربعة وتسعون';
    case 95: return 'خمسة وتسعون';
    case 96: return 'ستة وتسعون';
    case 97: return 'سبعة وتسعون';
    case 98: return 'ثمانية وتسعون';
    case 99: return 'تسعة وتسعون';
    case 100: return 'مائة';
    default: return String(n); // Return number as string if outside range
  }
};

const ReportCardTemplate = ({ subjects = [] }) => {
  
  const handlePrint = () => {
    const printContent = document.getElementById('report-template');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Card Template</title>
          <meta charset="utf-8">
          <style>
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: sans-serif; background: white; }

            .p-6 { padding: 1.5rem; }
            .p-2 { padding: 0.5rem; }
            .p-1 { padding: 0.25rem; }
            .p-1\\.5 { padding: 0.375rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
            .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
            .mr-2 { margin-right: 0.5rem; }
            .mr-20 { margin-right: 5rem; }
            .ml-20 { margin-left: 5rem; }

            .flex { display: flex; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .items-end { align-items: flex-end; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .flex-1 { flex: 1 1 0%; }
            .flex-shrink-0 { flex-shrink: 0; }
            .gap-1 { gap: 0.25rem; }
            .gap-3 { gap: 0.75rem; }
            .gap-6 { gap: 1.5rem; }

            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

            .w-full { width: 100%; }
            .w-6 { width: 1.5rem; }
            .w-12 { width: 3rem; }
            .w-14 { width: 3.5rem; }
            .w-16 { width: 4rem; }
            .w-20 { width: 5rem; }
            .h-5 { height: 1.25rem; }
            .h-16 { height: 4rem; }
            .min-h-\\[18px\\] { min-height: 18px; }
            .min-h-\\[20px\\] { min-height: 20px; }
            .min-h-\\[22px\\] { min-height: 22px; }
            .min-h-\\[24px\\] { min-height: 24px; }

            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
            .z-0 { z-index: 0; }
            .z-10 { z-index: 10; }
            .pointer-events-none { pointer-events: none; }
            .opacity-5 { opacity: 0.05; }

            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .whitespace-nowrap { white-space: nowrap; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-base { font-size: 1rem; }
            .text-\\[11px\\] { font-size: 11px; }
            .text-\\[10px\\] { font-size: 10px; }
            .text-\\[9px\\] { font-size: 9px; }
            .text-\\[8px\\] { font-size: 8px; }

            .bg-white { background-color: #ffffff; }
            .bg-gray-50 { background-color: #f9fafb; }
            .text-red-600 { color: #dc2626; }
            .text-gray-600 { color: #4b5563; }

            .object-contain { object-fit: contain; }

            table { border-collapse: collapse; width: 100%; border: 1px solid black; }
            th, td { border-left: 1px solid black; padding: 0.25rem; }
            tr { border-bottom: 1px solid black; }
            thead tr { border-bottom: 1px solid black; }

            .border-b.border-dotted {
              border-top: none !important;
              border-left: none !important;
              border-right: none !important;
              border-bottom: 1px dotted #4b5563 !important;
            }

            .border-b { border-bottom: 1px solid; }
            .border-dotted { border-style: dotted; }
            .border-gray-600 { border-color: #4b5563; }
            .border-black { border-color: black; }
            .border-l { border-left: 1px solid black; }
            .border-t { border-top: 1px solid black; }

            @page { margin: 0.5cm; size: A4 portrait; }
            @media print {
              table { page-break-inside: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Print Button */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b print:hidden">
        <h3 className="text-lg font-bold text-gray-800">Report Card Template</h3>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Printer size={18} />
          Print Template
        </button>
      </div>

      {/* Template Preview */}
      <div className="p-6 bg-white relative" id="report-template">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
          <div className="w-50 h-50 flex items-center justify-center">
            <img
              src="/school-logo.jpg"
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-3 bg-gray-50 p-2">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mt-1">
              <img
                src="/school-logo.jpg"
                alt="School Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center px-2">
              <p className="text-[10px] mb-1">بسم الله الرحمن الرحيم</p>
              <h1 className="text-sm font-bold mb-1">معهد دار المؤمن للدراسات العربية والإسلامية</h1>
              <h2 className="text-xs font-bold mb-1">
                DAARUL MUHMIN INSTITUTE OF ARABIC AND ISLAMIC STUDIES
              </h2>
              <div className="text-[10px] font-semibold py-1">
                <span>REPORT SHEET كشف الدرجات</span>
                <span className="mx-3"></span>
                <span>EXAMINATION OFFICE إدارة الإمتحانات</span>
              </div>
            </div>

            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mt-1">
              <img
                src="/school-logo.jpg"
                alt="School Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Student Info - Empty Fields */}
          <div className="mb-3 text-[11px]">

            {/* Name Row */}
            <div className="flex items-center mb-2">
              <span className="font-semibold w-14 text-[10px]">Name:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 px-2 text-[10px] min-h-[20px]"></span>
              <span className="mr-2 text-[10px]" dir="rtl">اسم الطالب</span>
            </div>

            {/* Session Row */}
            <div className="flex items-center mb-2">
              <span className="font-semibold w-14 text-[10px]">Session:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 px-2 text-[10px] min-h-[20px]"></span>
              <span className="mr-2 text-[10px]" dir="rtl">العام الدراسي</span>
            </div>

            {/* Position / No. in Class / Class Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center flex-1">
                <span className="font-semibold whitespace-nowrap text-[10px]">Position:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 min-h-[20px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[10px]">الترتيب</span>
              </div>

              <div className="flex items-center flex-1">
                <span className="font-semibold whitespace-nowrap text-[9px]">No. in Class:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 min-h-[20px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[9px]">عدد الطلبة</span>
              </div>

              <div className="flex items-center flex-1">
                <span className="font-semibold whitespace-nowrap text-[9px]">Class:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 min-h-[20px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[9px]">الصف</span>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <table className="w-full border border-black text-[9px] mb-3" dir="rtl">
            <thead>
              <tr className="border-b border-black">
                <th className="border-l border-black p-1 w-6 text-center">ت</th>
                <th className="border-l border-black p-1 text-center">المواد الدراسية SUBJECT</th>
                <th className="border-l border-black p-1 w-12 text-center">الدرجة</th>
                <th className="border-l border-black p-1 w-12 text-center">رقماً</th>
                <th className="border-l border-black p-1 w-20 text-center">كتابة</th>
                <th className="border-l border-black p-1 w-16 text-center">التقدير</th>
                <th className="p-1 w-14 text-center">ملحوظة</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject.$id} className="border-b border-black">
                  <td className="border-l border-black p-1 text-center">{index + 1}</td>
                  <td className="border-l border-black p-1">
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[9px]">{subject.arabicName}</span>
                      <span className="text-gray-600 text-left text-[8px]">{subject.englishName}</span>
                    </div>
                  </td>
                  <td className="border-l border-black p-1 text-center font-bold">100</td>
                  <td className="border-l border-black p-1 text-center"></td>
                  <td className="border-l border-black p-1 text-center"></td>
                  <td className="border-l border-black p-1 text-center"></td>
                  <td className="p-1 text-center"></td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="border-t border-black font-bold">
                <td className="border-l border-black p-2 text-center text-[9px]" colSpan="2">
                  المجموع الكلي <span className="mr-20"></span> TOTAL
                </td>
                <td className="border-l border-black p-2 text-center">
                  {subjects.length * 100}
                </td>
                <td className="p-2 text-center" colSpan="4"></td>
              </tr>

              {/* Percentage Row */}
              <tr className="border-t border-black font-bold">
                <td className="border-l border-black p-2 text-center text-[9px]" colSpan="2">
                  النسبة المئوية <span className="mr-20"></span> PERCENTAGE
                </td>
                <td className="p-2 text-center" colSpan="5"></td>
              </tr>

              {/* Grade Row */}
              <tr className="border-t border-black font-bold">
                <td className="border-l border-black p-2 text-center text-[9px]" colSpan="2">
                  التقدير العام <span className="mr-20"></span> GRADE
                </td>
                <td className="p-2 text-center" colSpan="5"></td>
              </tr>
            </tbody>
          </table>

          {/* Next Term & Promoted */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-[10px]">
            <div className="flex items-center">
              <span className="font-semibold whitespace-nowrap text-[10px]">Next Term Begins:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[20px]"></span>
              <span dir="rtl" className="whitespace-nowrap text-[10px]">بداية الفصل الدراسي الجديد</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold whitespace-nowrap text-[10px]">Promoted:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[20px]"></span>
              <span dir="rtl" className="whitespace-nowrap text-[10px]">منقول إلى</span>
            </div>
          </div>

          {/* Teacher's Remark */}
          <div className="mb-3 text-[10px]">
            <div className="flex items-center mb-2">
              <span className="font-semibold whitespace-nowrap text-[10px]">Class Teacher's Remark:</span>
              <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[20px]"></span>
              <span dir="rtl" className="whitespace-nowrap text-[10px]">ملاحظة المدرس</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 text-[10px]">
            <div>
              <div className="flex items-center mb-2">
                <span className="font-semibold whitespace-nowrap text-[10px]">Principal's Sign:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 mx-1 min-h-[24px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[10px]">توقيع الوكيل</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold whitespace-nowrap text-[10px]">Date:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[18px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[10px]">التاريخ</span>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <span className="font-semibold whitespace-nowrap text-[10px]">Signature:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 mx-1 min-h-[24px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[10px]">التوقيع</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold whitespace-nowrap text-[10px]">Stamp:</span>
                <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[18px]"></span>
                <span dir="rtl" className="whitespace-nowrap text-[10px]">الختم</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const ReportCardModal = ({ isOpen, onClose, student, session, classInfo, subjects }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      loadReportCardData();
    }
  }, [student, isOpen]);

  
const loadReportCardData = async () => {
  setLoading(true);
  try {
    if (!student?.classId) {
      throw new Error('Student has no classId');
    }

    // ✅ Use already-imported managers directly
    const [resultsResponse, classStudentsResponse] = await Promise.all([
      resultsManager.getByStudent(student.$id),
      studentsManager.getByClass(student.classId)
    ]);

    if (resultsResponse.success && classStudentsResponse.success) {
      const results = resultsResponse.results;
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const totalMax = results.length * 100;
      const percentage = results.length > 0 
        ? ((totalScore / totalMax) * 100).toFixed(2) 
        : 0;

      const classPosition = await calculateClassPosition(
        student.$id,
        classStudentsResponse.students
      );

      const overallGrade = calculateGrade(parseFloat(percentage));

      setReportData({
        results,
        totalScore,
        totalMax,
        percentage,
        overallGrade,
        classPosition,
        totalStudents: classStudentsResponse.students.length
      });
    } else {
      // Log what actually failed
      console.error('Results response:', resultsResponse);
      console.error('Class students response:', classStudentsResponse);
      throw new Error(
        resultsResponse.message || 
        classStudentsResponse.message || 
        'Failed to fetch data'
      );
    }
  } catch (error) {
    console.error('Error loading report card:', error);
    alert('Failed to load report card data: ' + error.message);
  } finally {
    setLoading(false);
  }
};
  
  
const calculateClassPosition = async (studentId, classStudents) => {
  try {
    const studentsWithScores = await Promise.all(
      classStudents.map(async (s) => {
        const res = await resultsManager.getByStudent(s.$id); // use imported directly
        const total = res.success
          ? res.results.reduce((sum, r) => sum + r.score, 0)
          : 0;
        return { studentId: s.$id, totalScore: total };
      })
    );

    studentsWithScores.sort((a, b) => b.totalScore - a.totalScore);
    return studentsWithScores.findIndex(s => s.studentId === studentId) + 1;
  } catch (error) {
    console.error('Error calculating position:', error);
    return 0;
  }
};

const handlePrint = () => {
  const printContent = document.getElementById('report-card-print-area');
  if (!printContent) return;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Report Card - ${student.fullName}</title>
        <meta charset="utf-8">
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: sans-serif; background: white; }

          /* Layout */
          .p-6 { padding: 1.5rem; }
          .p-2 { padding: 0.5rem; }
          .p-1 { padding: 0.25rem; }
          .p-1\\.5 { padding: 0.375rem; }
          .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
          .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
          .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
          .mb-1 { margin-bottom: 0.25rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mt-1 { margin-top: 0.25rem; }
          .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
          .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
          .mr-2 { margin-right: 0.5rem; }
          .mr-20 { margin-right: 5rem; }
          .ml-20 { margin-left: 5rem; }

          /* Flexbox */
          .flex { display: flex; }
          .items-center { align-items: center; }
          .items-start { align-items: flex-start; }
          .items-end { align-items: flex-end; }
          .justify-center { justify-content: center; }
          .justify-between { justify-content: space-between; }
          .flex-1 { flex: 1 1 0%; }
          .flex-shrink-0 { flex-shrink: 0; }
          .gap-1 { gap: 0.25rem; }
          .gap-3 { gap: 0.75rem; }
          .gap-6 { gap: 1.5rem; }

          /* Grid */
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

          /* Sizing */
          .w-full { width: 100%; }
          .w-6 { width: 1.5rem; }
          .w-12 { width: 3rem; }
          .w-14 { width: 3.5rem; }
          .w-16 { width: 4rem; }
          .w-20 { width: 5rem; }
          .h-5 { height: 1.25rem; }
          .h-16 { height: 4rem; }
          .min-h-\\[18px\\] { min-height: 18px; }
          .min-h-\\[20px\\] { min-height: 20px; }
          .min-h-\\[22px\\] { min-height: 22px; }
          .min-h-\\[24px\\] { min-height: 24px; }

          /* Position */
          .relative { position: relative; }
          .absolute { position: absolute; }
          .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
          .z-0 { z-index: 0; }
          .z-10 { z-index: 10; }
          .pointer-events-none { pointer-events: none; }
          .opacity-5 { opacity: 0.05; }

          /* Typography */
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .whitespace-nowrap { white-space: nowrap; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .text-sm { font-size: 0.875rem; }
          .text-xs { font-size: 0.75rem; }
          .text-base { font-size: 1rem; }
          .text-\\[11px\\] { font-size: 11px; }
          .text-\\[10px\\] { font-size: 10px; }
          .text-\\[9px\\] { font-size: 9px; }
          .text-\\[8px\\] { font-size: 8px; }

          /* Colors */
          .bg-white { background-color: #ffffff; }
          .bg-gray-50 { background-color: #f9fafb; }
          .text-red-600 { color: #dc2626; }
          .text-gray-600 { color: #4b5563; }

          /* Images */
          .object-contain { object-fit: contain; }

          /* BORDERS - carefully separated to avoid dotted on all sides */
          /* Table borders - solid */
          table { border-collapse: collapse; width: 100%; border: 1px solid black; }
          th, td { border-left: 1px solid black; padding: 0.25rem; }
          tr { border-bottom: 1px solid black; }
          thead tr { border-bottom: 1px solid black; }

          /* Field underlines - ONLY bottom border, dotted */
          .border-b.border-dotted {
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: 1px dotted #4b5563 !important;
          }

          /* Standalone border classes */
          .border-b { border-bottom: 1px solid; }
          .border-dotted { border-style: dotted; }
          .border-gray-600 { border-color: #4b5563; }
          .border-black { border-color: black; }
          .border-l { border-left: 1px solid black; }
          .border-t { border-top: 1px solid black; }

          @page { margin: 0.5cm; size: A4 portrait; }
          @media print {
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        <\/script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

  
  
  const getPositionSuffix = (position) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  const calculateGrade = (score) => {
    if (score >= 90) return { english: 'Excellent', arabic: 'ممتاز', remarkArabic: 'ناجح', teacherRemarkArabic: 'امتياز' };
    if (score >= 80) return { english: 'Very Good', arabic: 'جيد جداً', remarkArabic: 'ناجح', teacherRemarkArabic: 'مجتهدا' };
    if (score >= 60) return { english: 'Good', arabic: 'جيد', remarkArabic: 'ناجح', teacherRemarkArabic: 'اجتهادا' };
    if (score >= 50) return { english: 'Pass', arabic: 'مقبول', remarkArabic: 'ناجح', teacherRemarkArabic: 'كن مجتهدا' };
    return { english: 'Fail', arabic: 'راسب', remarkArabic: 'راسب', teacherRemarkArabic: 'اجتهد نفسك' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto print:p-0">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none">
        {/* Print/Close Buttons */}
        <div className="flex justify-end gap-2 p-4 print:hidden bg-gray-100 border-b">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer size={18} />
            Print Report Card
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <X size={18} />
            Close
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

  {!loading && reportData && (
  <div id="report-card-print-area" className="p-6 print:p-6 bg-white relative">
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
              <div className="w-50 h-50 flex items-center justify-center">
                <img 
                  
                  src="/school-logo.jpg" 
                  alt="School Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header Section with Logos */}
              {/* <div className="flex items-start justify-between mb-3 print:mb-4 p-2"> */}
              <div className="flex items-start justify-between mb-3 print:mb-4 bg-gray-50 p-2">
                {/* Left Logo */}
                <div className="w-16 h-16 print:w-22 print:h-22 flex items-center justify-center flex-shrink-0 mt-1">
                  <img 
                    src="/school-logo.jpg" 
                    alt="School Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Center Header */}
                <div className="flex-1 text-center px-2">
                  <p className="text-[10px] print:text-xs mb-1">بسم الله الرحمن الرحيم</p>
                  <h1 className="text-sm print:text-base font-bold mb-1">معهد دار المؤمن للدراسات العربية والإسلامية</h1>
                  <h2 className="text-xs print:text-sm font-bold mb-1">
                    DAARUL MUHMIN INSTITUTE OF ARABIC AND ISLAMIC STUDIES
                  </h2>
                  <div className="text-[10px] print:text-xs font-semibold py-1 ">
                    <span>REPORT SHEET كشف الدرجات</span>
                    <span className="mx-3"></span>   
                    <span>EXAMINATION OFFICE إدارة الإمتحانات</span>
                  </div>
                </div>

                {/* Right Logo */}
                <div className="w-16 h-16 print:w-22 print:h-22 flex items-center justify-center flex-shrink-0 mt-1 ">
                  <img 
                    src="/school-logo.jpg" 
                    alt="School Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Student Information Section */}
              <div className="mb-3 print:mb-4 text-[13px] print:text-xs">
                {/* Name Row */}
                <div className="flex items-center mb-2">
                  <span className="font-semibold w-14 text-[12px] print:text-[12px]">Name:</span>
                 
                <span className="flex-1 border-b border-dotted border-gray-600 px-2 text-[12px] print:text-xs flex justify-between items-center">
  <span>{student.fullName}</span>
  <span className="text-xl font-bold">{student.arabicName && `${student.arabicName}`}</span>
</span>
                  <span className="mr-2 text-[13px] print:text-xs" dir="rtl">اسم الطالب</span>
                </div>

                {/* Session Row */}
                <div className="flex items-center mb-2">
                  <span className="font-semibold w-14 text-[12px] print:text-xs">Session:</span>
                  
                  <span className="flex-1 border-b border-dotted border-gray-600 px-2 text-[12px] print:text-[10px] flex justify-between items-center">
  <span>   {session?.sessionName}</span>
  <span>   {session?.sessionNameArabic && ` /  ${session.sessionNameArabic}`}</span>
</span>
                  <span className="mr-2 text-[12px] print:text-xs" dir="rtl">العام الدراسي</span>
                </div>
{/* Position, No. in Class, Class Row */}
<div className="flex items-center gap-3">
  <div className="flex items-center flex-1">
    <span className="font-semibold whitespace-nowrap text-[13px] print:text[11px]">Position:</span>
    <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 text-[12px] print:text-xs text-center">
      {reportData.classPosition}{getPositionSuffix(reportData.classPosition)}
      <span className="mx-1 text-gray-400">  |  </span>
      <span dir="rtl">{toArabicNumerals(reportData.classPosition)}</span>
    </span>
    <span dir="rtl" className="whitespace-nowrap text-[12px] print:text-xs">الترتيب</span>
  </div>

  <div className="flex items-center flex-1">
    <span className="font-semibold whitespace-nowrap text-[12px] print:text-xs">No. in Class:</span>
    <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 text-[12px] print:text-xs text-center">
      {reportData.totalStudents}
      <span className="mx-1 text-gray-400">  | </span>
      <span dir="rtl">{toArabicNumerals(reportData.totalStudents)}</span>
    </span>
    <span dir="rtl" className="whitespace-nowrap text-[12px] print:text-xs">عدد الطلبة</span>
  </div>

  <div className="flex items-center flex-1">
    <span className="font-semibold whitespace-nowrap text-[9px] print:text-xs">Class:</span>
    <span className="flex-1 border-b border-dotted border-gray-600 px-1 mx-1 text-[11px] print:text-xs text-center">
      {classInfo?.className}
      {classInfo?.classNameArabic && (
        <>
          <span className="mx-1 text-gray-400"> | </span>
          <span dir="rtl">{classInfo.classNameArabic}</span>
        </>
      )}
    </span>
    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-xs">الصف</span>
  </div>
</div>
              </div>

              {/* Grades Table - Larger for printing */}
              <table className="w-full border border-black text-[l4px] print:text-[14px] mb-3 print:mb-4" dir="rtl">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-l border-black p-1 print:p-1.5 w-6 text-center">ت</th>
                    <th className="border-l border-black p-1 print:p-1.5 text-center">
                      المواد الدراسية SUBJECT
                    </th>
                    <th className="border-l border-black p-1 print:p-1.5 w-12 text-center">الدرجة</th>
                    <th className="border-l border-black p-1 print:p-1.5 w-12 text-center">رقماً</th>
                    <th className="border-l border-black p-1 print:p-1.5 w-20 text-center">كتابة</th>
                    <th className="border-l border-black p-1 print:p-1.5 w-16 text-center">التقدير</th>
                    <th className="p-1 print:p-1.5 w-14 text-center">ملحوظة</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => {
                    const result = reportData.results.find(r => r.subjectId === subject.$id);
                    const gradeInfo = result ? calculateGrade(result.score) : null;
                    const scoreInWords = result ? numberToArabicWords(result.score) : '';
                    
                    return (
                      <tr key={subject.$id} className="border-b border-black">
                        <td className="border-l border-black p-1 print:p-1.5 text-center">{index + 1}</td>
                        <td className="border-l border-black p-1 print:p-1.5">
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-[14px] print:text-[14px]">{subject.arabicName}</span>
                            <span className="text-gray-600 text-left text-[13px] print:text-[13px]">{subject.englishName}</span>
                          </div>
                        </td>
                        <td className="border-l border-black p-1 print:p-1.5 text-center font-bold">100</td>
                        <td className="border-l border-black p-1 print:p-1.5 text-center font-bold">
                          {result ? result.score : ''}
                        </td>
                        <td className="border-l border-black p-1 print:p-1.5 text-center">
                          <span className="text-[12px] print:text-[13px]">{scoreInWords}</span>
                        </td>
                        <td className="border-l border-black p-1 print:p-1.5 text-center">
                          {gradeInfo?.arabic || ''}
                        </td>
                        <td className="p-1 print:p-1.5 text-center">
                          <span className={result && result.score >= 50 ? '' : 'text-red-600'}>
                            {gradeInfo?.remarkArabic || ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Row */}
                  <tr className="border-t border-black font-bold">
                    <td className="border-l border-black p-2 text-center text-[9px] print:text-[13px]" colSpan="2">
                      المجموع الكلي <span className="mr-20"> </span>TOTAL
                    </td>
                    <td className="border-l border-black p-2 text-center">
                      {reportData.totalMax}
                    </td>
                    <td className="p-2 text-center" colSpan="4">
                      {reportData.totalScore}
                    </td>
                  </tr>

                  {/* Percentage Row */}
                  <tr className="border-t border-black font-bold">
                    <td className="border-l border-black p-2 text-center text-[9px] print:text-[12px]" colSpan="2">
                      النسبة المئوية <span className="mr-20"> </span>PERCENTAGE
                    </td>
                    <td className="p-2 text-center" colSpan="5">
                   {toArabicNumerals(reportData.percentage)}٪
                   <span className="mr-20"> </span>
                      {reportData.percentage}%  
                      
                    </td>
                  </tr>

                  {/* Grade Row */}
                  <tr className="border-t border-black font-bold">
                    <td className="border-l border-black p-2 text-center text-[9px] print:text-[12px]" colSpan="2">
                      التقدير العام <span className="mr-20"> </span>GRADE
                    </td>
                    <td className="p-2 text-center" colSpan="5">
                      {reportData.overallGrade.arabic} 
                      <span className="mr-20">
                        </span> {reportData.overallGrade.english}
                    </td>
                  </tr>
                </tbody>
              </table>

{/* Next Term & Promoted Section */}
<div className="grid grid-cols-2 gap-3 mb-3 print:mb-4 text-[10px] print:text-[13px]">
  <div className="flex items-center">
    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[13px]">Next Term Begins:</span>
    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 text-center text-[10px] print:text-[13px]">
      {/* ✅ Show date if set, otherwise blank line */}
      {session?.nextTermBegins
        ? new Date(session.nextTermBegins).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        : ''}
    </span>
    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[13px]">بداية الفصل الدراسي الجديد</span>
  </div>

  <div className="flex items-center">
    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[13px]">Promoted:</span>
    <span className="flex-1 border-b border-dotted border-gray-600 mx-2"></span>
    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[13px]">منقول إلى</span>
  </div>
</div>
              {/* Class Teacher's Remark - Display teacherRemarkArabic */}
              <div className="mb-3 print:mb-4 text-[10px] print:text-[13px]">
                <div className="flex items-center mb-2">
                  <span className="font-semibold whitespace-nowrap text-[10px] print:text-[13px]">Class Teacher's Remark:</span>
                  <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[20px] print:min-h-[24px] text-center font-bold" dir="rtl">
                    {reportData.overallGrade.teacherRemarkArabic}
                  </span>
                  <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[13px]">ملاحظة المدرس</span>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="grid grid-cols-2 gap-6 text-[10px] print:text-[13px]">
                <div>
                  <div className="flex items-center mb-2 print:mb-3">
                    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[13px]">Principal's Sign:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 flex items-end justify-center mx-1">
                      <img 
                        src="/sign2.png" 
                        alt="Principal Signature" 
                        className="w-20 h-5 print:w-24 print:h-6 object-contain"
                      />
                    </span>
                    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[12px]">توقيع الوكيل</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[12px]">Date:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[18px] print:min-h-[22px] text-center text-[10px] print:text-xs">
                      {new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[12px]">التاريخ</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2 print:mb-3">
                    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[12px]">Signature:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 flex items-end justify-center mx-1">
                      <img 
                        src="/sign.png" 
                        alt="Principal Signature" 
                        className="w-20 h-5 print:w-24 print:h-6 object-contain"
                      />
                    </span>
                    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[12px]">التوقيع</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-semibold whitespace-nowrap text-[10px] print:text-[12px]">Stamp:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[18px] print:min-h-[22px]"></span>
                    <span dir="rtl" className="whitespace-nowrap text-[10px] print:text-[12px]">الختم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Print Styles */}
      {/* Enhanced Print Styles */}
<style jsx>{`
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body * { visibility: hidden; }

    #report-card-print-area,
    #report-card-print-area * {
      visibility: visible;
    }

    #report-card-print-area {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: white;
      overflow: visible;
    }

    .print\\:hidden { display: none !important; }
    .print\\:p-6 { padding: 1cm 1.5cm !important; }
    .print\\:mb-4 { margin-bottom: 1rem !important; }
    .print\\:mb-3 { margin-bottom: 0.75rem !important; }
    .print\\:text-xs { font-size: 12px !important; }
    .print\\:text-sm { font-size: 14px !important; }
    .print\\:text-base { font-size: 16px !important; }
    .print\\:text-\\[10px\\] { font-size: 10px !important; }
    .print\\:text-\\[9px\\] { font-size: 9px !important; }
    .print\\:w-24 { width: 6rem !important; }
    .print\\:h-6 { height: 1.5rem !important; }
    .print\\:p-1\\.5 { padding: 0.375rem !important; }
    .print\\:min-h-\\[24px\\] { min-height: 24px !important; }
    .print\\:min-h-\\[22px\\] { min-height: 22px !important; }

    @page {
      margin: 0.5cm;
      size: A4 portrait;
    }

    table { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }
  }
`}</style>
    </div>
  );
};

const SessionModal = ({ isOpen, onClose, onSave, editingSession }) => {
  const [formData, setFormData] = useState({
    sessionName: '',
    sessionNameArabic: '',
    startDate: '',
    endDate: '',
    nextTermBegins: '', // ✅ NEW
    isActive: true
  });

  useEffect(() => {
    if (editingSession) {
      setFormData({
        sessionName: editingSession.sessionName || '',
        sessionNameArabic: editingSession.sessionNameArabic || '',
        startDate: editingSession.startDate || '',
        endDate: editingSession.endDate || '',
        nextTermBegins: editingSession.nextTermBegins || '', // ✅ NEW
        isActive: editingSession.isActive ?? true
      });
    } else {
      setFormData({
        sessionName: '',
        sessionNameArabic: '',
        startDate: '',
        endDate: '',
        nextTermBegins: '', // ✅ NEW
        isActive: true
      });
    }
  }, [editingSession, isOpen]);

  const handleSubmit = () => {
    onSave(formData, editingSession?.$id);
    setFormData({ 
      sessionName: '', 
      sessionNameArabic: '', 
      startDate: '', 
      endDate: '', 
      nextTermBegins: '', // ✅ NEW
      isActive: true 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingSession ? "Edit Academic Session" : "Add Academic Session"}>
      <Input
        label="Session Name"
        value={formData.sessionName}
        onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
        placeholder="e.g., 2025/2026"
        required
      />
      <Input
        label="Session Name (Arabic) - اسم السنة بالعربية"
        value={formData.sessionNameArabic}
        onChange={(e) => setFormData({ ...formData, sessionNameArabic: e.target.value })}
        placeholder="٢٠٢٥/٢٠٢٦"
        dir="rtl"
      />
      <Input
        label="Start Date"
        type="date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        required
      />
      <Input
        label="End Date"
        type="date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        required
      />

      {/* ✅ NEW FIELD */}
      <Input
        label="Next Term Begins (Optional) - بداية الفصل الدراسي الجديد"
        type="date"
        value={formData.nextTermBegins}
        onChange={(e) => setFormData({ ...formData, nextTermBegins: e.target.value })}
      />

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} icon={Check}>
          {editingSession ? 'Update Session' : 'Save Session'}
        </Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};
// Class Modal (Create & Edit)
const ClassModal = ({ isOpen, onClose, onSave, sessionId, editingClass }) => {
  const [formData, setFormData] = useState({
    className: '',
    classNameArabic: '',
    // classTeacher: '',
    // classTeacherArabic: '',
    // capacity: 30
  });

  useEffect(() => {
    if (editingClass) {
      setFormData({
        className: editingClass.className || '',
        classNameArabic: editingClass.classNameArabic || '',
        // classTeacher: editingClass.classTeacher || '',
        // classTeacherArabic: editingClass.classTeacherArabic || '',
        // capacity: editingClass.capacity || 30
      });
    } else {
      setFormData({
        className: '',
        classNameArabic: '',
        // classTeacher: '',
        // classTeacherArabic: '',
        // capacity: 30
      });
    }
  }, [editingClass, isOpen]);

  const handleSubmit = () => {
    onSave({ ...formData, academicSessionId: sessionId }, editingClass?.$id);
    setFormData({ className: '', classNameArabic: ''});
    // setFormData({ className: '', classNameArabic: '', classTeacher: '', classTeacherArabic: '', capacity: 30 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingClass ? "Edit Class - تعديل الصف" : "Add Class - إضافة صف"}>
      <Input
        label="Class Name"
        value={formData.className}
        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
        placeholder="e.g., Grade 1A"
        required
      />
      <Input
        label="Class Name (Arabic) - اسم الصف بالعربية"
        value={formData.classNameArabic}
        onChange={(e) => setFormData({ ...formData, classNameArabic: e.target.value })}
        placeholder="الصف الأول أ"
        dir="rtl"
      />
      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} icon={Check}>
          {editingClass ? 'Update Class' : 'Save Class'}
        </Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

// ============================================
// MODAL COMPONENTS - STUDENT & SUBJECT
// ============================================


const StudentModal = ({ isOpen, onClose, onSave, classId, sessionId, editingStudent }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    gender: 'Male'
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        fullName: editingStudent.fullName || '',
        arabicName: editingStudent.arabicName || '',
        gender: editingStudent.gender || 'Male'
      });
    } else {
      setFormData({
        fullName: '',
        arabicName: '',
        gender: 'Male'
      });
    }
  }, [editingStudent, isOpen]);

  const handleSubmit = () => {
    onSave({ 
      ...formData, 
      classId, 
      academicSessionId: sessionId,
      isActive: true 
    }, editingStudent?.$id);
    
    setFormData({
      fullName: '', 
      arabicName: '', 
      gender: 'Male'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingStudent ? "Edit Student - تعديل طالب" : "Add Student - إضافة طالب"} size="md">
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Enter full name"
        required
      />
      
      <Input
        label="Arabic Name - الاسم بالعربية"
        value={formData.arabicName}
        onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
        placeholder="أدخل الاسم بالعربية"
        dir="rtl"
      />
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Gender</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        >
          <option value="Male">Male - ذكر</option>
          <option value="Female">Female - أنثى</option>
        </select>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} icon={Check}>
          {editingStudent ? 'Update Student' : 'Save Student'}
        </Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

// Subject Modal (Create & Edit)
const SubjectModal = ({ isOpen, onClose, onSave, editingSubject }) => {
  const [formData, setFormData] = useState({
    englishName: '',
    arabicName: '',
    // subjectCode: '',
    // description: '',
    // descriptionArabic: '',
    maxScore: 100,
    // passingScore: 50
  });

  useEffect(() => {
    if (editingSubject) {
      setFormData({
        englishName: editingSubject.englishName || '',
        arabicName: editingSubject.arabicName || '',
        // subjectCode: editingSubject.subjectCode || '',
        // description: editingSubject.description || '',
        // descriptionArabic: editingSubject.descriptionArabic || '',
        maxScore: editingSubject.maxScore || 100,
        // passingScore: editingSubject.passingScore || 50
      });
    } else {
      setFormData({
        englishName: '',
        arabicName: '',
        // subjectCode: '',
        // description: '',
        // descriptionArabic: '',
        maxScore: 100,
        // passingScore: 50
      });
    }
  }, [editingSubject, isOpen]);

  const handleSubmit = () => {
    onSave({ ...formData, isActive: true }, editingSubject?.$id);
    setFormData({
      englishName: '', arabicName: '',
      maxScore: 100
    });
    // setFormData({
    //   englishName: '', arabicName: '', subjectCode: '', 
    //   description: '', descriptionArabic: '', 
    //   maxScore: 100, passingScore: 50
    // });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingSubject ? "Edit Subject - تعديل مادة" : "Add Subject - إضافة مادة"} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="English Name"
          value={formData.englishName}
          onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
          placeholder="e.g., Islamic Studies"
          required
        />
        <Input
          label="Arabic Name - الاسم بالعربية"
          value={formData.arabicName}
          onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
          placeholder="الدراسات الإسلامية"
          dir="rtl"
          required
        />
        {/* <Input
          label="Subject Code (Optional)"
          value={formData.subjectCode}
          onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
          placeholder="IS101"
        /> */}
        <Input
          label="Max Score"
          type="number"
          value={formData.maxScore}
          onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
          required
        />
        {/* <Input
          label="Passing Score"
          type="number"
          value={formData.passingScore}
          onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
        /> */}
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} icon={Check}>
          {editingSubject ? 'Update Subject' : 'Save Subject'}
        </Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

// ============================================
// STUDENT GRADES MANAGEMENT COMPONENT
// ============================================

const StudentGradesModal = ({ isOpen, onClose, student, subjects, onSave }) => {
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      loadStudentScores();
    }
  }, [student, isOpen]);

  const loadStudentScores = async () => {
    setLoading(true);
    try {
      // Load existing scores for this student
      const result = await resultsManager.getByStudent(student.$id);
      
      if (result.success) {
        // Convert results array to object for easy access
        const scoresObj = {};
        const commentsObj = {};
        
        result.results.forEach(r => {
          scoresObj[r.subjectId] = r.score;
          commentsObj[r.subjectId] = r.teacherComment || '';
        });
        
        setScores(scoresObj);
        setComments(commentsObj);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (subjectId, score) => {
    const numScore = parseInt(score) || 0;
    setScores({ ...scores, [subjectId]: numScore });
  };

  const handleCommentChange = (subjectId, comment) => {
    setComments({ ...comments, [subjectId]: comment });
  };

  const calculateGradePreview = (score) => {
    if (score >= 90) return { grade: 'Excellent', color: 'text-green-400' };
    if (score >= 80) return { grade: 'Very Good', color: 'text-blue-400' };
    if (score >= 60) return { grade: 'Good', color: 'text-yellow-400' };
    if (score >= 50) return { grade: 'Pass', color: 'text-orange-400' };
    return { grade: 'Fail', color: 'text-red-400' };
  };

  const handleSaveAll = async () => {
    setLoading(true);
    
    try {
      const promises = subjects.map(async (subject) => {
        const score = scores[subject.$id];
        
        // Only save if score is entered
        if (score !== undefined && score !== '') {
          return await resultsManager.saveResult({
            studentId: student.$id,
            subjectId: subject.$id,
            classId: student.classId,
            academicSessionId: student.academicSessionId,
            score: score,
            teacherComment: comments[subject.$id] || ''
            // Removed: term field - single term only
          }, 'admin@school.com'); // Replace with actual admin email
        }
      });

      await Promise.all(promises);
      alert('Scores saved successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving scores:', error);
      alert('Failed to save scores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Grades - ${student?.fullName}`} size="xl">
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <>
          <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Student:</span>
                <span className="text-white ml-2 font-bold">{student?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400">Arabic Name:</span>
                <span className="text-white ml-2" dir="rtl">{student?.arabicName}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {subjects.map((subject) => {
              const score = scores[subject.$id] || '';
              const preview = score ? calculateGradePreview(score) : null;

              return (
                <div key={subject.$id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{subject.englishName}</h4>
                      <p className="text-sm text-gray-400" dir="rtl">{subject.arabicName}</p>
                    </div>
                    {preview && (
                      <span className={`text-sm font-bold ${preview.color}`}>
                        {preview.grade}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Score (Max: {subject.maxScore})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={subject.maxScore}
                        value={score}
                        onChange={(e) => handleScoreChange(subject.$id, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter score"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Teacher Comment
                      </label>
                      <input
                        type="text"
                        value={comments[subject.$id] || ''}
                        onChange={(e) => handleCommentChange(subject.$id, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Optional comment"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveAll} icon={Check} disabled={loading}>
              {loading ? 'Saving...' : 'Save All Scores'}
            </Button>
            <Button onClick={onClose} variant="secondary">Cancel</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

// ============================================
// DISPLAY CARD COMPONENTS
// ============================================

const AcademicSessionCard = ({ session, onView, onEdit, onDelete }) => (
  <Card className="hover:shadow-2xl transition-shadow cursor-pointer">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1" onClick={onView}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-green-400" size={20} />
          <h3 className="text-lg sm:text-xl font-bold text-white">{session.sessionName}</h3>
          {session.isActive && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>
          )}
        </div>
        {session.sessionNameArabic && (
          <p className="text-sm text-gray-400 mb-1" dir="rtl">{session.sessionNameArabic}</p>
        )}
        <p className="text-sm text-gray-400">
          {session.startDate} to {session.endDate}
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onView} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Eye size={18} />
        </button>
        <button onClick={onEdit} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </Card>
);


const ClassCard = ({ classItem, onView, onEdit, onDelete, studentCount }) => (
  <Card className="hover:shadow-2xl transition-shadow cursor-pointer">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1" onClick={onView}>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="text-blue-400" size={20} />
          <h3 className="text-lg sm:text-xl font-bold text-white">{classItem.className}</h3>
        </div>
        {classItem.classNameArabic && (
          <p className="text-sm text-gray-400 mb-1" dir="rtl">{classItem.classNameArabic}</p>
        )}
        <p className="text-sm text-gray-400">
          Teacher: {classItem.classTeacher || 'Not assigned'}
          {classItem.classTeacherArabic && <span dir="rtl"> ({classItem.classTeacherArabic})</span>}
        </p>
        {/* <p className="text-sm text-gray-400"> */}
          {/* Use the dynamically passed studentCount instead of stored currentEnrollment */}
          {/* Students: {studentCount || 0}/{classItem.capacity} */}
        {/* </p> */}
      </div>
      <div className="flex gap-2">
        <button onClick={onView} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Eye size={18} />
        </button>
        <button onClick={onEdit} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </Card>
);


const StudentRow = ({ student, onEdit, onDelete, onViewGrades, onViewReportCard }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Users className="text-green-400" size={16} />
        <h4 className="text-base sm:text-lg font-bold text-white">{student.fullName}</h4>
        {student.isActive && <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>}
      </div>
      {student.arabicName && (
        <p className="text-sm text-gray-400" dir="rtl">{student.arabicName}</p>
      )}
    </div>
    <div className="flex gap-2">
      <button 
        onClick={onViewReportCard} 
        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        title="View Report Card"
      >
        <FileText size={16} />
      </button>
      <button 
        onClick={onViewGrades} 
        className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        title="Edit Grades"
      >
        <Edit2 size={16} />
      </button>
      <button onClick={onEdit} className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
        <Edit2 size={16} />
      </button>
      <button onClick={onDelete} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);


const SubjectCard = ({ subject, onEdit, onDelete }) => (
  <Card>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <BookA className="text-purple-400" size={20} />
          <h3 className="text-base sm:text-lg font-bold text-white">{subject.englishName}</h3>
        </div>
        <p className="text-sm text-gray-400" dir="rtl">{subject.arabicName}</p>
        <div className="flex gap-3 text-xs text-gray-500 mt-2">
          <span>Max: {subject.maxScore}</span>
          {subject.passingScore && <span>Pass: {subject.passingScore}</span>}
          {subject.subjectCode && <span>Code: {subject.subjectCode}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </Card>
);

           // ============================================
// BROADSHEET COMPONENT
// ============================================

const BroadsheetView = ({ sessions, subjects }) => {
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);
  const [broadsheetData, setBroadsheetData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load classes when session changes
  useEffect(() => {
    if (selectedSessionId) {
      loadClasses(selectedSessionId);
      setSelectedClassId('');
      setBroadsheetData(null);
    }
  }, [selectedSessionId]);

  const loadClasses = async (sessionId) => {
    const result = await classesManager.getBySession(sessionId);
    if (result.success) setAvailableClasses(result.classes);
  };

  const generateBroadsheet = async () => {
    if (!selectedClassId) return;
    setLoading(true);

    try {
      const studentsResult = await studentsManager.getByClass(selectedClassId);
      if (!studentsResult.success) throw new Error('Failed to load students');

      const students = studentsResult.students;

      // Load results for all students
      const studentsWithResults = await Promise.all(
        students.map(async (student) => {
          const resultsResult = await resultsManager.getByStudent(student.$id);
          const results = resultsResult.success ? resultsResult.results : [];

          const subjectScores = {};
          subjects.forEach(subject => {
            const result = results.find(r => r.subjectId === subject.$id);
            subjectScores[subject.$id] = result ? result.score : null;
          });

          const scores = Object.values(subjectScores).filter(s => s !== null);
          const totalScore = scores.reduce((sum, s) => sum + s, 0);
          const totalMax = subjects.length * 100;
          const percentage = scores.length > 0
            ? ((totalScore / totalMax) * 100).toFixed(1)
            : '0.0';

          return {
            ...student,
            subjectScores,
            totalScore,
            totalMax,
            percentage: parseFloat(percentage)
          };
        })
      );

      // Sort by total score descending and assign positions
      const sorted = [...studentsWithResults].sort((a, b) => b.totalScore - a.totalScore);
      sorted.forEach((student, index) => {
        student.position = index + 1;
      });

      // Restore original order (by name) but keep position
      const finalData = studentsWithResults.map(s => ({
        ...s,
        position: sorted.find(ss => ss.$id === s.$id)?.position || 0
      }));

      setBroadsheetData(finalData);
    } catch (error) {
      console.error('Broadsheet error:', error);
      alert('Failed to generate broadsheet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBroadsheet = () => {
    const printContent = document.getElementById('broadsheet-print-area');
    if (!printContent) return;

    const selectedClass = availableClasses.find(c => c.$id === selectedClassId);
    const selectedSession = sessions.find(s => s.$id === selectedSessionId);

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Broadsheet - ${selectedClass?.className}</title>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; }
            body { font-family: sans-serif; font-size: 9px; background: white; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 3px 4px; text-align: center; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .header { text-align: center; margin-bottom: 8px; }
            .header h1 { font-size: 13px; }
            .header h2 { font-size: 11px; }
            .header p { font-size: 9px; }
            .fail { color: red; }
            @page { margin: 0.5cm; size: A4 landscape; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getPositionSuffix = (n) => {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
  };

  const getGradeLabel = (score) => {
    if (score === null) return '-';
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
  };

  const selectedClass = availableClasses.find(c => c.$id === selectedClassId);
  const selectedSession = sessions.find(s => s.$id === selectedSessionId);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-gray-300 mb-2 text-sm">Academic Session</label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Session...</option>
            {sessions.map(s => (
              <option key={s.$id} value={s.$id}>{s.sessionName}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-gray-300 mb-2 text-sm">Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            disabled={!selectedSessionId}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <option value="">Select Class...</option>
            {availableClasses.map(c => (
              <option key={c.$id} value={c.$id}>{c.className}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={generateBroadsheet}
            disabled={!selectedClassId || loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Broadsheet'}
          </button>

          {broadsheetData && (
            <button
              onClick={handlePrintBroadsheet}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              <Printer size={16} />
              Print
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Broadsheet Table */}
      {!loading && broadsheetData && (
        <div className="overflow-x-auto">
          <div id="broadsheet-print-area" className="bg-white text-black p-4 rounded-lg">
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-[10px]">بسم الله الرحمن الرحيم</p>
              <h1 className="font-bold text-sm">معهد دار المؤمن للدراسات العربية والإسلامية</h1>
              <h2 className="font-bold text-xs">DAARUL MUHMIN INSTITUTE OF ARABIC AND ISLAMIC STUDIES</h2>
              <p className="text-xs font-semibold mt-1">CLASS BROADSHEET — كشف درجات الصف</p>
              <div className="flex justify-center gap-8 mt-1 text-[10px]">
                <span>Session: <strong>{selectedSession?.sessionName}</strong></span>
                <span>Class: <strong>{selectedClass?.className}</strong>
                  {selectedClass?.classNameArabic && <span dir="rtl"> | {selectedClass.classNameArabic}</span>}
                </span>
                <span>Total Students: <strong>{broadsheetData.length}</strong></span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border border-black text-[8px]" style={{ fontSize: '8px' }}>
              <thead>
                <tr>
                  <th className="border border-black p-1 w-5">S/N</th>
                  <th className="border border-black p-1 text-left min-w-[100px]">Student Name / اسم الطالب</th>
                  {subjects.map(subject => (
                    <th key={subject.$id} className="border border-black p-1 min-w-[50px]">
                      <div>{subject.arabicName}</div>
                      <div className="text-[7px] text-gray-600">{subject.englishName}</div>
                      <div className="text-[7px]">/100</div>
                    </th>
                  ))}
                  <th className="border border-black p-1 min-w-[45px]">Total<br/>المجموع</th>
                  <th className="border border-black p-1 min-w-[40px]">Max<br/>الكلي</th>
                  <th className="border border-black p-1 min-w-[40px]">%<br/>النسبة</th>
                  <th className="border border-black p-1 min-w-[35px]">Grade<br/>التقدير</th>
                  <th className="border border-black p-1 min-w-[40px]">Position<br/>الترتيب</th>
                </tr>
              </thead>
              <tbody>
                {broadsheetData.map((student, index) => {
                  const grade = student.percentage >= 90 ? 'Excellent / ممتاز'
                    : student.percentage >= 80 ? 'Very Good / جيد جداً'
                    : student.percentage >= 60 ? 'Good / جيد'
                    : student.percentage >= 50 ? 'Pass / مقبول'
                    : 'Fail / راسب';
                  const isFail = student.percentage < 50;

                  return (
                    <tr key={student.$id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-black p-1 text-center">{index + 1}</td>
                      <td className="border border-black p-1 text-left">
                        <div className="font-bold">{student.fullName}</div>
                        {student.arabicName && (
                          <div className="text-[7px] text-gray-600" dir="rtl">{student.arabicName}</div>
                        )}
                      </td>
                      {subjects.map(subject => {
                        const score = student.subjectScores[subject.$id];
                        const subFail = score !== null && score < 50;
                        return (
                          <td
                            key={subject.$id}
                            className={`border border-black p-1 text-center font-bold ${subFail ? 'text-red-600' : ''}`}
                          >
                            {score !== null ? score : '-'}
                          </td>
                        );
                      })}
                      <td className="border border-black p-1 text-center font-bold">{student.totalScore}</td>
                      <td className="border border-black p-1 text-center">{student.totalMax}</td>
                      <td className={`border border-black p-1 text-center font-bold ${isFail ? 'text-red-600' : 'text-green-700'}`}>
                        {student.percentage}%
                      </td>
                      <td className={`border border-black p-1 text-center text-[7px] ${isFail ? 'text-red-600' : ''}`}>
                        {grade}
                      </td>
                      <td className="border border-black p-1 text-center font-bold">
                        {student.position}{getPositionSuffix(student.position)}
                        <div className="text-[7px]" dir="rtl">{toArabicNumerals(student.position)}</div>
                      </td>
                    </tr>
                  );
                })}

                {/* Summary Row */}
                <tr className="font-bold bg-gray-100">
                  <td className="border border-black p-1 text-center" colSpan="2">
                    Class Average / معدل الصف
                  </td>
                  {subjects.map(subject => {
                    const scores = broadsheetData
                      .map(s => s.subjectScores[subject.$id])
                      .filter(s => s !== null);
                    const avg = scores.length > 0
                      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                      : '-';
                    return (
                      <td key={subject.$id} className="border border-black p-1 text-center">
                        {avg}
                      </td>
                    );
                  })}
                  <td className="border border-black p-1 text-center" colSpan="5">
                    Class Avg %:{' '}
                    {(broadsheetData.reduce((sum, s) => sum + s.percentage, 0) / broadsheetData.length).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex justify-between mt-4 text-[9px]">
              <div>
                <span className="font-semibold">Prepared by:</span>
                <span className="border-b border-dotted border-gray-500 inline-block w-32 ml-2"></span>
              </div>
              <div>
                <span className="font-semibold">Date:</span>
                <span className="ml-2">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold">Principal's Sign:</span>
                <span className="border-b border-dotted border-gray-500 inline-block w-32 ml-2"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !broadsheetData && (
        <div className="text-center py-12 text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>Select a session and class, then click Generate Broadsheet</p>
          <p className="text-xs mt-1" dir="rtl">اختر السنة الدراسية والصف ثم انقر على إنشاء الكشف</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN ADMIN DASHBOARD COMPONENT
// ============================================

const AdminDashboard = ({ user, onLogout, isDark, setIsDark }) => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('sessions');
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Modal State
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  
  // Editing State
  const [editingSession, setEditingSession] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // Navigation Items
  const navItems = [
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: BookA },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

    const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
    const [selectedStudentForGrades, setSelectedStudentForGrades] = useState(null);
    const [isReportCardOpen, setIsReportCardOpen] = useState(false);
    const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);


  // ============================================
  // LOAD DATA ON MOUNT
  // ============================================
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    
    try {
      const [sessionsResult, subjectsResult] = await Promise.all([
        academicSessionsManager.getAll(),
        subjectsManager.getAll()
      ]);
      
      if (sessionsResult.success) setSessions(sessionsResult.sessions);
      if (subjectsResult.success) setSubjects(subjectsResult.subjects);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SESSION HANDLERS
  // ============================================
  const handleViewSession = async (session) => {
    setSelectedSession(session);
    setLoading(true);
    
    const classesResult = await classesManager.getBySession(session.$id);
    if (classesResult.success) {
      setClasses(classesResult.classes);
    }
    
    setLoading(false);
    setCurrentView('classes');
  };

  const handleSaveSession = async (sessionData, editingId) => {
    setLoading(true);
    
    let result;
    if (editingId) {
      result = await academicSessionsManager.update(editingId, sessionData);
      if (result.success) {
        setSessions(sessions.map(s => s.$id === editingId ? result.session : s));
        alert('Session updated successfully!');
      }
    } else {
      result = await academicSessionsManager.create(sessionData, user.email);
      if (result.success) {
        setSessions([result.session, ...sessions]);
        alert('Session created successfully!');
      }
    }
    
    if (!result.success) {
      alert(result.message);
    }
    
    setIsSessionModalOpen(false);
    setEditingSession(null);
    setLoading(false);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setIsSessionModalOpen(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    
    setLoading(true);
    const result = await academicSessionsManager.delete(sessionId);
    
    if (result.success) {
      setSessions(sessions.filter(s => s.$id !== sessionId));
      alert('Session deleted successfully!');
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };
  // Add this handler:
const handleViewGrades = (student) => {
  setSelectedStudentForGrades(student);
  setIsGradesModalOpen(true);
};

const handleSaveGrades = () => {
  // Refresh student list if needed
  setIsGradesModalOpen(false);
  setSelectedStudentForGrades(null);
};
  
  // ============================================
  // CLASS HANDLERS
  // ============================================
  const handleViewClass = async (classItem) => {
    setSelectedClass(classItem);
    setLoading(true);
    
    const studentsResult = await studentsManager.getByClass(classItem.$id);
    if (studentsResult.success) {
      setStudents(studentsResult.students);
    }
    
    setLoading(false);
    setCurrentView('students');
  };

  const handleSaveClass = async (classData, editingId) => {
    setLoading(true);
    
    let result;
    if (editingId) {
      result = await classesManager.update(editingId, classData);
      if (result.success) {
        setClasses(classes.map(c => c.$id === editingId ? result.class : c));
        alert('Class updated successfully!');
      }
    } else {
      result = await classesManager.create(classData, user.email);
      if (result.success) {
        setClasses([result.class, ...classes]);
        alert('Class created successfully!');
      }
    }
    
    if (!result.success) {
      alert(result.message);
    }
    
    setIsClassModalOpen(false);
    setEditingClass(null);
    setLoading(false);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }
    
    setLoading(true);
    const result = await classesManager.delete(classId);
    
    if (result.success) {
      setClasses(classes.filter(c => c.$id !== classId));
      alert('Class deleted successfully!');
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  // ============================================
  // STUDENT HANDLERS
  // ============================================
  const handleSaveStudent = async (studentData, editingId) => {
    setLoading(true);
    
    let result;
    if (editingId) {
      result = await studentsManager.update(editingId, studentData);
      if (result.success) {
        setStudents(students.map(s => s.$id === editingId ? result.student : s));
        alert('Student updated successfully!');
      }
    } else {
      result = await studentsManager.create(studentData, user.email);
      if (result.success) {
        setStudents([result.student, ...students]);
        if (selectedClass) {
          await classesManager.updateEnrollment(selectedClass.$id);
        }
        alert('Student added successfully!');
      }
    }
    
    if (!result.success) {
      alert(result.message);
    }
    
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    setLoading(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    setLoading(true);
    const result = await studentsManager.delete(studentId);
    
    if (result.success) {
      setStudents(students.filter(s => s.$id !== studentId));
      if (selectedClass) {
        await classesManager.updateEnrollment(selectedClass.$id);
      }
      alert('Student deleted successfully!');
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  // ============================================
  // SUBJECT HANDLERS
  // ============================================
  const handleSaveSubject = async (subjectData, editingId) => {
    setLoading(true);
    
    let result;
    if (editingId) {
      result = await subjectsManager.update(editingId, subjectData);
      if (result.success) {
        setSubjects(subjects.map(s => s.$id === editingId ? result.subject : s));
        alert('Subject updated successfully!');
      }
    } else {
      result = await subjectsManager.create(subjectData, user.email);
      if (result.success) {
        setSubjects([result.subject, ...subjects]);
        alert('Subject created successfully!');
      }
    }
    
    if (!result.success) {
      alert(result.message);
    }
    
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
    setLoading(false);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    
    setLoading(true);
    const result = await subjectsManager.delete(subjectId);
    
    if (result.success) {
      setSubjects(subjects.filter(s => s.$id !== subjectId));
      alert('Subject deactivated successfully!');
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const handleBackToSessions = () => {
    setSelectedSession(null);
    setSelectedClass(null);
    setCurrentView('sessions');
  };

 const handleBackToClasses = () => {
    setSelectedClass(null);
    setCurrentView('classes'); // ✅
};

const handleViewReportCard = (student) => {
  setSelectedStudentForReport(student);
  setIsReportCardOpen(true);
};
  // Filter Data
  const filteredClasses = selectedSession 
    ? classes.filter(c => c.academicSessionId === selectedSession.$id)
    : [];
  
  const filteredStudents = selectedClass
    ? students.filter(s => s.classId === selectedClass.$id)
    : [];

    // ============================================
  // RENDER (JSX)
  // ============================================
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      {/* Header */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">Admin Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300">Daarul Muhmin Institute</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg transition-all hover:scale-110`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <Button onClick={onLogout} variant="danger" icon={LogOut}>
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="sm:hidden bg-gray-800 bg-opacity-50 border-b border-gray-700">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSelectedSession(null);
                setSelectedClass(null);
              }}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                currentView === item.id && !selectedSession && !selectedClass
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden sm:block lg:w-64 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 h-fit sticky top-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSelectedSession(null);
                  setSelectedClass(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  currentView === item.id && !selectedSession && !selectedClass
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && (
              <>
                {/* Academic Sessions View */}
                {currentView === 'sessions' && !selectedSession && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Academic Sessions</h2>
                      <Button onClick={() => setIsSessionModalOpen(true)} icon={Plus}>
                        Add Session
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {sessions.length === 0 ? (
                        <Card>
                          <EmptyState
                            icon={Calendar}
                            title="No Academic Sessions"
                            description="Create your first academic session to get started"
                            action={
                              <Button onClick={() => setIsSessionModalOpen(true)} icon={Plus}>
                                Add Session
                              </Button>
                            }
                          />
                        </Card>
                      ) : (
                        sessions.map(session => (
                          <AcademicSessionCard
                            key={session.$id}
                            session={session}
                            onView={() => handleViewSession(session)}
                            onEdit={() => handleEditSession(session)}
                            onDelete={() => handleDeleteSession(session.$id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Classes View */}
                {currentView === 'classes' && selectedSession && (
                  <div>
                    <button
                      onClick={handleBackToSessions}
                      className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
                    >
                      ← Back to Sessions
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedSession.sessionName}</h2>
                        <p className="text-gray-400">Manage Classes</p>
                      </div>
                      <Button onClick={() => setIsClassModalOpen(true)} icon={Plus}>
                        Add Class
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredClasses.length === 0 ? (
                        <Card className="sm:col-span-2">
                          <EmptyState
                            icon={GraduationCap}
                            title="No Classes Yet"
                            description="Add classes to this academic session"
                            action={
                              <Button onClick={() => setIsClassModalOpen(true)} icon={Plus}>
                                Add Class
                              </Button>
                            }
                          />
                        </Card>
                      ) : (
                        filteredClasses.map(classItem => (
                          <ClassCard
                            key={classItem.$id}
                            classItem={classItem}
                            studentCount={students.filter(s => s.classId === classItem.$id).length}
                            onView={() => handleViewClass(classItem)}
                            onEdit={() => handleEditClass(classItem)}
                            onDelete={() => handleDeleteClass(classItem.$id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Students View */}
                {currentView === 'students' && selectedClass && (
                  <div>
                    <button
                      onClick={handleBackToClasses}
                      className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
                    >
                      ← Back to Classes
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedClass.className}</h2>
                        <p className="text-gray-400">Manage Students</p>
                      </div>
                      <Button onClick={() => setIsStudentModalOpen(true)} icon={Plus}>
                        Add Student
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {filteredStudents.length === 0 ? (
                        <Card>
                          <EmptyState
                            icon={Users}
                            title="No Students Yet"
                            description="Add students to this class"
                            action={
                              <Button onClick={() => setIsStudentModalOpen(true)} icon={Plus}>
                                Add Student
                              </Button>
                            }
                          />
                        </Card>
                      ) : (
                        filteredStudents.map(student => (
                          <StudentRow
                            key={student.$id}
                            student={student}
                            onEdit={() => handleEditStudent(student)}
                            onDelete={() => handleDeleteStudent(student.$id)}
                            onViewGrades={() => handleViewGrades(student)}
                            onViewReportCard={() => handleViewReportCard(student)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Subjects View */}
                {currentView === 'subjects' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Subjects</h2>
                      <Button onClick={() => setIsSubjectModalOpen(true)} icon={Plus}>
                        Add Subject
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjects.length === 0 ? (
                        <Card className="sm:col-span-2 lg:col-span-3">
                          <EmptyState
                            icon={BookA}
                            title="No Subjects Yet"
                            description="Add subjects that will be available for all classes"
                            action={
                              <Button onClick={() => setIsSubjectModalOpen(true)} icon={Plus}>
                                Add Subject
                              </Button>
                            }
                          />
                        </Card>
                      ) : (
                        subjects.map(subject => (
                          <SubjectCard
                            key={subject.$id}
                            subject={subject}
                            onEdit={() => handleEditSubject(subject)}
                            onDelete={() => handleDeleteSubject(subject.$id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Settings View */}
                
                  
{currentView === 'settings' && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Settings</h2>
    </div>

    <div className="space-y-6">
      {/* ✅ NEW - Broadsheet Section */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-2">Class Broadsheet</h3>
        <p className="text-gray-300 mb-4 text-sm">
          Generate and print the full result broadsheet for any class.
          كشف درجات كامل للصف
        </p>
        <BroadsheetView sessions={sessions} subjects={subjects} />
      </Card>

      {/* Report Card Template */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Report Card Template</h3>
        <p className="text-gray-300 mb-4">Download the blank report card template for printing or reference.</p>
        <ReportCardTemplate subjects={subjects} />
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-4">System Settings</h3>
        <EmptyState
          icon={Settings}
          title="Additional Settings"
          description="More system settings coming soon..."
        />
      </Card>
    </div>
  </div>
)}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        editingSession={editingSession}
      />
      
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setEditingClass(null);
        }}
        onSave={handleSaveClass}
        sessionId={selectedSession?.$id}
        editingClass={editingClass}
      />
      
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        classId={selectedClass?.$id}
        sessionId={selectedSession?.$id}
        editingStudent={editingStudent}
      />
      
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        editingSubject={editingSubject}
      />
      <StudentGradesModal
        isOpen={isGradesModalOpen}
        onClose={() => {
          setIsGradesModalOpen(false);
          setSelectedStudentForGrades(null);
        }}
        student={selectedStudentForGrades}
        subjects={subjects}
        onSave={handleSaveGrades}
      />
      <ReportCardModal
        isOpen={isReportCardOpen}
        onClose={() => {
          setIsReportCardOpen(false);
          setSelectedStudentForReport(null);
        }}
        student={selectedStudentForReport}
        session={selectedSession}
        classInfo={selectedClass}
        subjects={subjects}
      />
    </div>
  );
};

export default AdminDashboard;
