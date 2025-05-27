<template>
  <div class="dashboard-page">
    <UserTopBar />

    <div class="dashboard-content">
      <!-- Metrics Cards Row -->
      <div class="metrics-row">
        <!-- Brands Card -->
        <div class="metric-card">
          <div class="metric-info">
            <h3>Total Brands</h3>
            <div class="total-brands"> {{ totalBrands }}</div>
          </div>
          <div class="chart-container">
            <Bar 
              v-if="topBrandsChartData && topBrandsChartData.labels.length > 0" 
              :data="topBrandsChartData" 
              :options="barChartOptions" 
            />
          </div>
        </div>

        <!-- Fleet Distribution by Store -->
        <div class="metric-card">
          <div class="metric-info">
            <h3>Fleet Distribution by District</h3>
          </div>
          <div class="chart-container">
            <Scatter
              v-if="fleetDistributionData && fleetDistributionData.datasets[0].data.length > 0"
              :data="fleetDistributionData"
              :options="scatterChartOptions"
            />
          </div>
        </div>

        <!-- Stores Card -->
        <div class="metric-card">
          <div class="metric-info">
            <h3>Stores per District</h3>
            <div class="total-stores"> Total Stores: {{ totalStores }}</div>
          </div>
          <div class="chart-container">
            <Doughnut
              v-if="storeChartData && storeChartData.labels.length > 0 && storeChartData.datasets[0].data.length > 0"
              :data="storeChartData"
              :options="doughnutOptions"
            />
          </div>
        </div>
      </div>

      <!-- Lists Row -->
      <div class="lists-row">
        <!-- Stores List -->
        <div class="list-card">
          <h2>Stores</h2>
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search Icon" class="search-icon" />
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search stores..." 
              v-model="storeSearch"
            />
          </div>
          <div class="items-list">
            <div 
              v-for="store in filteredStores" 
              :key="store.name"
              class="store-item"
              @click="goToStoreEdit(store.nome)"
            >
              <div class="store-name">{{ store.nome }}</div>
              <div class="store-details"> Distrito : {{ store.distrito }}</div>
            </div>
          </div>
        </div>

        <!-- Cars List -->
        <div class="list-card">
          <h2>Cars</h2>
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search Icon" class="search-icon" />
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search cars..." 
              v-model="carSearch"
            />
          </div>
          <div class="items-list">
            <div 
              v-for="car in filteredCars" 
              :key="car.licensePlate"
              class="car-item"
              @click="goToCarEdit(car.licensePlate)"
            >
              <div class="car-name">{{ car.brand }} {{ car.model }}</div>
              <div class="car-details">{{ car.year }}</div>
              <div class="car-details">{{ car.licensePlate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserTopBar from './UserTopBar.vue';
import { ref, computed, onMounted } from 'vue';
import StoreService from "@/services/StoreService";
import CarService from "@/services/CarService";
import { useRouter } from 'vue-router';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Title } from 'chart.js';
import { Bar, Doughnut, Scatter } from 'vue-chartjs';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Title);

