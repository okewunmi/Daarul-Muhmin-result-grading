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
};

const {
  endpoint,
  platform,
  projectId,
  DATABASE_ID,
  USERS_COLLECTION_ID,
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

// User Management Functions
export const adminUserManagement = {
  
  // Check if Appwrite is properly configured
  isConfigured: () => {
    if (typeof window === 'undefined') {
      console.error('Running on server side - Appwrite requires client side');
      return false;
    }
    
    if (!client || !databases) {
      console.error('Appwrite client not initialized');
      return false;
    }
    
    if (!projectId || !DATABASE_ID || !USERS_COLLECTION_ID) {
      console.error('Appwrite configuration is incomplete');
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

  // Get current user from localStorage
  getCurrentUser: async () => {
    try {
      if (typeof window === 'undefined') return null;
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    try {
      if (typeof window === 'undefined') return false;
      
      const savedUser = localStorage.getItem('user');
      return savedUser !== null;
    } catch (error) {
      return false;
    }
  },

  // Logout (clear session)
  logout: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to logout'
      };
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

// Export as appwriteAuth for compatibility
export const appwriteAuth = adminUserManagement;