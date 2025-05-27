import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const UserService = {
  registerAdmin(adminData) {
    return axiosInstance.post('/register/admin', adminData);
  },

  registerOthers(userData) {
    return axiosInstance.post('/register/others', userData);
  },

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/login', credentials);
      const { userToken, user } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('currentUser', JSON.stringify(jwtDecode(userToken)));
    
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRole(username, roleData) {
    return axiosInstance.patch(`/role/${username}`, roleData);
  },

  fetchAllUsers() {
    return axiosInstance.get('/users');
  },

  async getUserByUsername(username) {
    try {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateCurrentUserInformation() {
    try {
      const username = localStorage.getItem('username');
      const user = await this.getUserByUsername(username);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  },

  getCurrentUser() {
    try {
      const currentUserData = localStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserData || "{}");
      
      return {
        ...currentUser,
        isAdmin: currentUser.role === 'admin',
        isEmployee: currentUser.role === 'employee',
        role: currentUser.role
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return {
        isAdmin: false,
        isEmployee: false,
        role: null
      };
    }
  },

  clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUser');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default UserService;