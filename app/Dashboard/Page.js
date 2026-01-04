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

// const ReportCardModal = ({ isOpen, onClose, student, session, classInfo, subjects }) => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (student && isOpen) {
//       loadReportCardData();
//     }
//   }, [student, isOpen]);

//   const loadReportCardData = async () => {
//     setLoading(true);
//     try {
//       // Get student's results
//       const resultsResponse = await resultsManager.getByStudent(student.$id);
      
//       // Get all students in the same class to calculate position
//       const classStudentsResponse = await studentsManager.getByClass(student.classId);
      
//       if (resultsResponse.success && classStudentsResponse.success) {
//         // Calculate student's total score and average
//         const results = resultsResponse.results;
//         const totalScore = results.reduce((sum, r) => sum + r.score, 0);
//         const average = results.length > 0 ? (totalScore / results.length).toFixed(2) : 0;
        
//         // Calculate class position
//         const classPosition = await calculateClassPosition(
//           student.$id, 
//           classStudentsResponse.students
//         );
        
//         setReportData({
//           results,
//           totalScore,
//           average,
//           classPosition,
//           totalStudents: classStudentsResponse.students.length
//         });
//       }
//     } catch (error) {
//       console.error('Error loading report card:', error);
//       alert('Failed to load report card data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateClassPosition = async (studentId, classStudents) => {
//     try {
//       // Get results for all students in the class
//       const studentsWithScores = await Promise.all(
//         classStudents.map(async (s) => {
//           const res = await resultsManager.getByStudent(s.$id);
//           const total = res.success 
//             ? res.results.reduce((sum, r) => sum + r.score, 0) 
//             : 0;
//           return { studentId: s.$id, totalScore: total };
//         })
//       );

//       // Sort by total score (highest first)
//       studentsWithScores.sort((a, b) => b.totalScore - a.totalScore);
      
