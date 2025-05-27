import axios from 'axios';

const CAR_SERVICE_BASE_URL = 'http://localhost:5000/api';
const VEHICLE_SERVICE_BASE_URL = 'http://localhost:8080/api/vehicles';

const carAxiosInstance = axios.create({
  baseURL: CAR_SERVICE_BASE_URL,
});

const vehicleAxiosInstance = axios.create({
  baseURL: VEHICLE_SERVICE_BASE_URL,
});

const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

addAuthInterceptor(vehicleAxiosInstance);

const CarService = {
  getAllBrands() {
    return carAxiosInstance.get('/marcas');
  },

  getModelsByBrand(brand) {
    return carAxiosInstance.get(`/modelos/${brand}`);
  },

  createVehicle(vehicleData) {
    return vehicleAxiosInstance.post('/', vehicleData);
  },

  getAllVehicles() {
    return vehicleAxiosInstance.get('/');
  },

  getVehiclesByBrand(brand) {
    return vehicleAxiosInstance.get(`/brand/${brand}`);
  },

  getVehicleByLicensePlate(licensePlate) {
    return vehicleAxiosInstance.get(`/${licensePlate}`);
  },

  updateVehicle(licensePlate, vehicleData) {
    return vehicleAxiosInstance.put(`/${licensePlate}`, vehicleData);
  },

  deleteVehicle(licensePlate) {
    return vehicleAxiosInstance.delete(`/${licensePlate}`);
  },
};

export default CarService;
