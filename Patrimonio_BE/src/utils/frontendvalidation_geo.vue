<template>
    <div>
      <!-- Distrito Dropdown -->
      <label for="distrito">Distrito</label>
      <select v-model="selectedDistrito" @change="fetchConcelhos" id="distrito">
        <option value="" disabled>Select Distrito</option>
        <option v-for="distrito in distritos" :key="distrito" :value="distrito">
          {{ distrito }}
        </option>
      </select>
  
      <!-- Concelho Dropdown -->
      <label for="concelho">Concelho</label>
      <select v-model="selectedConcelho" @change="fetchFreguesias" id="concelho" :disabled="!selectedDistrito">
        <option value="" disabled>Select Concelho</option>
        <option v-for="concelho in concelhos" :key="concelho" :value="concelho">
          {{ concelho }}
        </option>
      </select>
  
      <!-- Freguesia Dropdown -->
      <label for="freguesia">Freguesia</label>
      <select v-model="selectedFreguesia" id="freguesia" :disabled="!selectedConcelho">
        <option value="" disabled>Select Freguesia</option>
        <option v-for="freguesia in freguesias" :key="freguesia" :value="freguesia">
          {{ freguesia }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      distritos: [], // List of available distritos
      concelhos: [], // List of available concelhos
      freguesias: [], // List of available freguesias

      selectedDistrito: '', // Selected distrito
      selectedConcelho: '', // Selected concelho
      selectedFreguesia: '', // Selected freguesia
    };
  },
  methods: {
    // Fetch all distritos from the external API
    async fetchDistritos() {
      try {
        const response = await axios.get('https://json.geoapi.pt/distritos', {
          headers: { Accept: 'application/json' },
        });
        this.distritos = response.data.map((d) => d.nome); // Extract 'nome' from response
      } catch (error) {
        console.error('Error fetching distritos:', error.message);
      }
    },

    // Fetch concelhos based on selected distrito
    async fetchConcelhos() {
      try {
        const distritoUrl = `https://json.geoapi.pt/distrito/${this.selectedDistrito}/municipios`;
        const response = await axios.get(distritoUrl, {
          headers: { Accept: 'application/json' },
        });
        this.concelhos = response.data.municipios.map((m) => m.nome); // Extract 'nome' from response
        this.selectedConcelho = ''; // Reset concelho selection
        this.freguesias = []; // Clear previous freguesias
      } catch (error) {
        console.error('Error fetching concelhos:', error.message);
      }
    },

    // Fetch freguesias based on selected concelho
    async fetchFreguesias() {
      try {
        const freguesiaUrl = `https://json.geoapi.pt/municipio/${this.selectedConcelho}/freguesias`;
        const response = await axios.get(freguesiaUrl, {
          headers: { Accept: 'application/json' },
        });
        this.freguesias = response.data.freguesias; // Extract 'freguesias' from response
        this.selectedFreguesia = ''; // Reset freguesia selection
      } catch (error) {
        console.error('Error fetching freguesias:', error.message);
      }
    },
  },
  mounted() {
    // Fetch distritos when the component loads
    this.fetchDistritos();
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 1rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
</style>
