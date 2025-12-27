'use client'
import { useState, useEffect } from 'react';
import { 
  Sun, Moon, BookOpen, Calendar, GraduationCap, Users, Settings, 
  Plus, LogOut, Edit2, Trash2, Eye, X, Check, BookA
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
    classTeacher: '',
    classTeacherArabic: '',
    capacity: 30
  });

  useEffect(() => {
    if (editingClass) {
      setFormData({
        className: editingClass.className || '',
        classNameArabic: editingClass.classNameArabic || '',
        classTeacher: editingClass.classTeacher || '',
        classTeacherArabic: editingClass.classTeacherArabic || '',
        capacity: editingClass.capacity || 30
      });
    } else {
      setFormData({
        className: '',
        classNameArabic: '',
        classTeacher: '',
        classTeacherArabic: '',
        capacity: 30
      });
    }
  }, [editingClass, isOpen]);

  const handleSubmit = () => {
    onSave({ ...formData, academicSessionId: sessionId }, editingClass?.$id);
    setFormData({ className: '', classNameArabic: '', classTeacher: '', classTeacherArabic: '', capacity: 30 });
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
      <Input
        label="Class Teacher"
        value={formData.classTeacher}
        onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
        placeholder="e.g., Ustadh Ahmad"
      />
      <Input
        label="Teacher Name (Arabic) - اسم المعلم بالعربية"
        value={formData.classTeacherArabic}
        onChange={(e) => setFormData({ ...formData, classTeacherArabic: e.target.value })}
        placeholder="الأستاذ أحمد"
        dir="rtl"
      />
      <Input
        label="Capacity"
        type="number"
        value={formData.capacity}
        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
        required
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

// Student Modal (Create & Edit)
const StudentModal = ({ isOpen, onClose, onSave, classId, sessionId, editingStudent }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    email: '',
    registrationNumber: '',
    gender: 'Male',
    dateOfBirth: '',
    parentName: '',
    parentNameArabic: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    addressArabic: ''
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        fullName: editingStudent.fullName || '',
        arabicName: editingStudent.arabicName || '',
        email: editingStudent.email || '',
        registrationNumber: editingStudent.registrationNumber || '',
        gender: editingStudent.gender || 'Male',
        dateOfBirth: editingStudent.dateOfBirth || '',
        parentName: editingStudent.parentName || '',
        parentNameArabic: editingStudent.parentNameArabic || '',
        parentPhone: editingStudent.parentPhone || '',
        parentEmail: editingStudent.parentEmail || '',
        address: editingStudent.address || '',
        addressArabic: editingStudent.addressArabic || ''
      });
    } else {
      setFormData({
        fullName: '',
        arabicName: '',
        email: '',
        registrationNumber: '',
        gender: 'Male',
        dateOfBirth: '',
        parentName: '',
        parentNameArabic: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        addressArabic: ''
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
      fullName: '', arabicName: '', email: '', registrationNumber: '', 
      gender: 'Male', dateOfBirth: '', parentName: '', parentNameArabic: '',
      parentPhone: '', parentEmail: '', address: '', addressArabic: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingStudent ? "Edit Student - تعديل طالب" : "Add Student - إضافة طالب"} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Input
          label="Registration Number"
          value={formData.registrationNumber}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          placeholder="REG001"
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="student@example.com"
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
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />
        <Input
          label="Parent Name"
          value={formData.parentName}
          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          placeholder="Enter parent name"
        />
        <Input
          label="Parent Name (Arabic) - اسم ولي الأمر"
          value={formData.parentNameArabic}
          onChange={(e) => setFormData({ ...formData, parentNameArabic: e.target.value })}
          placeholder="اسم ولي الأمر"
          dir="rtl"
        />
        <Input
          label="Parent Phone"
          value={formData.parentPhone}
          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
          placeholder="+234..."
        />
        <Input
          label="Parent Email"
          type="email"
          value={formData.parentEmail}
          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
          placeholder="parent@example.com"
        />
      </div>
      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        placeholder="Enter address"
      />
      <Input
        label="Address (Arabic) - العنوان"
        value={formData.addressArabic}
        onChange={(e) => setFormData({ ...formData, addressArabic: e.target.value })}
        placeholder="أدخل العنوان"
        dir="rtl"
      />
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
    subjectCode: '',
    description: '',
    descriptionArabic: '',
    maxScore: 100,
    passingScore: 50
  });

  useEffect(() => {
    if (editingSubject) {
      setFormData({
        englishName: editingSubject.englishName || '',
        arabicName: editingSubject.arabicName || '',
        subjectCode: editingSubject.subjectCode || '',
        description: editingSubject.description || '',
        descriptionArabic: editingSubject.descriptionArabic || '',
        maxScore: editingSubject.maxScore || 100,
        passingScore: editingSubject.passingScore || 50
      });
    } else {
      setFormData({
        englishName: '',
        arabicName: '',
        subjectCode: '',
        description: '',
        descriptionArabic: '',
        maxScore: 100,
        passingScore: 50
      });
    }
  }, [editingSubject, isOpen]);

  const handleSubmit = () => {
    onSave({ ...formData, isActive: true }, editingSubject?.$id);
    setFormData({
      englishName: '', arabicName: '', subjectCode: '', 
      description: '', descriptionArabic: '', 
      maxScore: 100, passingScore: 50
    });
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
        <Input
          label="Subject Code (Optional)"
          value={formData.subjectCode}
          onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
          placeholder="IS101"
        />
        <Input
          label="Max Score"
          type="number"
          value={formData.maxScore}
          onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
          required
        />
        <Input
          label="Passing Score"
          type="number"
          value={formData.passingScore}
          onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          rows="3"
          placeholder="Subject description..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Description (Arabic) - الوصف</label>
        <textarea
          value={formData.descriptionArabic}
          onChange={(e) => setFormData({ ...formData, descriptionArabic: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          rows="3"
          placeholder="وصف المادة..."
          dir="rtl"
        />
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
          Students: {studentCount || classItem.currentEnrollment || 0}/{classItem.capacity}
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

const StudentRow = ({ student, onEdit, onDelete }) => (
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
      <p className="text-xs text-gray-500">Reg: {student.registrationNumber}</p>
    </div>
    <div className="flex gap-2">
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
    </div>
  );
};

export default AdminDashboard;