//       // Find position
//       const position = studentsWithScores.findIndex(s => s.studentId === studentId) + 1;
//       return position;
//     } catch (error) {
//       console.error('Error calculating position:', error);
//       return 0;
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const getPositionSuffix = (position) => {
//     if (position === 1) return 'st';
//     if (position === 2) return 'nd';
//     if (position === 3) return 'rd';
//     return 'th';
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
//         {/* Print/Close Buttons - Hide on print */}
//         <div className="flex justify-end gap-2 p-4 print:hidden bg-gray-100">
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Printer size={18} />
//             Print Report Card
//           </button>
//           <button
//             onClick={onClose}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             <X size={18} />
//             Close
//           </button>
//         </div>

//         {loading && (
//           <div className="flex justify-center items-center py-12">
//             <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}

//         {!loading && reportData && (
//           <div className="p-8 print:p-6">
//             {/* Report Card Content */}
//             <div className="border-4 border-green-600 rounded-lg p-6">
//               {/* Header */}
//               <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
//                 <h1 className="text-3xl font-bold text-green-700 mb-2">
//                   Daarul Muhmin Institute
//                 </h1>
//                 <h2 className="text-2xl font-bold text-green-600 mb-3" dir="rtl">
//                   معهد دار المؤمن للدراسات العربية والإسلامية
//                 </h2>
//                 <p className="text-lg font-semibold text-gray-700">
//                   Academic Report Card - التقرير الأكاديمي
//                 </p>
//               </div>

//               {/* Student Information */}
//               <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Student Name:</p>
//                   <p className="font-bold text-lg">{student.fullName}</p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">اسم الطالب:</p>
//                   <p className="font-bold text-lg">{student.arabicName || student.fullName}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Academic Session:</p>
//                   <p className="font-bold">{session?.sessionName}</p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">السنة الدراسية:</p>
//                   <p className="font-bold">{session?.sessionNameArabic || session?.sessionName}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Class:</p>
//                   <p className="font-bold">{classInfo?.className}</p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">الصف:</p>
//                   <p className="font-bold">{classInfo?.classNameArabic || classInfo?.className}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Gender:</p>
//                   <p className="font-bold">{student.gender}</p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">الجنس:</p>
//                   <p className="font-bold">{student.gender === 'Male' ? 'ذكر' : 'أنثى'}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Number of Students:</p>
//                   <p className="font-bold">{reportData.totalStudents}</p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">عدد الطلاب:</p>
//                   <p className="font-bold">{reportData.totalStudents}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Position in Class:</p>
//                   <p className="font-bold text-green-600 text-xl">
//                     {reportData.classPosition}{getPositionSuffix(reportData.classPosition)}
//                   </p>
//                 </div>
//                 <div dir="rtl">
//                   <p className="text-sm text-gray-600 mb-1">الترتيب في الصف:</p>
//                   <p className="font-bold text-green-600 text-xl">
//                     {reportData.classPosition}
//                   </p>
//                 </div>
//               </div>

//               {/* Grades Table */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
//                   Academic Performance - الأداء الأكاديمي
//                 </h3>
                
//                 <table className="w-full border-collapse border-2 border-gray-300">
//                   <thead>
//                     <tr className="bg-green-600 text-white">
//                       <th className="border border-gray-300 p-2 text-left">Subject<br/>المادة</th>
//                       <th className="border border-gray-300 p-2">Max Score<br/>النهاية العظمى</th>
//                       <th className="border border-gray-300 p-2">Score<br/>الدرجة</th>
//                       <th className="border border-gray-300 p-2">Grade<br/>التقدير</th>
//                       <th className="border border-gray-300 p-2">Remark<br/>الملاحظة</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subjects.map((subject) => {
//                       const result = reportData.results.find(r => r.subjectId === subject.$id);
//                       const gradeInfo = result ? gradingSystem.calculateGrade(result.score) : null;
                      
//                       return (
//                         <tr key={subject.$id} className="hover:bg-gray-50">
//                           <td className="border border-gray-300 p-2">
//                             <div>{subject.englishName}</div>
//                             <div className="text-sm text-gray-600" dir="rtl">{subject.arabicName}</div>
//                           </td>
//                           <td className="border border-gray-300 p-2 text-center font-bold">
//                             100
//                           </td>
//                           <td className="border border-gray-300 p-2 text-center font-bold text-lg">
//                             {result ? result.score : '-'}
//                           </td>
//                           <td className="border border-gray-300 p-2 text-center" dir="rtl">
//                             <div className="font-bold text-green-700">{gradeInfo?.arabic || '-'}</div>
//                             <div className="text-sm text-gray-600">{gradeInfo?.english || '-'}</div>
//                           </td>
//                           <td className="border border-gray-300 p-2 text-center" dir="rtl">
//                             <span className={`font-bold ${
//                               gradeInfo?.remarkArabic === 'نجح' ? 'text-green-600' : 'text-red-600'
//                             }`}>
//                               {gradeInfo?.remarkArabic || '-'}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
                    
//                     {/* Total Row */}
//                     <tr className="bg-gray-100 font-bold">
//                       <td className="border border-gray-300 p-2">
//                         Total / المجموع
//                       </td>
//                       <td className="border border-gray-300 p-2 text-center">
//                         {subjects.length * 100}
//                       </td>
//                       <td className="border border-gray-300 p-2 text-center text-lg text-green-700">
//                         {reportData.totalScore}
//                       </td>
//                       <td className="border border-gray-300 p-2 text-center" colSpan="2">
//                         Average: {reportData.average}%
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Teacher's Comments */}
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-bold mb-2">Class Teacher's Remarks - ملاحظات معلم الصف</h4>
//                 <div className="min-h-[60px] border-b-2 border-gray-300 pb-2">
//                   {/* This can be filled from results if you add classTeacherRemark */}
//                   <p className="text-gray-600 italic">
//                     {reportData.results[0]?.classTeacherRemark || 'Keep up the good work!'}
//                   </p>
//                 </div>
//               </div>

//               {/* Grading Scale */}
//               <div className="mb-6">
//                 <h4 className="font-bold mb-3 text-center">Grading Scale - مقياس التقديرات</h4>
//                 <div className="grid grid-cols-5 gap-2 text-sm">
//                   <div className="text-center p-2 bg-green-100 rounded">
//                     <div className="font-bold">90-100</div>
//                     <div>Excellent</div>
//                     <div dir="rtl">ممتاز</div>
//                   </div>
//                   <div className="text-center p-2 bg-blue-100 rounded">
//                     <div className="font-bold">80-89</div>
//                     <div>Very Good</div>
//                     <div dir="rtl">جيد جداً</div>
//                   </div>
//                   <div className="text-center p-2 bg-yellow-100 rounded">
//                     <div className="font-bold">60-79</div>
//                     <div>Good</div>
//                     <div dir="rtl">جيد</div>
//                   </div>
//                   <div className="text-center p-2 bg-orange-100 rounded">
//                     <div className="font-bold">50-59</div>
//                     <div>Pass</div>
//                     <div dir="rtl">مقبول</div>
//                   </div>
//                   <div className="text-center p-2 bg-red-100 rounded">
//                     <div className="font-bold">0-49</div>
//                     <div>Fail</div>
//                     <div dir="rtl">راسب</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Signatures */}
//               <div className="grid grid-cols-3 gap-8 mt-8 pt-6 border-t-2 border-gray-300">
//                 <div className="text-center">
//                   <div className="border-t-2 border-gray-400 pt-2 mt-12">
//                     <p className="font-semibold">Class Teacher</p>
//                     <p className="text-sm" dir="rtl">معلم الصف</p>
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="border-t-2 border-gray-400 pt-2 mt-12">
//                     <p className="font-semibold">Principal</p>
//                     <p className="text-sm" dir="rtl">المدير</p>
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="border-t-2 border-gray-400 pt-2 mt-12">
//                     <p className="font-semibold">Date</p>
//                     <p className="text-sm" dir="rtl">التاريخ</p>
//                     <p className="text-sm mt-1">{new Date().toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .fixed.inset-0 * {
//             visibility: visible;
//           }
//           .fixed.inset-0 {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             height: auto;
//             background: white;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//           @page {
//             margin: 0.5cm;
//             size: A4;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };


// Number to Arabic words converter

// Number to Arabic words converter


// Number to Arabic words converter

// Number to Arabic words converter

// Number to Arabic words converter

const numberToArabicWords = (num) => {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  
  if (num === 100) return 'مائة';
  if (num === 0) return 'صفر';
  
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  let result = [];
  if (h > 0) result.push(hundreds[h]);
  if (t > 1) result.push(tens[t]);
  if (t === 1) result.push('عشرة');
  if (o > 0 && t !== 1) result.push(ones[o]);
  
  return result.join(' و ') || 'صفر';
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
      const { resultsManager, studentsManager } = await import('../../lib/appwrite');
      
      const resultsResponse = await resultsManager.getByStudent(student.$id);
      const classStudentsResponse = await studentsManager.getByClass(student.classId);
      
      if (resultsResponse.success && classStudentsResponse.success) {
        const results = resultsResponse.results;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const totalMax = results.length * 100;
        const percentage = results.length > 0 ? ((totalScore / totalMax) * 100).toFixed(2) : 0;
        
        const classPosition = await calculateClassPosition(
          student.$id, 
          classStudentsResponse.students,
          resultsManager
        );
        
        // Calculate overall grade
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
      }
    } catch (error) {
      console.error('Error loading report card:', error);
      alert('Failed to load report card data');
    } finally {
      setLoading(false);
    }
  };

  const calculateClassPosition = async (studentId, classStudents, resultsManager) => {
    try {
      const studentsWithScores = await Promise.all(
        classStudents.map(async (s) => {
          const res = await resultsManager.getByStudent(s.$id);
          const total = res.success 
            ? res.results.reduce((sum, r) => sum + r.score, 0) 
            : 0;
          return { studentId: s.$id, totalScore: total };
        })
      );

      studentsWithScores.sort((a, b) => b.totalScore - a.totalScore);
      const position = studentsWithScores.findIndex(s => s.studentId === studentId) + 1;
      return position;
    } catch (error) {
      console.error('Error calculating position:', error);
      return 0;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPositionSuffix = (position) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  const calculateGrade = (score) => {
    if (score >= 90) return { english: 'Excellent', arabic: 'ممتاز', remarkArabic: 'نجح' };
    if (score >= 80) return { english: 'Very Good', arabic: 'جيد جداً', remarkArabic: 'نجح' };
    if (score >= 60) return { english: 'Good', arabic: 'جيد', remarkArabic: 'نجح' };
    if (score >= 50) return { english: 'Pass', arabic: 'مقبول', remarkArabic: 'نجح' };
    return { english: 'Fail', arabic: 'راسب', remarkArabic: 'راسب' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
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
          <div className="p-8 print:p-4 bg-white relative">
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
              {/* Replace with your logo image: */}
              {/* <img src="/watermark-logo.png" alt="Watermark" className="w-64 h-64 object-contain" /> */}
              <div className="w-64 h-64 border-4 border-gray-400 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold">LOGO</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header Section with Logos */}
              <div className="flex items-start justify-between mb-3">
                {/* Left Logo */}
                <div className="w-20 h-20 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  {/* Replace with: <img src="/left-logo.png" alt="Logo" className="w-20 h-20 object-contain" /> */}
                  <span className="text-xs">Logo</span>
                </div>

                {/* Center Header */}
                <div className="flex-1 text-center px-4">
                  <p className="text-xs mb-1">بسم الله الرحمن الرحيم</p>
                  <h1 className="text-base font-bold mb-1">معهد دار المؤمن للدراسات العربية والإسلامية</h1>
                  <h2 className="text-sm font-bold mb-1">
                    DAARUL MUHMIN INSTITUTE OF ARABIC AND ISLAMIC STUDIES
                  </h2>
                  <div className="text-xs font-semibold border-t border-b border-gray-400 py-0.5">
                    <span>REPORT SHEET كشف الدرجات</span>
                    <span className="mx-4">    </span>
                    <span>EXAMINATION OFFICE إدارة الإمتحانات</span>
                  </div>
                </div>

                {/* Right Logo */}
                <div className="w-20 h-20 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  {/* Replace with: <img src="/right-logo.png" alt="Logo" className="w-20 h-20 object-contain" /> */}
                  <span className="text-xs">Logo</span>
                </div>
              </div>

              {/* Student Information Section */}
              <div className="mb-3 text-sm border-t-2 border-black pt-2">
                {/* Name Row - With space between English and Arabic */}
                <div className="flex items-center mb-1.5">
                  <span className="font-semibold w-16">Name:</span>
                  <span className="flex-1 border-b border-dotted border-gray-600 px-2">
                    {student.fullName} {student.arabicName && `( ${student.arabicName} )`}
                  </span>
                  <span className="mr-2" dir="rtl">اسم الطالب</span>
                </div>

                {/* Session Row - With space between names */}
                <div className="flex items-center mb-1.5">
                  <span className="font-semibold w-16">Session:</span>
                  <span className="flex-1 border-b border-dotted border-gray-600 px-2">
                    {session?.sessionName} {session?.sessionNameArabic && `/ ${session.sessionNameArabic}`}
                  </span>
                  <span className="mr-2" dir="rtl">العام الدراسي</span>
                </div>

                {/* Position, No. in Class, Class Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center flex-1">
                    <span className="font-semibold whitespace-nowrap">Position:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 px-2 mx-1">
                      {reportData.classPosition}{getPositionSuffix(reportData.classPosition)}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap">الترتيب</span>
                  </div>

                  <div className="flex items-center flex-1">
                    <span className="font-semibold whitespace-nowrap">No. in Class:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 px-2 mx-1">
                      {reportData.totalStudents}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap">عدد الطلاب</span>
                  </div>

                  <div className="flex items-center flex-1">
                    <span className="font-semibold whitespace-nowrap">Class:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 px-2 mx-1">
                      {classInfo?.className}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap">الصف</span>
                  </div>
                </div>
              </div>

              {/* Grades Table - RIGHT TO LEFT with TWO separate columns for التقدير and ملحوظة */}
              <table className="w-full border-2 border-black text-xs mb-3" dir="rtl">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="border-l-2 border-black p-1 w-8 text-center">ت</th>
                    <th className="border-l-2 border-black p-1 text-center">
                      المواد الدراسية<br/>SUBJECT
                    </th>
                    <th className="border-l-2 border-black p-1 w-16 text-center">
                      الدرجة
                    </th>
                    <th className="border-l-2 border-black p-1 w-16 text-center">
                      رقماً
                    </th>
                    <th className="border-l-2 border-black p-1 w-24 text-center">
                      كتابة
                    </th>
                    <th className="border-l-2 border-black p-1 w-20 text-center">
                      التقدير
                    </th>
                    <th className="p-1 w-20 text-center">
                      ملحوظة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => {
                    const result = reportData.results.find(r => r.subjectId === subject.$id);
                    const gradeInfo = result ? calculateGrade(result.score) : null;
                    const scoreInWords = result ? numberToArabicWords(result.score) : '';
                    
                    return (
                      <tr key={subject.$id} className="border-b border-black">
                        <td className="border-l-2 border-black p-1 text-center">{index + 1}</td>
                        <td className="border-l-2 border-black p-1">
                          <div className="flex justify-between items-center">
                            <span>{subject.arabicName}</span>
                            <span className="text-gray-600 text-left">{subject.englishName}</span>
                          </div>
                        </td>
                        <td className="border-l-2 border-black p-1 text-center font-bold">100</td>
                        <td className="border-l-2 border-black p-1 text-center font-bold">
                          {result ? result.score : ''}
                        </td>
                        <td className="border-l-2 border-black p-1 text-center">
                          <span className="text-xs">{scoreInWords}</span>
                        </td>
                        <td className="border-l-2 border-black p-1 text-center">
                          {gradeInfo?.arabic || ''}
                        </td>
                        <td className="p-1 text-center">
                          <span className={result && result.score >= 50 ? '' : 'text-red-600'}>
                            {gradeInfo?.remarkArabic || ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Row - Subject column merged, numbers span other columns */}
                  <tr className="border-t-2 border-black font-bold">
                    <td className="border-l-2 border-black p-2 text-center" colSpan="2">
                      المجموع الكلي<br/>TOTAL
                    </td>
                    <td className="border-l-2 border-black p-2 text-center">
                      {reportData.totalMax}
                    </td>
                    <td className="p-2 text-center text-base" colSpan="4">
                      {reportData.totalScore}
                    </td>
                  </tr>

                  {/* Percentage Row */}
                  <tr className="border-t border-black font-bold">
                    <td className="border-l-2 border-black p-2 text-center" colSpan="2">
                      النسبة المئوية<br/>PERCENTAGE
                    </td>
                    <td className="p-2 text-center text-base" colSpan="5">
                      {reportData.percentage}%
                    </td>
                  </tr>

                  {/* Grade Row */}
                  <tr className="border-t border-black font-bold">
                    <td className="border-l-2 border-black p-2 text-center" colSpan="2">
                      التقدير العام<br/>GRADE
                    </td>
                    <td className="p-2 text-center text-base" colSpan="5">
                      {reportData.overallGrade.arabic} / {reportData.overallGrade.english}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Next Term & Promoted Section */}
              <div className="grid grid-cols-2 gap-4 mb-2 text-xs">
                <div className="flex items-center">
                  <span className="font-semibold whitespace-nowrap">Next Term Begins:</span>
                  <span className="flex-1 border-b border-dotted border-gray-600 mx-2"></span>
                  <span dir="rtl" className="whitespace-nowrap">بداية الفصل الدراسي الجديد</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold whitespace-nowrap">Promoted:</span>
                  <span className="flex-1 border-b border-dotted border-gray-600 mx-2"></span>
                  <span dir="rtl" className="whitespace-nowrap">منقول إلى</span>
                </div>
              </div>

              {/* Class Teacher's Remark - Centered under line */}
              <div className="mb-2 text-xs">
                <div className="flex items-center mb-1">
                  <span className="font-semibold whitespace-nowrap">Class Teacher's Remark:</span>
                  <span className="flex-1"></span>
                  <span dir="rtl" className="whitespace-nowrap">ملاحظة المدرس</span>
                </div>
                <div className="border-b border-dotted border-gray-600 min-h-[50px] flex items-end justify-center pb-1" dir="rtl">
                  {/* Teacher's remark in Arabic centered under the line */}
                  <span className="text-center">
                    {/* Add teacher remark here */}
                  </span>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold whitespace-nowrap">Principal's Sign:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[50px] flex items-end justify-center">
                      {/* Replace with: <img src="/principal-signature.png" alt="Signature" className="h-12 object-contain" /> */}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap">توقيع الوكيل</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="font-semibold whitespace-nowrap">Signature:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[50px]"></span>
                    <span dir="rtl" className="whitespace-nowrap">التوقيع</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold whitespace-nowrap">Date:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2">
                      {new Date().toLocaleDateString()}
                    </span>
                    <span dir="rtl" className="whitespace-nowrap">التاريخ</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-semibold whitespace-nowrap">Stamp:</span>
                    <span className="flex-1 border-b border-dotted border-gray-600 mx-2 min-h-[80px]"></span>
                    <span dir="rtl" className="whitespace-nowrap">الختم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};


// ============================================
// MODAL COMPONENTS - SESSION & CLASS
// ============================================

// Session Modal (Create & Edit)
const SessionModal = ({ isOpen, onClose, onSave, editingSession }) => {
  const [formData, setFormData] = useState({
    sessionName: '',
    sessionNameArabic: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    if (editingSession) {
      setFormData({
        sessionName: editingSession.sessionName || '',
        sessionNameArabic: editingSession.sessionNameArabic || '',
        startDate: editingSession.startDate || '',
        endDate: editingSession.endDate || '',
        isActive: editingSession.isActive ?? true
      });
    } else {
      setFormData({
        sessionName: '',
        sessionNameArabic: '',
        startDate: '',
        endDate: '',
        isActive: true
      });
    }
  }, [editingSession, isOpen]);

  const handleSubmit = () => {
    onSave(formData, editingSession?.$id);
    setFormData({ sessionName: '', sessionNameArabic: '', startDate: '', endDate: '', isActive: true });
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
      {/* <Input
        label="Class Teacher"
        value={formData.classTeacher}
        onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
        placeholder="e.g., Ustadh Ahmad"
      /> */}
      {/* <Input
        label="Teacher Name (Arabic) - اسم المعلم بالعربية"
        value={formData.classTeacherArabic}
        onChange={(e) => setFormData({ ...formData, classTeacherArabic: e.target.value })}
        placeholder="الأستاذ أحمد"
        dir="rtl"
      /> */}
      {/* <Input
        label="Capacity"
        type="number"
        value={formData.capacity}
        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
        required
      /> */}
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

//  Student Modal (Create & Edit)
// Student Modal (Create & Edit) - Simplified Version
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
      
      {/* <div className="mb-4">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          rows="3"
          placeholder="Subject description..."
        />
      </div> */}
      
      {/* <div className="mb-4">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Description (Arabic) - الوصف</label>
        <textarea
          value={formData.descriptionArabic}
          onChange={(e) => setFormData({ ...formData, descriptionArabic: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          rows="3"
          placeholder="وصف المادة..."
          dir="rtl"
        />
      </div> */}
      
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
        <p className="text-sm text-gray-400">
          {/* Use the dynamically passed studentCount instead of stored currentEnrollment */}
          Students: {studentCount || 0}/{classItem.capacity}
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
    setCurrentView('students');
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
                  <Card>
                    <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                    <EmptyState
                      icon={Settings}
                      title="Settings Panel"
                      description="System settings coming soon..."
                    />
                  </Card>
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