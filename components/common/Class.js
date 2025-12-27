export const ClassCard = ({ classItem, onView, onEdit, onDelete, studentCount }) => (
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

export const AddClassModal = ({ isOpen, onClose, onSave, sessionId }) => {
  const [formData, setFormData] = useState({
    className: '',
    classNameArabic: '',
    classTeacher: '',
    classTeacherArabic: '',
    capacity: 30
  });

  const handleSubmit = () => {
    onSave({ ...formData, academicSessionId: sessionId });
    setFormData({ className: '', classNameArabic: '', classTeacher: '', classTeacherArabic: '', capacity: 30 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Class - إضافة صف">
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
        <Button onClick={handleSubmit} icon={Check}>Save Class</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

