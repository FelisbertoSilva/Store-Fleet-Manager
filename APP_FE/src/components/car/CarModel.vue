<template>
  <div class="car-model">
    <UserTopBar />
    
    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">{{ brandName }} Models</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <div class="card-header">
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search" class="search-icon"/>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search models..." 
              v-model="searchQuery"
            />
            <div class="search-glow"></div>
          </div>
          <div class="action-buttons">
            <button @click="goBack" class="action-btn cancel-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Go Back
              </span>
            </button>
          </div>
        </div>

        <div class="models-grid">
          <div class="table-header">
            <div class="header-item">License Plate</div>
            <div class="header-item">Brand</div>
            <div class="header-item">Model</div>
            <div class="header-item">Store</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="car in filteredCars" 
              :key="car.licensePlate"
              class="table-row"
              @click="goToEditCar(car.licensePlate)"
            >
              <div class="model-data license-plate" data-label="License Plate">{{ car.licensePlate }}</div>
              <div class="model-data" data-label="Brand">{{ car.brand }}</div>
              <div class="model-data" data-label="Model">{{ car.model }}</div>
              <div class="model-data" data-label="Store">{{ car.store }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserTopBar from '../user/UserTopBar.vue';
import CarService from '@/services/CarService';

export default {
  name: 'CarModel',
  components: {
    UserTopBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref('');
    const brandName = ref(decodeURIComponent(route.params.brand));
    const cars = ref([]);
    const errorMessage = ref('');

    const fetchVehicles = async () => {
      try {
        errorMessage.value = '';
        const decodedBrand = decodeURIComponent(route.params.brand);
        console.log('Decoded brand for request:', decodedBrand);

        const response = await CarService.getVehiclesByBrand(decodedBrand);

        cars.value = response.data.map((vehicle) => ({
          licensePlate: vehicle.licensePlate,
          brand: vehicle.brand,
          model: vehicle.model,
          store: vehicle.store.nome,
        }));
      } catch (error) {
        console.error('Error fetching vehicles:', error);

        if (error.response && error.response.status === 401) {
          errorMessage.value = 'Unauthorized: Please log in again.';
        } else if (error.response && error.response.status === 403) {
          errorMessage.value = 'Forbidden: Access denied.';
        } else {
          errorMessage.value = 'Failed to load vehicles. Please try again later.';
        }
      }
    };

    const filteredCars = computed(() => {
      return cars.value.filter((car) =>
        Object.values(car).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
    });

    const goBack = () => {
      router.push('/car/list');
    };

    const goToEditCar = (licensePlate) => {
      router.push(`/car/edit/${licensePlate}`);
    };

    onMounted(() => {
      fetchVehicles();
    });

    return {
      searchQuery,
      filteredCars,
      goBack,
      goToEditCar,
      brandName,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.car-model {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
}

.content-container {
  padding: 40px 80px;
  max-width: 1800px;
  margin: 0 auto;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #FFFFFF, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

.card-container {
  background: linear-gradient(145deg, #000000, #a2a1a1);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;
}

.search-box {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 17px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus + .search-glow {
  opacity: 1;
}

.search-glow {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.models-grid {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.header-item {
  color: white;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(10px);
}

.model-data {
  color: white;
  font-size: 14px;
}

.license-plate {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 1400px) {
  .content-container {
    padding: 30px 60px;
  }
}

@media (max-width: 1200px) {
  .content-container {
    padding: 30px 40px;
  }

  .search-box {
    width: 300px;
  }
}

@media (max-width: 992px) {
  .content-container {
    padding: 25px 30px;
  }

  .page-title {
    font-size: 40px;
  }

  .card-header {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 20px;
  }

  .page-title {
    font-size: 36px;
  }

  .card-container {
    padding: 20px;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.05);
  }

  .table-row:hover {
    transform: translateY(-2px);
  }

  .model-data {
    position: relative;
    padding-left: 120px;
  }

  .model-data::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 110px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }
}

@media (max-width: 480px) {
  .content-container {
    padding: 15px;
  }

  .page-title {
    font-size: 32px;
  }

  .card-container {
    padding: 15px;
  }
}
</style>