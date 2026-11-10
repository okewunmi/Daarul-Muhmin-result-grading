// Pure grading helpers. Used by both the browser and the server, so this
// file must not import anything server-only.

export const gradingSystem = {
  calculateGrade: (score) => {
    const grades = { english: '', arabic: '', remark: '', remarkArabic: '' };

    if (score >= 90 && score <= 100) {
      grades.english = 'Excellent';
      grades.arabic = 'ممتاز';
      grades.remark = 'Passed';
      grades.remarkArabic = 'نجح';
    } else if (score >= 80 && score < 90) {
      grades.english = 'Very Good';
      grades.arabic = 'جيد جداً';
      grades.remark = 'Passed';
      grades.remarkArabic = 'نجح';
    } else if (score >= 60 && score < 80) {
      grades.english = 'Good';
      grades.arabic = 'جيد';
      grades.remark = 'Passed';
      grades.remarkArabic = 'نجح';
    } else if (score >= 50 && score < 60) {
      grades.english = 'Pass';
      grades.arabic = 'مقبول';
      grades.remark = 'Passed';
      grades.remarkArabic = 'نجح';
    } else if (score >= 0 && score < 50) {
      grades.english = 'Fail';
      grades.arabic = 'راسب';
      grades.remark = 'Failed';
      grades.remarkArabic = 'راسب';
    }

    return grades;
  },

  getTermArabic: (termEnglish) => {
    const terms = {
      'First Term': 'الفصل الأول',
      'Second Term': 'الفصل الثاني',
      'Third Term': 'الفصل الثالث',
    };
    return terms[termEnglish] || '';
  },
};
