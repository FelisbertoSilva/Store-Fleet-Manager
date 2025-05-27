import axios from 'axios';

const STORE_SERVICE_BASE_URL = 'http://localhost:8080/api/stores';

const axiosInstance = axios.create({
  baseURL: STORE_SERVICE_BASE_URL,
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

const StoreService = {
  createStore(storeData) {
    return axiosInstance.post('/', storeData);
  },

  getAllStores() {
    return axiosInstance.get('/');
  },

  searchStoresByLocation(locationData) {
    return axiosInstance.post('/search', locationData);
  },

  getStoreByNome(nome) {
    return axiosInstance.get(`/${nome}`);
  },

  getStoreWithVehicles(nome) {
    return axiosInstance.get(`/${nome}/vehicles`);
  },

  countStoreDistrict() {
    return axiosInstance.get('/count');
  },

  countVehiclesByDistrict() {
    return axiosInstance.get('/vehicles/district');
  },

  updateStore(nome, updatedData) {
    return axiosInstance.put(`/${nome}`, updatedData);
  },

  deleteStore(nome) {
    return axiosInstance.delete(`/${nome}`);
  },
};

export default StoreService;
