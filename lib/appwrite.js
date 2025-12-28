import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Role,
  Permission
} from 'appwrite';

// Configuration
const config = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  platform: "Daarul-Muhmin",
  projectId: "694ec3480029a8f2b0c0",
  DATABASE_ID: "694ee58c0003eac348b9",
  USERS_COLLECTION_ID: "userauth",
  ACADEMIC_SESSIONS_COLLECTION_ID: "academicSessions",
  CLASSES_COLLECTION_ID: "classes",
  STUDENTS_COLLECTION_ID: "students",
  SUBJECTS_COLLECTION_ID: "subjects",
  RESULTS_COLLECTION_ID: "results"
};

const {
  endpoint,
  platform,
  projectId,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  ACADEMIC_SESSIONS_COLLECTION_ID,
  CLASSES_COLLECTION_ID,
  STUDENTS_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID,
  RESULTS_COLLECTION_ID,
} = config;

// Initialize Client
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Export config and instances
export { 
  config,
  client,
  account, 
  databases, 
  storage,
  Query,
  ID,
  Permission,
  Role
};

// Password hashing utilities
const hashPassword = async (password) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

const verifyPassword = async (password, hashedPassword) => {
  try {
    const hash = await hashPassword(password);
    return hash === hashedPassword;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

export const gradingSystem = {
  calculateGrade: (score) => {
    const grades = {
      english: '',
      arabic: '',
      remark: '',
      remarkArabic: ''
    };

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
      'Third Term': 'الفصل الثالث'
    };
    return terms[termEnglish] || '';
  }
};

// User Management Functions
export const adminUserManagement = {
  
  isConfigured: () => {
  // Don't check for window - this will fail during SSR
  // Just check if required config values exist
  
  if (!client || !databases) {
    console.error('Appwrite client not initialized');
    return false;
  }
  
  if (!projectId || !DATABASE_ID || !USERS_COLLECTION_ID) {
    console.error('Appwrite configuration is incomplete');
    console.error('Config values:', { projectId, DATABASE_ID, USERS_COLLECTION_ID });
    return false;
  }
  
  console.log('✅ Appwrite is properly configured');
  return true;
},

  // Admin creates a new user account
  createUser: async (fullName, arabicName, email, password, confirmPassword, adminEmail) => {
    try {
      console.log('Starting user creation...', { fullName, email });

      // Check configuration
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured. Please check your configuration.'
        };
      }

      // Validate passwords match
      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      // Validate password strength
      if (password.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      // Check if email already exists
      console.log('Checking for existing user...');
      const existingUsers = await databases.listDocuments(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        [Query.equal('email', email.toLowerCase())]
      );

      if (existingUsers.documents.length > 0) {
        return {
          success: false,
          message: 'A user with this email already exists'
        };
      }

      // Hash the password
      console.log('Hashing password...');
      const passwordHash = await hashPassword(password);

      // Create user document
      console.log('Creating user document...');
      const newUser = await databases.createDocument(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        ID.unique(),
        {
          fullName: fullName.trim(),
          arabicName: arabicName?.trim() || '',
          email: email.toLowerCase().trim(),
          passwordHash: passwordHash,
          isActive: true,
          createdBy: adminEmail || 'self-registration',
          createdAt: new Date().toISOString()
        }
      );

      console.log('✅ User created successfully:', newUser.$id);

      return {
        success: true,
        message: 'Account created successfully!',
        user: {
          $id: newUser.$id,
          fullName: newUser.fullName,
          arabicName: newUser.arabicName,
          email: newUser.email,
        }
      };
    } catch (error) {
      console.error('❌ Create user error:', error);
      
      // More specific error messages
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.'
        };
      }
      
      if (error.code === 401) {
        return {
          success: false,
          message: 'Authentication error. Please check your Appwrite project configuration.'
        };
      }

      if (error.code === 404) {
        return {
          success: false,
          message: 'Database or collection not found. Please check your Appwrite setup.'
        };
      }

      if (error.message?.includes('Missing required attribute')) {
        return {
          success: false,
          message: 'Missing required fields. Please check your collection attributes.'
        };
      }

      return {
        success: false,
        message: error.message || 'Failed to create account. Please try again.'
      };
    }
  },

  // User login
  login: async (email, password) => {
    try {
      console.log('Attempting login for:', email);

      // Check configuration
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured. Please check your configuration.'
        };
      }

      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          message: 'Please provide both email and password'
        };
      }

      // Find user by email
      console.log('Searching for user...');
      const users = await databases.listDocuments(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        [Query.equal('email', email.toLowerCase().trim())]
      );

      if (users.documents.length === 0) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      const user = users.documents[0];

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is inactive. Please contact administrator'
        };
      }

      // Verify password
      console.log('Verifying password...');
      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      console.log('✅ Login successful');

      return {
        success: true,
        message: 'Login successful!',
        user: {
          $id: user.$id,
          fullName: user.fullName,
          arabicName: user.arabicName,
          email: user.email,
        }
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.'
        };
      }

      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  },
  logout: async () => {
    try {
      console.log('Logging out...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to logout' };
    }
  },

  getCurrentUser: async () => {
    try {
      // Since we're using custom auth (not Appwrite's built-in auth),
      // we don't have a session to check
      // Return null to indicate no user is logged in
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured.',
          users: []
        };
      }

      const users = await databases.listDocuments(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        [Query.orderDesc('createdAt')]
      );

      return {
        success: true,
        users: users.documents.map(user => ({
          $id: user.$id,
          fullName: user.fullName,
          arabicName: user.arabicName,
          email: user.email,
          isActive: user.isActive,
          createdBy: user.createdBy,
          createdAt: user.createdAt
        }))
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        message: 'Failed to fetch users',
        users: []
      };
    }
  },

  // Update user (Admin only)
  updateUser: async (userId, updates) => {
    try {
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured.'
        };
      }

      // Remove sensitive fields
      const { passwordHash, password, ...safeUpdates } = updates;

      const updatedUser = await databases.updateDocument(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        userId,
        safeUpdates
      );

      return {
        success: true,
        message: 'User updated successfully',
        user: {
          $id: updatedUser.$id,
          fullName: updatedUser.fullName,
          arabicName: updatedUser.arabicName,
          email: updatedUser.email,
          isActive: updatedUser.isActive
        }
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: 'Failed to update user'
      };
    }
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    try {
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured.'
        };
      }

      await databases.deleteDocument(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        userId
      );

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: 'Failed to delete user'
      };
    }
  },

  // Reset password (Admin only)
  resetPassword: async (userId, newPassword, confirmPassword) => {
    try {
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured.'
        };
      }

      if (newPassword !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      if (newPassword.length < 8) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long'
        };
      }

      const passwordHash = await hashPassword(newPassword);

      await databases.updateDocument(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        userId,
        { passwordHash: passwordHash }
      );

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password'
      };
    }
  }
};

