<template>
  <div class="car-list-page">
    <UserTopBar />
    
    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Brand List</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <div class="card-header">
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search" class="search-icon"/>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search brands..." 
              v-model="searchQuery"
            />
            <div class="search-glow"></div>
          </div>
          <div class="action-buttons">
            <button @click="goToCreateCar" class="action-btn create-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Create Car
              </span>
            </button>
          </div>
        </div>

        <div class="brands-grid">
          <div 
            v-for="brand in filteredBrands" 
            :key="brand"
            class="brand-item"
            @click="viewBrandModels(brand)"
          >
            <div class="brand-content">
              <span class="brand-name">{{ brand }}</span>
              <div class="brand-hover-effect"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserTopBar from '../user/UserTopBar.vue';
import CarService from '@/services/CarService';

export default {
  name: 'CarList',
  components: {
    UserTopBar,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const brands = ref([]);
    const errorMessage = ref('');

    const fetchBrands = async () => {
      try {
        errorMessage.value = '';
        const response = await CarService.getAllBrands();
        brands.value = response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
        errorMessage.value = 'Failed to load brands. Please try again later.';
      }
    };

    const filteredBrands = computed(() => {
      return brands.value.filter((brand) =>
        brand.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const goToCreateCar = () => {
      router.push('/car/add');
    };

    const viewBrandModels = (brand) => {
      router.push({ name: 'car-model', params: { brand } });
    };

    onMounted(() => {
      fetchBrands();
    });

    return {
      searchQuery,
      filteredBrands,
      goToCreateCar,
      viewBrandModels,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.car-list-page {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  padding: 40px 80px;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
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
  background: linear-gradient(145deg, #000000, #777777);
  backdrop-filter: blur(10px);
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.action-btn:active {
  transform: translateY(0);
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

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 10px;
}

.brand-item {
  aspect-ratio: 1;
  cursor: pointer;
  perspective: 1000px;
}

.brand-content {
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-item:hover .brand-content {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.brand-name {
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  z-index: 1;
}

.brand-hover-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.brand-item:hover .brand-hover-effect {
  opacity: 1;
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
    gap: 10px;
  }

  .action-btn {
    flex: 1;
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

  .brand-name {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>