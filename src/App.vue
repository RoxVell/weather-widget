<template>
  <div id="app">
    <CitiesList :cities="cities" @changeCity="changeCity" />
    <Weather class="city-wrapper" :city="currentCity" />
  </div>
</template>

<script>
import Weather from './components/Weather.vue'
import CitiesList from './components/CitiesList.vue'
import cities from '../cities.json'

export default {
  name: 'app',
  components: {
    CitiesList,
    Weather
  },
  data() {
    return {
      cities: cities,
      currentCity: cities[0]
    }
  },
  methods: {
    changeCity(city) {
      this.currentCity = city
    }
  },
  created() {
    this.cities = cities
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

.city-wrapper {
  margin-top: 50px;
}

* {
  margin: 0;
  padding: 0;
}

ul { list-style: none; }
</style>