// ============================================
// ACADEMIC SESSIONS MANAGEMENT (BILINGUAL)
// ============================================
export const academicSessionsManager = {
  create: async (sessionData, adminEmail) => {
    try {
      const newSession = await databases.createDocument(
        config.DATABASE_ID,
        config.ACADEMIC_SESSIONS_COLLECTION_ID,
        ID.unique(),
        {
          sessionName: sessionData.sessionName,
          sessionNameArabic: sessionData.sessionNameArabic || '',
          startDate: sessionData.startDate,
          endDate: sessionData.endDate,
          isActive: sessionData.isActive,
          createdAt: new Date().toISOString(),
          createdBy: adminEmail
        }
      );

      return {
        success: true,
        message: 'Academic session created successfully',
        session: newSession
      };
    } catch (error) {
      console.error('Create session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create session'
      };
    }
  },

  getAll: async () => {
    try {
      const sessions = await databases.listDocuments(
        config.DATABASE_ID,
        config.ACADEMIC_SESSIONS_COLLECTION_ID,
        [Query.orderDesc('createdAt')]
      );

      return {
        success: true,
        sessions: sessions.documents
      };
    } catch (error) {
      console.error('Get sessions error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch sessions',
        sessions: []
      };
    }
  },

  getActive: async () => {
    try {
      const sessions = await databases.listDocuments(
        config.DATABASE_ID,
        config.ACADEMIC_SESSIONS_COLLECTION_ID,
        [Query.equal('isActive', true)]
      );

      return {
        success: true,
        session: sessions.documents[0] || null
      };
    } catch (error) {
      console.error('Get active session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch active session',
        session: null
      };
    }
  },

  update: async (sessionId, updates) => {
    try {
      const updatedSession = await databases.updateDocument(
        config.DATABASE_ID,
        config.ACADEMIC_SESSIONS_COLLECTION_ID,
        sessionId,
        updates
      );

      return {
        success: true,
        message: 'Session updated successfully',
        session: updatedSession
      };
    } catch (error) {
      console.error('Update session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update session'
      };
    }
  },

  delete: async (sessionId) => {
    try {
      await databases.deleteDocument(
        config.DATABASE_ID,
        config.ACADEMIC_SESSIONS_COLLECTION_ID,
        sessionId
      );

      return {
        success: true,
        message: 'Session deleted successfully'
      };
    } catch (error) {
      console.error('Delete session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete session'
      };
    }
  }
};

