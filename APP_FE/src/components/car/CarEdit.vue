<template>
  <div class="car-edit">
    <UserTopBar />
    <div class="content-container">
      <h1 class="page-title">Edit Car</h1>
      <div class="title-underline"></div>
      <div class="card-container">
        <form @submit.prevent="handleSubmit">
          <!-- License Plate (Read-Only) -->
          <div class="form-group">
            <label>License Plate</label>
            <input v-model="carData.licensePlate" class="form-input" readonly />
          </div>

          <!-- Brand (Read-Only) -->
          <div class="form-group">
            <label>Brand</label>
            <input v-model="carData.brand" class="form-input" readonly />
          </div>

          <!-- Model (Read-Only) -->
          <div class="form-group">
            <label>Model</label>
            <input v-model="carData.model" class="form-input" readonly />
          </div>

          <!-- Store Dropdown -->
          <div class="form-group">
            <label>Store</label>
            <div class="custom-select">
              <div class="select-trigger" @click="toggleDropdown('store')">
                {{ selectedStoreName || 'Select Store' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'store'">
                <div v-for="store in stores" :key="store.id" class="select-item" @click="selectStore(store)">
                  {{ store.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <!-- Buttons -->
          <div class="button-group">
            <button type="submit" class="action-btn save-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                Save Changes
              </span>
            </button>
            <button type="button" @click="handleDelete" class="action-btn delete-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                Delete
              </span>
            </button>
            <button type="button" @click="handleCancel" class="action-btn cancel-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                Cancel
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserTopBar from '@/components/user/UserTopBar.vue';
import CarService from '@/services/CarService';
import StoreService from '@/services/StoreService';

export default {
  name: 'CarEdit',
  components: { UserTopBar },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeDropdown = ref(null);
    const carData = ref({
      licensePlate: '',
      brand: '',
      model: '',
      store: ''
    });
    const stores = ref([]);
    const errorMessage = ref('');

    const fetchCarData = async () => {
      try {
        const licensePlate = route.params.licensePlate;
        console.log('License Plate from URL:', licensePlate);

        if (!licensePlate) {
          throw new Error('License plate not provided in the URL.');
        }

        const response = await CarService.getVehicleByLicensePlate(licensePlate);
        console.log('Vehicle API Response:', response.data);

        const vehicle = response.data;
        carData.value = {
          licensePlate: vehicle.licensePlate,
          brand: vehicle.brand,
          model: vehicle.model,
          store: vehicle.store._id
        };
      } catch (error) {
        console.error('Error fetching car data:', error.response || error.message || error);
        errorMessage.value = 'Failed to load car data. Please try again later.';
      }
    };

    const fetchStores = async () => {
      try {
        const response = await StoreService.getAllStores();
        stores.value = response.data.map((store) => ({
          id: store._id,
          name: store.nome
        }));
        console.log('Stores API Response:', stores.value);
      } catch (error) {
        console.error('Error fetching stores:', error.response || error.message || error);
        errorMessage.value = 'Failed to load stores. Please try again later.';
      }
    };

    const selectedStoreName = computed(() => {
      const store = stores.value.find((s) => s.id === carData.value.store);
      return store ? store.name : '';
    });

    const toggleDropdown = (dropdown) => {
      activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
    };

    const selectStore = (store) => {
      carData.value.store = store.id;
      activeDropdown.value = null;
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-select')) {
        activeDropdown.value = null;
      }
    };

    const handleSubmit = async () => {
      try {
        errorMessage.value = '';
        await CarService.updateVehicle(carData.value.licensePlate, { store: carData.value.store });
        router.push('/car/list');
      } catch (error) {
        console.error('Error updating car:', error.response || error.message || error);
        errorMessage.value = 'Failed to update car. Please try again.';
      }
    };

    const handleDelete = async () => {
      try {
        await CarService.deleteVehicle(carData.value.licensePlate);
        router.push('/car/list');
      } catch (error) {
        console.error('Error deleting car:', error.response || error.message || error);
      }
    };

    const handleCancel = () => router.push('/car/list');

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      fetchCarData();
      fetchStores();
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      carData,
      stores,
      activeDropdown,
      selectedStoreName,
      toggleDropdown,
      selectStore,
      handleSubmit,
      handleDelete,
      handleCancel,
      errorMessage
    };
  }
};
</script>

<style scoped>
.car-edit {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
}

.content-container {
  padding: 40px 80px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  color: white;
  text-align: center;
  margin-bottom: 10px;
}

.card-container {
  background: linear-gradient(145deg, #000000, #a2a1a1);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 20px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #FFFFFF, transparent);
  margin: 0 auto;
  border-radius: 2px;
  margin: -5px auto 40px;
}

label {
  color: white;
  display: block;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
}

/* Custom Select Styles */
.custom-select {
  position: relative;
  width: 100%;
}

.select-trigger {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #9ba1a6;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-arrow {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: 130px;
  overflow-y: auto;
}

/* Scrollbar styles */
.select-menu::-webkit-scrollbar {
  width: 8px; /* Scrollbar width */
}

.select-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1); /* Track color */
  border-radius: 10px;
}

.select-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3); /* Thumb color */
  border-radius: 10px;
}

.select-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5); /* Thumb color on hover */
}

.select-menu {
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1); /* Firefox scrollbar colors */
  scrollbar-width: thin; /* Makes scrollbar thinner */
}

.select-item {
  padding: 10px 16px;
  color: #9ba1a6;
  cursor: pointer;
  transition: all 0.3s;
}

.select-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.action-btn {
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .content-container {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>