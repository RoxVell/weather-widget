<template>
  <div class="weather-component">
    <transition
      mode="out-in"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
    >
      <div class="weather-body" :key="city.id" v-if="cityInfo">
        <p ref="weatherCityRef" class="weather-city">{{ city.nameRu }}</p>
        <div class="weather-info">
          <p ref="weatherDegreeRef" class="weather-degrees">{{ weatherDegrees }}<sup>°C</sup></p>
          <img
            ref="weatherIconRef"
            class="weather-icon"
            :src="weatherIcon"
            :alt="`Погода в ${city.nameRu}`"
          >
        </div>
        <ul ref="weatherDescriptionRef" class="weather-description">
          <li>
            <RainIcon />
            <span>{{ cityInfo.main.humidity }}%</span>
          </li>
          <li>
            <WindIcon />
            <span>{{ cityInfo.wind.speed }} м/с</span>
          </li>
          <li>
            <PressureIcon />
            <span>{{ cityInfo.main.pressure }} мм рт. ст.</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
// libraries
import anime from 'animejs/lib/anime.es.js'

// utils
import config from '../../config.json'
import { kelvinToCelsiusDegrees } from '../../utils/index.js'

// Components
import WindIcon from './Icons/WindIcon'
import RainIcon from './Icons/RainIcon'
import PressureIcon from './Icons/PressureIcon'

export default {
  props: {
    city: Object
  },
  components: {
    RainIcon,
    WindIcon,
    PressureIcon
  },
  watch: {
    city: {
      handler() {
        this.updateStats()
      },
      immediate: true
    }
  },
  data() {
    return {
      cityInfo: null,
      fetchProcess: null,
      API_KEY: config.API_KEY
    }
  },
  computed: {
    weatherIcon() {
      if (!this.cityInfo) return ''
      const iconName = this.cityInfo.weather[0].icon
      return `http://openweathermap.org/img/wn/${iconName}@2x.png`
    },
    weatherDegrees() {
      if (!this.cityInfo) return 0
      const degress = Math.floor(kelvinToCelsiusDegrees(this.cityInfo.main.temp))
      return degress > 0 ? `+${degress}` : `${degress}`
    }
  },
  methods: {
    updateStats() {
      this.fetchProcess = this.getCityInfoById(this.city.id)
    },
    async getCityInfoById(id) {
      try {
        const city = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${id}&APPID=${this.API_KEY}`
        )

        let cityInfo = await city.json()
        this.cityInfo = cityInfo
      } catch(error) {
        console.error(error)
      }
    },
    beforeEnter(el) {
      this.$refs.weatherIconRef.style.transform = 'scale(0)'
      this.$refs.weatherIconRef.style.opacity = '0'

      this.$refs.weatherCityRef.style.opacity = '0'
      this.$refs.weatherCityRef.style.transform = 'translateY(10px)'

      this.$refs.weatherDegreeRef.style.opacity = '0'

      this.$refs.weatherDescriptionRef.querySelectorAll('li > span')
        .forEach(el => el.style.opacity = 0)
    },
    enter(el, done) {
      anime({
        targets: this.$refs.weatherIconRef,
        scale: 1,
        opacity: 1,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      })

      anime({
        targets: this.$refs.weatherCityRef,
        opacity: 1,
        translateY: 0,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      })

      anime({
        targets: this.$refs.weatherDegreeRef,
        opacity: 1,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete: done
      })

      anime({
        targets: this.$refs.weatherDescriptionRef.querySelectorAll('li > span'),
        opacity: 1,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete: () => done
      })
    },
    leave(el, done) {
      anime({
        targets: this.$refs.weatherIconRef,
        scale: 0,
        duration: 500,
        opacity: 0,
        easing: 'cubicBezier(.5, .05, .1, .3)'
      })

      anime({
        targets: this.$refs.weatherCityRef,
        opacity: 0,
        translateY: 10,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)'
      })

      anime({
        targets: this.$refs.weatherDegreeRef,
        opacity: 0,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)'
      })

      anime({
        targets: this.$refs.weatherDescriptionRef.querySelectorAll('li > span'),
        opacity: 0,
        duration: 500,
        easing: 'cubicBezier(.5, .05, .1, .3)',
        complete: () => {
          this.fetchProcess.then(done)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-body {
  display: flex;
  flex-direction: column;
}

.weather-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
}

.weather-city {
  padding: 5px 0;
}

.weather-component {
  min-width: 170px;
}

.weather-degrees {
  font-size: 35px;

  sup {
    font-size: 16px;
  }
}

.weather-description {
  li {
    display: flex;
    align-items: center;
    padding: 3px 0;

    span {
      margin-left: 5px;
    }
  }
}

.weather-icon {
  width: 100px;
  height: 100px;
}
</style>