// ============================================
// CLASSES MANAGEMENT (BILINGUAL)
// ============================================
export const classesManager = {
  create: async (classData, adminEmail) => {
    try {
      const newClass = await databases.createDocument(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        ID.unique(),
        {
          className: classData.className,
          classNameArabic: classData.classNameArabic || '',
          academicSessionId: classData.academicSessionId,
          // classTeacher: classData.classTeacher || '',
          // classTeacherArabic: classData.classTeacherArabic || '',
          // capacity: classData.capacity || 30,
          currentEnrollment: 0,
          createdAt: new Date().toISOString(),
          createdBy: adminEmail
        }
      );

      return {
        success: true,
        message: 'Class created successfully',
        class: newClass
      };
    } catch (error) {
      console.error('Create class error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create class'
      };
    }
  },

  getAll: async () => {
    try {
      const classes = await databases.listDocuments(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        [Query.orderDesc('createdAt')]
      );

      return {
        success: true,
        classes: classes.documents
      };
    } catch (error) {
      console.error('Get classes error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch classes',
        classes: []
      };
    }
  },

  getBySession: async (sessionId) => {
    try {
      const classes = await databases.listDocuments(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        [Query.equal('academicSessionId', sessionId)]
      );

      return {
        success: true,
        classes: classes.documents
      };
    } catch (error) {
      console.error('Get classes by session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch classes',
        classes: []
      };
    }
  },

  update: async (classId, updates) => {
    try {
      const updatedClass = await databases.updateDocument(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        classId,
        updates
      );

      return {
        success: true,
        message: 'Class updated successfully',
        class: updatedClass
      };
    } catch (error) {
      console.error('Update class error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update class'
      };
    }
  },

  delete: async (classId) => {
    try {
      await databases.deleteDocument(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        classId
      );

      return {
        success: true,
        message: 'Class deleted successfully'
      };
    } catch (error) {
      console.error('Delete class error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete class'
      };
    }
  },

  // Update enrollment count
  updateEnrollment: async (classId) => {
    try {
      // Get student count for this class
      const students = await databases.listDocuments(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        [Query.equal('classId', classId), Query.equal('isActive', true)]
      );

      // Update class enrollment count
      await databases.updateDocument(
        config.DATABASE_ID,
        config.CLASSES_COLLECTION_ID,
        classId,
        { currentEnrollment: students.documents.length }
      );

      return {
        success: true,
        count: students.documents.length
      };
    } catch (error) {
      console.error('Update enrollment error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update enrollment'
      };
    }
  }
};

