<template>
  <div class="store-list">
    <UserTopBar />
    
    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Stores</h1>
        <div class="title-underline"></div>
      </div>
      
      <div class="card-container">
        <div class="card-header">
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search" class="search-icon"/>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search stores..." 
              v-model="searchQuery"
            />
            <div class="search-glow"></div>
          </div>
          <button @click="goToCreateStore" class="create-btn">
            <span class="btn-content">
              <svg class="plus-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Create Store
            </span>
          </button>
        </div>

        <div class="stores-grid">
          <div 
            v-for="store in filteredStores" 
            :key="store"
            class="store-item"
            @click="viewStore(store)"
          >
            <div class="store-content">
              <div class="store-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21M3 18H21M6 18V9.99998M10 18V9.99998M14 18V9.99998M18 18V9.99998M3 10L12 3L21 10" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="store-name">{{ store }}</span>
              <div class="store-hover-effect"></div>
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
import StoreService from '@/services/StoreService';

export default {
  name: 'StoreList',
  components: {
    UserTopBar,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const stores = ref([]);
    const errorMessage = ref('');

    const fetchStores = async () => {
      try {
        errorMessage.value = ''; // Reset error message
        const response = await StoreService.getAllStores(); // Fetch stores from backend
        stores.value = response.data.map(store => store.nome); // Extract only store names
      } catch (error) {
        console.error('Error fetching stores:', error);
        errorMessage.value = 'Failed to load stores. Please try again later.';
      }
    };

    const filteredStores = computed(() => {
      return stores.value.filter((store) =>
        store.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const goToCreateStore = () => {
      router.push('/store/add');
    };

    const viewStore = (store) => {
      router.push({ name: 'store-page', params: { nome: store } });
    };

    onMounted(() => {
      fetchStores();
    });

    return {
      searchQuery,
      filteredStores,
      goToCreateStore,
      viewStore,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.store-list {
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

.create-btn {
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

.create-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.create-btn:active {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plus-icon {
  width: 18px;
  height: 18px;
}

.stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

.store-item {
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
  perspective: 1000px;
}

.store-content {
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.store-item:hover .store-content {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.store-icon {
  width: 40px;
  height: 40px;
  color: white;
  opacity: 0.9;
}

.store-name {
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.store-hover-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.store-item:hover .store-hover-effect {
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

  .create-btn {
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

  .stores-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
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

  .store-icon {
    width: 32px;
    height: 32px;
  }

  .store-name {
    font-size: 14px;
  }
}
</style>