export default {
  name: 'UserDashboard',
  components: {
    UserTopBar,
    Bar,
    Doughnut,
    Scatter,
  },
  setup() {
    const router = useRouter();

    const districts = ref([]);
    const totalBrands = ref(0);
    const totalFleet = ref(0);
    const totalStores = ref(0);
    const stores = ref([]);
    const cars = ref([]);

    const topBrandsChartData = ref({
      labels: [],
      datasets: [
        {
          label: 'Total',
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const fleetDistributionData = ref({
  datasets: [
    {
      label: 'Fleet Distribution',
      data: [],
      backgroundColor: 'rgb(0, 255, 0)',
    },
  ],
});

    const storeChartData = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    });

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          padding: 10,
          cornerRadius: 4,
        },
      },
      scales: {
        x: { ticks: { display: false }, grid: { display: false } },
        y: { ticks: { display: false }, grid: { display: false } },
      },
    };

    const scatterChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          const districtName = context.raw.districtName;
          const numCars = context.raw.y;
          return `${districtName}: ${numCars} cars`;  
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Number of Stores',
        color: 'white',
        font: { size: 14 },
      },
      ticks: {
        color: 'white',
        stepSize: 2,
      },
      grid: { display: false },
    },
    y: {
      title: {
        display: true,
        text: 'Number of Cars',
        color: 'white',
        font: { size: 14 },
      },
      ticks: {
        color: 'white',
        stepSize: 10,
      },
      grid: { display: false },
    },
  },
  elements: {
    point: {
      radius: 6,
    },
  },
};

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          padding: 10,
          cornerRadius: 4,
        },
      },
      elements: {
        arc: { borderWidth: 0 },
      },
    };

    const storeSearch = ref('');
    const carSearch = ref('');
    const filteredStores = computed(() => {
      return stores.value.filter(
        (store) =>
          store.nome.toLowerCase().includes(storeSearch.value.toLowerCase()) ||
          store.distrito.toLowerCase().includes(storeSearch.value.toLowerCase())
      );
    });

    const filteredCars = computed(() => {
      return cars.value.filter(
        (car) =>
          car.licensePlate.toLowerCase().includes(carSearch.value.toLowerCase()) ||
          car.brand.toLowerCase().includes(carSearch.value.toLowerCase()) ||
          car.model.toLowerCase().includes(carSearch.value.toLowerCase())
      );
    });

    const countStoresFleet = async () => {
  try {
    const vehicleResponse = await StoreService.countVehiclesByDistrict();
    console.log('Vehicle Counts by District:', vehicleResponse.data);

    const storeResponse = await StoreService.countStoreDistrict();
    console.log('Store Counts by District:', storeResponse.data);

    const districtStoreCounts = storeResponse.data.reduce((acc, district) => {
      acc[district.distrito] = district.count; 
      return acc;
    }, {});

    fleetDistributionData.value.datasets[0].data = Object.entries(vehicleResponse.data).map(([district, count]) => ({
      x: districtStoreCounts[district] || 0,
      y: count || 0,
      districtName: district,
    }));

    console.log('Fleet Distribution Data:', fleetDistributionData.value.datasets[0].data);

    const maxStores = Math.max(...Object.values(districtStoreCounts), 1);
    const maxCars = Math.max(...Object.values(vehicleResponse.data), 1);

    scatterChartOptions.scales.x.max = Math.ceil(maxStores / 2) * 2 + 2;
    scatterChartOptions.scales.y.max = Math.ceil(maxCars / 10) * 10 + 10;
  } catch (error) {
    console.error('Error fetching fleet distribution data:', error);
  }
};

    const countStores = async () => {
      try {
        const response = await StoreService.countStoreDistrict();
        console.log('Store Data:', response.data);

        districts.value = response.data.map((district) => ({
          distrito: district.distrito,
          count: district.count,
        }));

        storeChartData.value.labels = districts.value.map((d) => d.distrito);
        storeChartData.value.datasets[0].data = districts.value.map((d) => d.count);
        storeChartData.value.datasets[0].backgroundColor = districts.value.map(() =>
          getRandomColor()
        );

        totalStores.value = districts.value.reduce((sum, district) => sum + district.count, 0);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    const getVehicles = async () => {
      try {
        const response = await CarService.getAllVehicles();
        console.log('Vehicles Data:', response.data);

        cars.value = response.data.map((car) => ({
          brand: car.brand,
          model: car.model,
          licensePlate: car.licensePlate,
        }));

        const brands = cars.value.map((vehicle) => vehicle.brand);
        const uniqueBrands = [...new Set(brands)];
        totalBrands.value = uniqueBrands.length;

        const brandCounts = brands.reduce((acc, brand) => {
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {});

        const sortedBrands = Object.entries(brandCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        topBrandsChartData.value.labels = sortedBrands.map(([brand]) => brand);
        topBrandsChartData.value.datasets[0].data = sortedBrands.map(([, count]) => count);
        topBrandsChartData.value.datasets[0].backgroundColor = sortedBrands.map(() => '#007bff');
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    
    const getStores = async () => {
      try {
        const response = await StoreService.getAllStores();
        console.log('Store Data:', response.data);

        stores.value = response.data.map((store) => ({
          nome: store.nome,
          distrito: store.distrito,
        }));
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    const baseColors = [
 { r: 255, g: 0, b: 255 },   // Magenta Elétrico
 { r: 0, g: 71, b: 171 },    // Azul Cobalto
 { r: 191, g: 255, b: 0 },   // Verde Limão
 { r: 255, g: 119, b: 0 },   // Laranja Neon
 { r: 102, g: 0, b: 255 },   // Roxo Real
 { r: 0, g: 255, b: 239 },   // Turquesa Brilhante
 { r: 255, g: 236, b: 0 },   // Amarelo Solar
 { r: 255, g: 0, b: 132 },   // Pink Shocking
 { r: 0, g: 201, b: 87 }     // Verde Esmeralda
];

let usedColorIndices = new Set();

const getRandomColor = () => {
  if (usedColorIndices.size >= baseColors.length) {
    usedColorIndices.clear();
  }
  
  let index;
  do {
    index = Math.floor(Math.random() * baseColors.length);
  } while (usedColorIndices.has(index));
  
  usedColorIndices.add(index);
  const color = baseColors[index];
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

    const goToStoreEdit = (storeNome) => router.push(`/store/edit/${storeNome}`);
    const goToCarEdit = (licensePlate) => router.push(`/car/edit/${licensePlate}`);

    onMounted(() => {
      countStoresFleet();
      countStores();
      getVehicles();
      getStores();
    });

    return {
      totalBrands,
      totalFleet,
      totalStores,
      topBrandsChartData,
      fleetDistributionData,
      storeChartData,
      barChartOptions,
      scatterChartOptions,
      doughnutOptions,
      storeSearch,
      carSearch,
      filteredStores,
      filteredCars,
      goToStoreEdit,
      goToCarEdit,
    };
  },
};
</script>


<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: url('/HomeBackground.png') no-repeat center center fixed;
  background-size: cover;
}

.dashboard-content {
  padding: 80px 30px 30px 30px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.total-stores{
  color: rgb(32, 198, 32);
  font-size: 15px;
}

.total-brands{
  color: yellow;
  font-size: 25px;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  background: linear-gradient(145deg, #000000, #545151);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  height: 300px;
  display: flex;
  flex-direction: column;
}

.metric-info {
  margin-bottom: 20px;
}

.metric-info h3 {
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 10px;

}

.metric-value{
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
}

.metric-change {
  font-size: 14px;
  font-weight: 500;
}

.metric-change.positive {
  color: #4CAF50;
}

.metric-change.neutral {
  color: #FFC107;
}

.chart-container {
  flex-grow: 1;
  min-height: 120px;
  position: relative;
  margin-top: auto;
}

.lists-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.list-card {
  background: linear-gradient(145deg, #000000, #545151);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  height: 500px;
  display: flex;
  flex-direction: column;
}

h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}

.search-box {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  opacity: 0.7;
  object-fit: contain;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 14px;
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

.items-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

.items-list::-webkit-scrollbar {
  width: 6px;
}

.items-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.items-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.list-item,
.car-item, .store-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item:hover,
.car-item:hover,.store-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.car-item, .store-item{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.car-name, .store-name{
  font-weight: bold;
  font-size: 16px;
}

.car-details, .store-details {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}


@media (max-width: 768px) {
  .dashboard-content {
    padding: 60px 20px 20px 20px;
  }

  .metric-card {
    padding: 20px;
    height: 250px;
  }

  .list-card {
    padding: 20px;
    height: 400px;
  }

  .metric-value {
    font-size: 28px;
  }

  .chart-container {
    min-height: 100px;
  }

  .search-icon {
    width: 14px;
    height: 14px;
  }
}
</style>