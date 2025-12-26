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

export { 
  client,
  account, 
  databases, 
  storage,
  Query,
  ID,
  Permission,
  Role
};

const config = {
  endpoint: "https://cloud.appwrite.io/v1",
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

export { config };

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

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

export const adminUserManagement = {
  // Check if Appwrite is properly configured
  isConfigured: () => {
    if (!client || !databases) {
      console.error('Appwrite not initialized. Make sure you are on the client side.');
      return false;
    }
    if (projectId === '694ec3480029a8f2b0c0' || DATABASE_ID === '694ee58c0003eac348b9') {
      console.error('Appwrite configuration is missing. Please set your environment variables.');
      return false;
    }
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
          message: 'Appwrite is not properly configured. Please check your environment variables.'
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
        DATABASE_ID,
        USERS_COLLECTION_ID,
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
        DATABASE_ID,
        USERS_COLLECTION_ID,
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

      console.log('User created successfully:', newUser.$id);

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
      console.error('Create user error:', error);
      
      // More specific error messages
      if (error.message?.includes('network')) {
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
          message: 'Appwrite is not properly configured. Please check your environment variables.'
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
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
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

      console.log('Login successful');

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
      console.error('Login error:', error);
      
      if (error.message?.includes('network')) {
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

  // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      if (!adminUserManagement.isConfigured()) {
        return {
          success: false,
          message: 'Appwrite is not properly configured.'
        };
      }

      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
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
  }
};