// ============================================
// STUDENTS MANAGEMENT (BILINGUAL)
// ============================================
export const studentsManager = {
 
create: async (studentData, adminEmail) => {
  try {
    // No registration number check - allowing multiple students with same/no reg number
    
    const newStudent = await databases.createDocument(
      config.DATABASE_ID,
      config.STUDENTS_COLLECTION_ID,
      ID.unique(),
      {
        fullName: studentData.fullName,
        arabicName: studentData.arabicName || '',
        gender: studentData.gender || 'Male',
        classId: studentData.classId, // IMPORTANT: Must include this
        academicSessionId: studentData.academicSessionId, // IMPORTANT: Must include this
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: adminEmail,
        updatedAt: new Date().toISOString()
      }
    );

    // Update class enrollment count
    if (studentData.classId) {
      await classesManager.updateEnrollment(studentData.classId);
    }

    return {
      success: true,
      message: 'Student added successfully',
      student: newStudent
    };
  } catch (error) {
    console.error('Create student error:', error);
    return {
      success: false,
      message: error.message || 'Failed to add student'
    };
  }
},
  getAll: async () => {
    try {
      const students = await databases.listDocuments(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        [Query.orderDesc('createdAt'), Query.limit(100)]
      );

      return {
        success: true,
        students: students.documents
      };
    } catch (error) {
      console.error('Get students error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch students',
        students: []
      };
    }
  },

  getByClass: async (classId) => {
    try {
      const students = await databases.listDocuments(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        [Query.equal('classId', classId), Query.equal('isActive', true)]
      );

      return {
        success: true,
        students: students.documents
      };
    } catch (error) {
      console.error('Get students by class error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch students',
        students: []
      };
    }
  },

  getBySession: async (sessionId) => {
    try {
      const students = await databases.listDocuments(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        [Query.equal('academicSessionId', sessionId)]
      );

      return {
        success: true,
        students: students.documents
      };
    } catch (error) {
      console.error('Get students by session error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch students',
        students: []
      };
    }
  },

  getById: async (studentId) => {
    try {
      const student = await databases.getDocument(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        studentId
      );

      return {
        success: true,
        student: student
      };
    } catch (error) {
      console.error('Get student error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch student',
        student: null
      };
    }
  },

  update: async (studentId, updates) => {
    try {
      const updatedStudent = await databases.updateDocument(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        studentId,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );

      return {
        success: true,
        message: 'Student updated successfully',
        student: updatedStudent
      };
    } catch (error) {
      console.error('Update student error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update student'
      };
    }
  },

  delete: async (studentId) => {
    try {
      // Get student to find their class
      const studentResult = await studentsManager.getById(studentId);
      const classId = studentResult.student?.classId;

      await databases.deleteDocument(
        config.DATABASE_ID,
        config.STUDENTS_COLLECTION_ID,
        studentId
      );

      // Update class enrollment count
      if (classId) {
        await classesManager.updateEnrollment(classId);
      }

      return {
        success: true,
        message: 'Student deleted successfully'
      };
    } catch (error) {
      console.error('Delete student error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete student'
      };
    }
  }
};

// ============================================
// SUBJECTS MANAGEMENT (BILINGUAL)
// ============================================
export const subjectsManager = {
  create: async (subjectData, adminEmail) => {
    try {
      const newSubject = await databases.createDocument(
        config.DATABASE_ID,
        config.SUBJECTS_COLLECTION_ID,
        ID.unique(),
        {
          englishName: subjectData.englishName,
          arabicName: subjectData.arabicName,
          // subjectCode: subjectData.subjectCode || '',
          // description: subjectData.description || '',
          // descriptionArabic: subjectData.descriptionArabic || '',
          maxScore: subjectData.maxScore || 100,
          // passingScore: subjectData.passingScore || 50,
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: adminEmail
        }
      );

      return {
        success: true,
        message: 'Subject created successfully',
        subject: newSubject
      };
    } catch (error) {
      console.error('Create subject error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create subject'
      };
    }
  },

  getAll: async () => {
    try {
      const subjects = await databases.listDocuments(
        config.DATABASE_ID,
        config.SUBJECTS_COLLECTION_ID,
        [Query.equal('isActive', true)]
      );

      return {
        success: true,
        subjects: subjects.documents
      };
    } catch (error) {
      console.error('Get subjects error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch subjects',
        subjects: []
      };
    }
  },

  getById: async (subjectId) => {
    try {
      const subject = await databases.getDocument(
        config.DATABASE_ID,
        config.SUBJECTS_COLLECTION_ID,
        subjectId
      );

      return {
        success: true,
        subject: subject
      };
    } catch (error) {
      console.error('Get subject error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch subject',
        subject: null
      };
    }
  },

  update: async (subjectId, updates) => {
    try {
      const updatedSubject = await databases.updateDocument(
        config.DATABASE_ID,
        config.SUBJECTS_COLLECTION_ID,
        subjectId,
        updates
      );

      return {
        success: true,
        message: 'Subject updated successfully',
        subject: updatedSubject
      };
    } catch (error) {
      console.error('Update subject error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update subject'
      };
    }
  },

  delete: async (subjectId) => {
    try {
      await databases.updateDocument(
        config.DATABASE_ID,
        config.SUBJECTS_COLLECTION_ID,
        subjectId,
        { isActive: false }
      );

      return {
        success: true,
        message: 'Subject deactivated successfully'
      };
    } catch (error) {
      console.error('Delete subject error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete subject'
      };
    }
  }
};

