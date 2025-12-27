export  const SubjectCard = ({ subject, onEdit, onDelete }) => (
  <Card>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <BookA className="text-purple-400" size={20} />
          <h3 className="text-base sm:text-lg font-bold text-white">{subject.englishName}</h3>
        </div>
        <p className="text-sm text-gray-400" dir="rtl">{subject.arabicName}</p>
        <div className="flex gap-3 text-xs text-gray-500 mt-2">
          <span>Max Score: {subject.maxScore}</span>
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

export const AddSubjectModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    englishName: '',
    arabicName: '',
    subjectCode: '',
    description: '',
    descriptionArabic: '',
    maxScore: 100,
    passingScore: 50
  });

  const handleSubmit = () => {
    onSave({ ...formData, isActive: true });
    setFormData({ 
      englishName: '', arabicName: '', subjectCode: '', 
      description: '', descriptionArabic: '', 
      maxScore: 100, passingScore: 50 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Subject - إضافة مادة" size="lg">
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
        <Button onClick={handleSubmit} icon={Check}>Save Subject</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

