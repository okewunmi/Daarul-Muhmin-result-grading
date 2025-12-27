export const StudentRow = ({ student, onEdit, onDelete }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Users className="text-green-400" size={16} />
        <h4 className="text-base sm:text-lg font-bold text-white">{student.fullName}</h4>
        {student.isActive && <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>}
      </div>
      <p className="text-sm text-gray-400" dir="rtl">{student.arabicName}</p>
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

export const AddStudentModal = ({ isOpen, onClose, onSave, classId, sessionId }) => {
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

  const handleSubmit = () => {
    onSave({ 
      ...formData, 
      classId, 
      academicSessionId: sessionId,
      isActive: true 
    });
    setFormData({ 
      fullName: '', arabicName: '', email: '', registrationNumber: '', 
      gender: 'Male', dateOfBirth: '', parentName: '', parentNameArabic: '',
      parentPhone: '', parentEmail: '', address: '', addressArabic: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Student - إضافة طالب" size="lg">
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
        <Button onClick={handleSubmit} icon={Check}>Save Student</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