// ============================================
// RESULTS/GRADES MANAGEMENT (BILINGUAL)
// ============================================
export const resultsManagers = {
  saveResult: async (resultData, adminEmail) => {
    try {
      // Calculate bilingual grades
      const gradeInfo = gradingSystem.calculateGrade(resultData.score);
      const termArabic = gradingSystem.getTermArabic(resultData.term);

      // Check if result already exists
      const existingResults = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        [
          Query.equal('studentId', resultData.studentId),
          Query.equal('subjectId', resultData.subjectId),
          Query.equal('academicSessionId', resultData.academicSessionId),
          Query.equal('term', resultData.term || 'First Term')
        ]
      );

      if (existingResults.documents.length > 0) {
        // Update existing result
        const updated = await databases.updateDocument(
          config.DATABASE_ID,
          config.RESULTS_COLLECTION_ID,
          existingResults.documents[0].$id,
          {
            score: resultData.score,
            grade: gradeInfo.english,
            gradeArabic: gradeInfo.arabic,
            remark: gradeInfo.remark,
            remarkArabic: gradeInfo.remarkArabic,
            teacherComment: resultData.teacherComment || '',
            teacherCommentArabic: resultData.teacherCommentArabic || '',
            classTeacherRemark: resultData.classTeacherRemark || '',
            classTeacherRemarkArabic: resultData.classTeacherRemarkArabic || '',
            updatedAt: new Date().toISOString()
          }
        );

        return {
          success: true,
          message: 'Result updated successfully',
          result: updated
        };
      } else {
        // Create new result
        const newResult = await databases.createDocument(
          config.DATABASE_ID,
          config.RESULTS_COLLECTION_ID,
          ID.unique(),
          {
            studentId: resultData.studentId,
            subjectId: resultData.subjectId,
            classId: resultData.classId,
            academicSessionId: resultData.academicSessionId,
            term: resultData.term || 'First Term',
            termArabic: termArabic,
            score: resultData.score,
            grade: gradeInfo.english,
            gradeArabic: gradeInfo.arabic,
            remark: gradeInfo.remark,
            remarkArabic: gradeInfo.remarkArabic,
            teacherComment: resultData.teacherComment || '',
            teacherCommentArabic: resultData.teacherCommentArabic || '',
            classTeacherRemark: resultData.classTeacherRemark || '',
            classTeacherRemarkArabic: resultData.classTeacherRemarkArabic || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: adminEmail
          }
        );

        return {
          success: true,
          message: 'Result saved successfully',
          result: newResult
        };
      }
    } catch (error) {
      console.error('Save result error:', error);
      return {
        success: false,
        message: error.message || 'Failed to save result'
      };
    }
  },

  getByStudent: async (studentId, sessionId = null, term = null) => {
    try {
      const queries = [Query.equal('studentId', studentId)];
      
      if (sessionId) {
        queries.push(Query.equal('academicSessionId', sessionId));
      }
      
      if (term) {
        queries.push(Query.equal('term', term));
      }

      const results = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        queries
      );

      return {
        success: true,
        results: results.documents
      };
    } catch (error) {
      console.error('Get student results error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch results',
        results: []
      };
    }
  },

  getByClass: async (classId, sessionId = null, term = null) => {
    try {
      const queries = [Query.equal('classId', classId)];
      
      if (sessionId) {
        queries.push(Query.equal('academicSessionId', sessionId));
      }
      
      if (term) {
        queries.push(Query.equal('term', term));
      }

      const results = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        queries
      );

      return {
        success: true,
        results: results.documents
      };
    } catch (error) {
      console.error('Get class results error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch results',
        results: []
      };
    }
  },

  delete: async (resultId) => {
    try {
      await databases.deleteDocument(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        resultId
      );

      return {
        success: true,
        message: 'Result deleted successfully'
      };
    } catch (error) {
      console.error('Delete result error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete result'
      };
    }
  }
};


