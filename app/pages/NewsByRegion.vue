<template>
  <div>
    <h1>News By Region</h1>
    <p>
      This section is where you can find and access previous news articles related to this topic.
      Explore past updates and reports to stay informed on the regional context.
    </p>

    <div v-if="pending">Loading mappings...</div>
    <div v-else-if="error">❌ Failed to load mappings</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Country</th>
          <th>Commodity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in mappings" :key="m.mapping_id">
          <td>{{ m.Country }}</td>
          <td>{{ m.Commodity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Define the shape of one mapping row
interface Mapping {
  mapping_id: number;
  country_id: number;
  Country: string; 
  commodity_id: number;
  Commodity: string;
}

// Define the full API response
interface MappingResponse {
  success: boolean;
  mappings: Mapping[];
}

// Call backend API
const { data, pending, error } = await useFetch<MappingResponse>('/api/mapping');

// Always resolve to an array (avoid undefined during loading)
const mappings = computed(() => data.value?.mappings || []);
</script>

<style scoped>
.table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 1rem;
}
.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.table th {
  background-color: #f9f9f9;
  text-align: left;
}
</style>
