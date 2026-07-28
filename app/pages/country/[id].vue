<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getCountry } from '~/services/countries'
import type { CountryDetails } from '~/types/country'
import type { ApiError } from '~/services/api'
import CountryMap from '~/components/CountryMap/index.vue'
import ApiErrorBanner from '~/components/ApiErrorBanner/index.vue'

const STAT_LABELS = [
  'Capital', 'Region', 'Population', 'Languages', 'Currencies',
  'Also known as', 'UN membership', 'Independence', 'Time zone', 'Coordinates',
]

// Route param drives the fetch; useAsyncData re-fetches (and re-keys its cache) whenever `id` changes.
const route = useRoute()
const id = computed(() => String(route.params.id))

const { data: country, pending, error, refresh } = useAsyncData<CountryDetails, ApiError>(
  () => `country-${id.value}`,
  () => getCountry(id.value),
  { watch: [id] },
)

// Display-only formatting for the stats grid; each one falls back to an em dash while loading.
const currenciesLabel = computed(() => country.value?.currencies.map(c => `${c.symbol ? c.symbol + ' ' : ''}${c.name} (${c.code})`).join(', ') || '—')
const regionLabel = computed(() => [country.value?.region, country.value?.subregion].filter(Boolean).join(' · ') || '—')
const alsoKnownAs = computed(() => country.value?.nativeNames.join(', ') || country.value?.official || '—')
const coordinatesLabel = computed(() => country.value ? country.value.latlng.map(n => n.toFixed(2)).join(', ') : '—')

// A ticking clock showing the country's local time, derived from its UTC offset.
const nowMs = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => { nowMs.value = Date.now() }, 1000) })
onBeforeUnmount(() => clearInterval(timer))
const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const localTime = computed(() => country.value ? timeFormatter.format(new Date(nowMs.value + country.value.utcOffsetMinutes * 60_000)) : '—')
const utcOffsetLabel = computed(() => country.value?.timezones[0] ?? '—')

// A getter, not a plain object, so the title updates once `country` finishes loading.
useHead(() => ({ title: country.value ? `${country.value.name} — Countries list` : 'Countries list' }))
</script>

<template>
  <main class="page">
    <NuxtLink to="/" class="back-link">
      ← All countries
    </NuxtLink>

    <template v-if="pending">
      <p class="sr-only" role="status">Loading country…</p>

      <div class="hero" aria-hidden="true">
        <div class="hero-identity">
          <div class="skeleton-flag" />
          <div>
            <p class="skeleton-hero-name" />
            <p class="skeleton-hero-official" />
          </div>
        </div>
        <div class="hero-clock">
          <p class="skeleton-clock-time" />
          <p class="skeleton-clock-label" />
        </div>
      </div>

      <dl class="stats-grid" aria-hidden="true">
        <div v-for="label in STAT_LABELS" :key="label" class="stat-card">
          <dt class="stat-label">{{ label }}</dt>
          <dd class="stat-value"><span class="skeleton-stat-value" /></dd>
        </div>
      </dl>

      <section class="map-section" aria-hidden="true">
        <div class="map-section-header">
          <h2 class="map-section-title">On the map</h2>
        </div>
        <div class="map-frame skeleton-map" />
      </section>
    </template>

    <ApiErrorBanner v-else-if="error" :error="error" @retry="refresh" />

    <template v-else-if="country">
      <div class="hero">
        <div class="hero-identity">
          <img
            :src="country.flagSvg"
            :alt="country.flagAlt"
            width="96"
            height="64"
            class="hero-flag"
          >
          <div>
            <h1 class="hero-name">{{ country.name }}</h1>
            <p class="hero-official">{{ country.official }} · {{ country.id }}</p>
          </div>
        </div>
        <div class="hero-clock">
          <p class="hero-clock-time">{{ localTime }}</p>
          <p class="hero-clock-label">{{ utcOffsetLabel }} local time</p>
        </div>
      </div>

      <dl class="stats-grid">
        <div class="stat-card">
          <dt class="stat-label">Capital</dt>
          <dd class="stat-value">{{ country.capital }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Region</dt>
          <dd class="stat-value">{{ regionLabel }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Population</dt>
          <dd class="stat-value">{{ country.population.toLocaleString('en-GB') }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Languages</dt>
          <dd class="stat-value">{{ country.languages.join(', ') || '—' }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Currencies</dt>
          <dd class="stat-value">{{ currenciesLabel }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Also known as</dt>
          <dd class="stat-value">{{ alsoKnownAs }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">UN membership</dt>
          <dd class="stat-value">{{ country.unMember ? 'Member state' : 'Not a UN member' }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Independence</dt>
          <dd class="stat-value">{{ country.independent ? 'Independent' : 'Not independent' }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Time zone</dt>
          <dd class="stat-value">{{ utcOffsetLabel }}</dd>
        </div>
        <div class="stat-card">
          <dt class="stat-label">Coordinates</dt>
          <dd class="stat-value">{{ coordinatesLabel }}</dd>
        </div>
      </dl>

      <section class="map-section">
        <div class="map-section-header">
          <h2 class="map-section-title">On the map</h2>
          <a
            v-if="country.googleMapsUrl"
            :href="country.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
          >
            Open in Google Maps
          </a>
        </div>
        <CountryMap :lat="country.latlng[0]" :lng="country.latlng[1]" :label="country.name" />
      </section>
    </template>
  </main>
</template>