export const resultsManager = {
  saveResult: async (resultData, adminEmail) => {
    try {
      // Calculate bilingual grades
      const gradeInfo = gradingSystem.calculateGrade(resultData.score);

      // Check if result already exists (no term check since single term)
      const existingResults = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        [
          Query.equal('studentId', resultData.studentId),
          Query.equal('subjectId', resultData.subjectId),
          Query.equal('academicSessionId', resultData.academicSessionId)
        ]
      );

      if (existingResults.documents.length > 0) {
        // Update existing result
        const updated = await databases.updateDocument(
          config.DATABASE_ID,
          config.RESULTS_COLLECTION_ID,
          existingResults.documents[0].$id,
          {
            score: resultData.score,
            grade: gradeInfo.english,
            gradeArabic: gradeInfo.arabic,
            remark: gradeInfo.remark,
            remarkArabic: gradeInfo.remarkArabic,
            teacherComment: resultData.teacherComment || '',
            teacherCommentArabic: resultData.teacherCommentArabic || '',
            classTeacherRemark: resultData.classTeacherRemark || '',
            classTeacherRemarkArabic: resultData.classTeacherRemarkArabic || '',
            updatedAt: new Date().toISOString()
          }
        );

        return {
          success: true,
          message: 'Result updated successfully',
          result: updated
        };
      } else {
        // Create new result
        const newResult = await databases.createDocument(
          config.DATABASE_ID,
          config.RESULTS_COLLECTION_ID,
          ID.unique(),
          {
            studentId: resultData.studentId,
            subjectId: resultData.subjectId,
            classId: resultData.classId,
            academicSessionId: resultData.academicSessionId,
            score: resultData.score,
            grade: gradeInfo.english,
            gradeArabic: gradeInfo.arabic,
            remark: gradeInfo.remark,
            remarkArabic: gradeInfo.remarkArabic,
            teacherComment: resultData.teacherComment || '',
            teacherCommentArabic: resultData.teacherCommentArabic || '',
            classTeacherRemark: resultData.classTeacherRemark || '',
            classTeacherRemarkArabic: resultData.classTeacherRemarkArabic || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: adminEmail
          }
        );

        return {
          success: true,
          message: 'Result saved successfully',
          result: newResult
        };
      }
    } catch (error) {
      console.error('Save result error:', error);
      return {
        success: false,
        message: error.message || 'Failed to save result'
      };
    }
  },

  getByStudent: async (studentId, sessionId = null) => {
    try {
      const queries = [Query.equal('studentId', studentId)];
      
      if (sessionId) {
        queries.push(Query.equal('academicSessionId', sessionId));
      }

      const results = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        queries
      );

      return {
        success: true,
        results: results.documents
      };
    } catch (error) {
      console.error('Get student results error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch results',
        results: []
      };
    }
  },

  getByClass: async (classId, sessionId = null) => {
    try {
      const queries = [Query.equal('classId', classId)];
      
      if (sessionId) {
        queries.push(Query.equal('academicSessionId', sessionId));
      }

      const results = await databases.listDocuments(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        queries
      );

      return {
        success: true,
        results: results.documents
      };
    } catch (error) {
      console.error('Get class results error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch results',
        results: []
      };
    }
  },

  delete: async (resultId) => {
    try {
      await databases.deleteDocument(
        config.DATABASE_ID,
        config.RESULTS_COLLECTION_ID,
        resultId
      );

      return {
        success: true,
        message: 'Result deleted successfully'
      };
    } catch (error) {
      console.error('Delete result error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete result'
      };
    }
  }
};
// Export as appwriteAuth for compatibility
export const appwriteAuth = adminUserManagement;