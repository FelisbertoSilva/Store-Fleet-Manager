<template>
  <div class="store-edit">
    <UserTopBar />

    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Edit Store</h1>
        <div class="title-underline"></div>
      </div>

      <div class="card-container">
        <form @submit.prevent="handleEdit" class="edit-form">
          <div class="form-group">
            <label>Store Name</label>
            <div class="input-wrapper">
              <input v-model="storeData.name" class="form-input" required />
            </div>
          </div>

          <div class="form-group">
            <label>Distrito</label>
            <div class="custom-select">
              <div class="select-trigger" @click="toggleDropdown('district')">
                {{ storeData.district || 'Select Distrito' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'district'">
                <div v-for="district in districts" :key="district" class="select-item"
                  @click="selectDistrict(district)">
                  {{ district }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Concelho</label>
            <div class="custom-select">
              <div class="select-trigger" @click="toggleDropdown('city')">
                {{ storeData.city || 'Select Concelho' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'city'">
                <div v-for="city in cities" :key="city" class="select-item" @click="selectCity(city)">
                  {{ city }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Freguesia</label>
            <div class="custom-select">
              <div class="select-trigger" @click="toggleDropdown('parish')">
                {{ storeData.parish || 'Select Freguesia' }}
                <div class="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="select-menu" v-show="activeDropdown === 'parish'">
                <div v-for="parish in parishes" :key="parish" class="select-item" @click="selectParish(parish)">
                  {{ parish }}
                </div>
              </div>
            </div>
          </div>

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
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserTopBar from "@/components/user/UserTopBar.vue";
import StoreService from "@/services/StoreService";

export default {
  name: "StoreEdit",
  components: { UserTopBar },
  setup() {
    const router = useRouter();
    const route = useRoute();
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
    const errorMessage = ref("");

    const fetchStoreData = async () => {
      try {
        const storeName = decodeURIComponent(route.params.nome);
        console.log("Store Name from URL:", storeName);

        if (!storeName) {
          throw new Error("Store name not provided in the URL.");
        }

        const response = await StoreService.getStoreByNome(storeName);
        console.log("Store API Response:", response.data);

        const store = response.data;
        storeData.value = {
          name: store.nome,
          district: store.distrito,
          city: store.concelho,
          parish: store.freguesia,
        };

        await fetchCities(store.distrito);
        await fetchParishes(store.concelho);
      } catch (error) {
        console.error("Error fetching store data:", error.response || error.message || error);
        errorMessage.value = "Failed to load store data. Please try again later.";
      }
    };

    const toggleDropdown = (dropdown) => {
      activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
    };

    const selectDistrict = async (district) => {
      storeData.value.district = district;
      storeData.value.city = "";
      storeData.value.parish = "";
      activeDropdown.value = null;

      console.log("Selected district:", district);
      await fetchCities(district);
    };

    const selectCity = async (city) => {
      storeData.value.city = city;
      storeData.value.parish = "";
      activeDropdown.value = null;
      await fetchParishes(city);
    };

    const selectParish = (parish) => {
      storeData.value.parish = parish;
      activeDropdown.value = null;
    };

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
        const response = await axios.get(`https://json.geoapi.pt/distrito/${district}/municipios`, {
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

    const handleDelete = async () => {
  try {
    const storeName = decodeURIComponent(route.params.nome);

    await StoreService.deleteStore(storeName);
    router.push("/store/list");
  } catch (error) {
    console.error("Error deleting store:", error.message);
  }
};


    const handleEdit = async () => {
      try {
        console.log("Editing Store:", storeData.value);
        const storeName = decodeURIComponent(route.params.nome);

        const payload = {
          nome: storeData.value.name,
          distrito: storeData.value.district,
          concelho: storeData.value.city,
          freguesia: storeData.value.parish,
        };

        const response = await StoreService.updateStore(storeName, payload);
        console.log("Store Updated Successfully:", response.data);
        router.push(`/store/page/${encodeURIComponent(storeData.value.name)}`);
      } catch (error) {
        console.error("Error editing store:", error.message);
      }
    };

    const handleCancel = () => {
      const storeName = decodeURIComponent(route.params.nome);
      router.push(`/store/page/${encodeURIComponent(storeName)}`); 
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-select")) {
        activeDropdown.value = null;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      fetchDistricts();
      fetchStoreData();
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
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
      handleEdit,
      handleDelete,
      handleCancel,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.store-edit {
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
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

.delete-btn {
  background: linear-gradient(135deg, #424242 0%, #212121 100%);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #616161 0%, #424242 100%);
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
</style>