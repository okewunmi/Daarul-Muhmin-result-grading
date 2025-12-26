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
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  platform: "5-fingerprint",
  projectId: "68e83bca0016577d1322",
  databaseId: "68e84359003dccd0b700",
  usersCollectionId: "user",
  studentsCollectionId: "student",
  studentAuthCollectionId: "studentauth",
  bucketId: "68ecda1b0032528659b2",
  coursesCollectionId: "courses",
  courseRegistrationCollectionId: "courseregistration",
  attendanceCollectionId: "attendance",
  attendance_sessions: "attendance_sessions",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  studentsCollectionId,
  coursesCollectionId,
  bucketId,
  courseRegistrationCollectionId,
  attendanceCollectionId,
  attendance_sessions
} = config;

export { config };

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Appwrite Authentication Functions
export const appwriteAuth = {
  // Create a new account
  createAccount: async (email, password, name) => {
    try {
      console.log('Creating account for:', { email, name });
      
      // Real Appwrite implementation
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      // Create email session immediately after registration
      await account.createEmailSession(email, password);
      
      return {
        success: true,
        message: 'Account created successfully!',
        user: {
          $id: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create account'
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      console.log('Logging in:', email);
      
      // Real Appwrite implementation
      await account.createEmailSession(email, password);
      
      // Get current user
      const currentUser = await account.get();
      
      return {
        success: true,
        user: {
          $id: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name
        },
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Invalid email or password'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log('Logging out...');
      
      // Real Appwrite implementation
      await account.deleteSession('current');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.message || 'Failed to logout'
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      // Real Appwrite implementation
      return await account.get();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const user = await account.get();
      return user !== null;
    } catch (error) {
      return false;
    }
  },

  // Delete account (optional)
  deleteAccount: async () => {
    try {
      await account.delete();
      return {
        success: true,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete account'
      };
    }
  }
};