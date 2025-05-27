<template>
  <div class="store-add">
    <UserTopBar />
    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Create New Store</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <form @submit.prevent="handleCreate" class="add-form">
          <!-- Store Name Input -->
          <div class="form-group">
            <label>Store Name</label>
            <div class="input-wrapper">
              <input
                v-model="storeData.name"
                class="form-input"
                required
                placeholder="Enter store name"
              />
            </div>
          </div>

          <!-- Distrito Dropdown -->
<div class="form-group">
  <label>Distrito</label>
  <div class="custom-select">
    <div class="select-trigger" @click="toggleDropdown('district')">
      {{ storeData.district || 'Select Distrito' }}
      <div class="select-arrow">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div class="select-menu" v-show="activeDropdown === 'district'">
      <div 
        v-for="district in districts" 
        :key="district"
        class="select-item"
        @click="selectDistrict(district)"
      >
        {{ district }}
      </div>
    </div>
  </div>
</div>


          <!-- Concelho Dropdown -->
          <div class="form-group">
            <label>Concelho</label>
            <div class="custom-select">
              <div
                class="select-trigger"
                @click="toggleDropdown('city')"
              >
                {{ storeData.city || 'Select Concelho' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'city'">
                <div
                  v-for="city in cities"
                  :key="city"
                  class="select-item"
                  @click="selectCity(city)"
                >
                  {{ city }}
                </div>
              </div>
            </div>
          </div>

          <!-- Freguesia Dropdown -->
          <div class="form-group">
            <label>Freguesia</label>
            <div class="custom-select">
              <div
                class="select-trigger"
                @click="toggleDropdown('parish')"
              >
                {{ storeData.parish || 'Select Freguesia' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'parish'">
                <div
                  v-for="parish in parishes"
                  :key="parish"
                  class="select-item"
                  @click="selectParish(parish)"
                >
                  {{ parish }}
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="button-group">
            <button type="submit" class="action-btn create-btn">
              <span class="btn-content">Create Store</span>
            </button>
            <button type="button" class="action-btn cancel-btn" @click="handleCancel">
              <span class="btn-content">Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import UserTopBar from '@/components/user/UserTopBar.vue';
import StoreService from '@/services/StoreService';

export default {
  name: "StoreAdd",
  components: { UserTopBar },
  setup() {
    const router = useRouter();
    const activeDropdown = ref(null);
    const storeData = ref({
      name: "",
      district: "",
      city: "",
      parish: "",
    });

    const districts = ref([]);
    const cities = ref([]);
    const parishes = ref([]);

    // Function to toggle dropdown visibility
    const toggleDropdown = (dropdown) => {
      activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
    };

    // Function to handle district selection
    const selectDistrict = async (district) => {
      storeData.value.district = district;
      storeData.value.city = ""; // Reset city when district changes
      storeData.value.parish = ""; // Reset parish
      activeDropdown.value = null;

      console.log("Selected district:", district); // Log the selected district
      await fetchCities(district);
    };

    // Function to handle city selection
    const selectCity = async (city) => {
      storeData.value.city = city;
      storeData.value.parish = ""; // Reset parish when city changes
      activeDropdown.value = null;
      await fetchParishes(city);
    };

    // Function to handle parish selection
    const selectParish = (parish) => {
      storeData.value.parish = parish;
      activeDropdown.value = null;
    };

    // Fetch districts from Geo_API
    const fetchDistricts = async () => {
      console.log("fetching districts");
      try {
        console.log("Fetching districts...");
        const response = await axios.get("https://json.geoapi.pt/distritos/base", {
          headers: { Accept: "application/json" },
        });

        console.log("response", response); // Log the entire response object

        if (Array.isArray(response.data)) {
          console.log("distritos:");
          console.log(response.data);
          districts.value = response.data;
          //districts.value = response.data.map((d) => d.nome); // Assuming 'distrito' is the property
        } else {
          console.error("Unexpected data format for districts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching districts:", error.message);
      }
    };

    const fetchCities = async (district) => {
      try {
        const distritoUrl = `https://json.geoapi.pt/distrito/${district}/municipios`;
        console.log(`Fetching cities from: ${distritoUrl}`); 

        const response = await axios.get(distritoUrl, {
          headers: { Accept: "application/json" },
        });

        if (response.data && response.data.municipios) {
          cities.value = response.data.municipios.map((municipio) => municipio.nome);
        } else {
          cities.value = [];
        }
      } catch (error) {
        console.error("Error fetching cities:", error.message);
      }
    };

    const fetchParishes = async (city) => {
      try {
        const response = await axios.get(
          `https://json.geoapi.pt/municipio/${city}/freguesias`,
          {
            headers: { Accept: "application/json" },
          }
        );
        parishes.value = response.data.freguesias;
      } catch (error) {
        console.error("Error fetching parishes:", error.message);
      }
    };

    const handleCreate = async () => {
      try {
        const newStore = {
          nome: storeData.value.name,
          distrito: storeData.value.district,
          concelho: storeData.value.city,
          freguesia: storeData.value.parish
        };
        
        await StoreService.createStore(newStore);
        router.push('/store/list');
      } catch (error) {
        console.error('Error creating store:', error);
      }
    };
    
    const handleCancel = () => router.push("/store/list");

    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-select')) {
        activeDropdown.value = null;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      fetchDistricts(); 
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      storeData,
      districts,
      cities,
      parishes,
      activeDropdown,
      toggleDropdown,
      selectDistrict,
      selectCity,
      selectParish,
      handleCreate,
      handleCancel,
    };
  },
};
</script>




<style scoped>
.store-add {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.content-container {
  padding: 40px 80px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
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

.add-form {
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
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Button Styles */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
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
  background: linear-gradient(135deg, #404040 0%, #2a2a2a 100%);
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
</style>