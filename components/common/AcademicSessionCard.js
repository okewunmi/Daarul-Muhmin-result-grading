
export const AcademicSessionCard = ({ session, onView, onEdit, onDelete }) => (
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

export const AddSessionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    sessionName: '',
    sessionNameArabic: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ sessionName: '', sessionNameArabic: '', startDate: '', endDate: '', isActive: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Academic Session - إضافة سنة دراسية">
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
        <Button onClick={handleSubmit} icon={Check}>Save Session</Button>
        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

