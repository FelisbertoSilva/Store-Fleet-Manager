<template>
    <div>
      <!-- Brand Dropdown -->
      <label for="brand">Brand</label>
      <select v-model="selectedBrand" @change="fetchModels" id="brand">
        <option value="" disabled>Select Brand</option>
        <option v-for="brand in brands" :key="brand" :value="brand">
          {{ brand }}
        </option>
      </select>
  
      <!-- Model Dropdown -->
      <label for="model">Model</label>
      <select v-model="selectedModel" id="model" :disabled="!selectedBrand">
        <option value="" disabled>Select Model</option>
        <option v-for="model in models" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
    </div>
  </template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      brands: [], // List of car brands
      models: [], // List of car models for the selected brand
      selectedBrand: '', // Selected brand
      selectedModel: '', // Selected model
    };
  },
  methods: {
    // Fetch all brands from the Car API
    async fetchBrands() {
      try {
        const response = await axios.get('http://localhost:5000/api/marcas');
        this.brands = response.data; // Assign the list of brands to the brands array
      } catch (error) {
        console.error('Error fetching brands:', error.message);
      }
    },

    // Fetch models for the selected brand
    async fetchModels() {
      try {
        if (!this.selectedBrand) return;

        const modelsUrl = `http://localhost:5000/api/modelos/${this.selectedBrand}`;
        const response = await axios.get(modelsUrl);
        this.models = response.data; // Assign the list of models to the models array
        this.selectedModel = ''; // Reset the selected model
      } catch (error) {
        console.error('Error fetching models:', error.message);
      }
    },
  },
  mounted() {
    // Fetch brands when the component loads
    this.fetchBrands();
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
