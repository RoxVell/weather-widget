<template>
  <div class="cities-component">
    <ul class="cities-list">
      <li
        class="cities-list__item"
        v-for="(city, index) of cities" :key="city.id"
        :class="{ 'cities-list__item_active': index === currentCity }"
        @click="selectCity(index)"
      >
        {{ city.nameRu || city.name }}
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    cities: {
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      currentCity: 0
    }
  },
  methods: {
    selectCity(index) {
      this.currentCity = index
      this.$emit('changeCity', this.cities[this.currentCity])
    }
  },
  created() {
    this.$emit('changeCity', this.cities[this.currentCity])
  }
}
</script>

<style scoped>

.cities-list {
  list-style: none;
  display: flex;
}

.cities-list__item {
  padding: 10px;
  cursor: pointer;
}

.cities-list__item:not(:first-child) {
  margin-left: 35px;
}

.cities-list__item_active {
  border-bottom: 2px solid blue;
}

</style>