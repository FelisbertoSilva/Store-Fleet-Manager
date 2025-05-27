<template>
  <div class="store-page">
    <UserTopBar />
    
    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Store Details</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <!-- Header with search bar and buttons -->
        <div class="card-header">
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search" class="search-icon" />
            <input
              type="text"
              class="search-input"
              placeholder="Search brands..."
              v-model="searchQuery"
            />
            <div class="search-glow"></div>
          </div>
          <div class="action-buttons">
            <button @click="editStore" class="action-btn edit-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Edit Store
              </span>
            </button>
            <button @click="deleteStore" class="action-btn delete-btn">
              <span class="btn-content">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Delete Store
              </span>
            </button>
          </div>
        </div>

        <!-- Brands Grid -->
        <div class="brands-grid">
          <div 
            v-for="brand in filteredBrands" 
            :key="brand" 
            class="brand-item"
            @click="viewStoreCars(brand)"
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
import { useRouter, useRoute } from 'vue-router';
import UserTopBar from '../user/UserTopBar.vue';
import StoreService from '@/services/StoreService';

export default {
  name: "StorePage",
  components: {
    UserTopBar,
  },
  setup() {
    const searchQuery = ref("");
    const router = useRouter();
    const route = useRoute();
    const brands = ref([]);
    const errorMessage = ref('');
    const successMessage = ref('');

    const fetchStoreBrands = async () => {
      try {
        errorMessage.value = '';
        const storeName = decodeURIComponent(route.params.nome); 
        const response = await StoreService.getStoreWithVehicles(storeName);
        const uniqueBrands = new Set(response.data.vehicles.map(vehicle => vehicle.brand));
        brands.value = Array.from(uniqueBrands);
      } catch (error) {
        console.error('Error fetching store brands:', error);
        errorMessage.value = 'Failed to load store brands. Please try again later.';
      }
    };

    const filteredBrands = computed(() => {
      return brands.value.filter((brand) =>
        brand.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const editStore = () => {
      const storeName = decodeURIComponent(route.params.nome);
      router.push({ name: 'store-edit', params: { nome: storeName } });
    };

    const deleteStore = async () => {
      try {
        errorMessage.value = '';
        successMessage.value = '';
        const storeName = decodeURIComponent(route.params.nome);
        await StoreService.deleteStore(storeName);
        successMessage.value = 'Store deleted successfully.';
        router.push('/store/list');
      } catch (error) {
        console.error('Error deleting store:', error);
        errorMessage.value = 'Failed to delete store. Please try again later.';
      }
    };

    const viewStoreCars = (brand) => {
      const storeName = decodeURIComponent(route.params.nome);
      router.push({ name: 'store-cars', params: { nome: storeName, brand: encodeURIComponent(brand) } });
    };

    onMounted(() => {
      fetchStoreBrands();
    });

    return {
      searchQuery,
      filteredBrands,
      editStore,
      deleteStore,
      viewStoreCars,
      errorMessage,
      successMessage,
    };
  },
};
</script>

<style scoped>
.store-page {
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

.delete-btn {
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #3a3a3a 0%, #5e5d5d 100%);
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