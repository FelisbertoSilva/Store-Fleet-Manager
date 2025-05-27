<template>
  <div class="car-add">
    <UserTopBar />

    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Create New Car</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <form @submit.prevent="handleAdd" class="edit-form">
          <!-- License Plate -->
          <div class="form-group">
            <label>License Plate</label>
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="carData.licensePlate"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Brand -->
          <div class="form-group">
            <label>Brand</label>
            <div class="custom-select">
              <div 
                class="select-trigger" 
                @click="toggleDropdown('brand')"
              >
                <div class="selected-value" :class="{ 'placeholder': !carData.brand }">
                  {{ carData.brand || 'Select a brand' }}
                </div>
                <div class="select-arrow" :class="{ 'rotated': activeDropdown === 'brand' }">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-if="activeDropdown === 'brand'">
                <div 
                  v-for="brand in brands" 
                  :key="brand"
                  class="select-item"
                  @click="selectBrand(brand)"
                >
                  {{ brand }}
                </div>
              </div>
            </div>
          </div>

          <!-- Model -->
          <div class="form-group">
            <label>Model</label>
            <div class="custom-select">
              <div 
                class="select-trigger" 
                @click="toggleDropdown('model')"
              >
                <div class="selected-value" :class="{ 'placeholder': !carData.model }">
                  {{ carData.model || 'Select a model' }}
                </div>
                <div class="select-arrow" :class="{ 'rotated': activeDropdown === 'model' }">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-if="activeDropdown === 'model'">
                <div 
                  v-for="model in models" 
                  :key="model"
                  class="select-item"
                  @click="selectModel(model)"
                >
                  {{ model }}
                </div>
              </div>
            </div>
          </div>

          <!-- Store -->
          <div class="form-group">
            <label>Store</label>
            <div class="custom-select">
              <div 
                class="select-trigger" 
                @click="toggleDropdown('store')"
              >
                <div class="selected-value" :class="{ 'placeholder': !carData.store }">
                  {{ getStoreName(carData.store) || 'Select a store' }}
                </div>
                <div class="select-arrow" :class="{ 'rotated': activeDropdown === 'store' }">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-if="activeDropdown === 'store'">
                <div 
                  v-for="store in stores" 
                  :key="store.id"
                  class="select-item"
                  @click="selectStore(store.id)"
                >
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
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Create Car
              </span>
            </button>
            <button type="button" class="action-btn cancel-btn" @click="handleCancel">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import UserTopBar from '@/components/user/UserTopBar.vue';
import CarService from '@/services/CarService';
import StoreService from '@/services/StoreService';

export default {
  name: 'CarAdd',
  components: {
    UserTopBar,
  },
  setup() {
    const router = useRouter();
    const activeDropdown = ref(null);
    const carData = ref({
      licensePlate: '',
      brand: '',
      model: '',
      store: '',
    });

    const brands = ref([]);
    const models = ref([]);
    const stores = ref([]);
    const errorMessage = ref('');

    const fetchBrands = async () => {
      try {
        const response = await CarService.getAllBrands();
        brands.value = response.data;
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    };

    const fetchModelsByBrand = async (brand) => {
      try {
        const response = await CarService.getModelsByBrand(brand);
        models.value = response.data;
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await StoreService.getAllStores();
        stores.value = response.data.map((store) => ({
          id: store._id,
          name: store.nome,
        }));
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    const toggleDropdown = (dropdown) => {
      activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
    };

    const selectBrand = (brand) => {
      carData.value.brand = brand;
      carData.value.model = '';
      activeDropdown.value = null;
      fetchModelsByBrand(brand);
    };

    const selectModel = (model) => {
      carData.value.model = model;
      activeDropdown.value = null;
    };

    const selectStore = (storeId) => {
      carData.value.store = storeId;
      activeDropdown.value = null;
    };

    const getStoreName = (storeId) => {
      const store = stores.value.find((s) => s.id === storeId);
      return store ? store.name : '';
    };

    const handleAdd = async () => {
      try {
        errorMessage.value = '';
        await CarService.createVehicle(carData.value);
        router.push('/car/list');
      } catch (error) {
        console.error('Failed to add car:', error);
        errorMessage.value = 'Invalid License Plate';
      }
    };

    const handleCancel = () => {
      router.push('/car/list');
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-select')) {
        activeDropdown.value = null;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      fetchBrands();
      fetchStores();
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      carData,
      brands,
      models,
      stores,
      activeDropdown,
      toggleDropdown,
      selectBrand,
      selectModel,
      selectStore,
      getStoreName,
      handleAdd,
      handleCancel,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.car-add {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
}

.content-container {
  padding: 40px 80px;
  max-width: 800px;
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.form-group label {
  color: white;
  font-size: 15px;
  font-weight: 500;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  outline: none;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
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
  font-size: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.select-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.select-arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.select-trigger:hover .select-arrow {
  background: rgba(255, 255, 255, 0.2);
}

.select-arrow.rotated svg {
  transform: rotate(180deg);
}

.select-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px; /* Scrollable dropdown */
  overflow-y: auto; /* Enables vertical scrolling */
  margin-top: 8px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: 150px;
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
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.selected-value {
  color: white;
}

.selected-value.placeholder {
  color: #9ba1a6;
}

/* Button Styles */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.action-btn {
  flex: 1;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.save-btn {
  background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
}

.save-btn:hover {
  background: linear-gradient(135deg, #404040 0%, #2a2a2a 100%);
}

.cancel-btn {
  background: linear-gradient(135deg, #424242 0%, #212121 100%);
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #616161 0%, #424242 100%);
}

@media (max-width: 768px) {
  .content-container {
    padding: 20px;
  }
  
  .page-title {
    font-size: 36px;
  }

  .button-group {
    flex-direction: column;
  }
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: -10px;
  text-align: center;
}

</style>
