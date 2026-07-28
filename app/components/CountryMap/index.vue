<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  lat: number
  lng: number
  label: string
}>()
const mapEl = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null

// Leaflet's default marker icon breaks under bundlers, so re-point it at the bundled image files first.
onMounted(async () => {
  const L = (await import('leaflet')).default
  const [iconRetinaUrl, iconUrl, shadowUrl] = await Promise.all([
    import('leaflet/dist/images/marker-icon-2x.png').then(m => m.default),
    import('leaflet/dist/images/marker-icon.png').then(m => m.default),
    import('leaflet/dist/images/marker-shadow.png').then(m => m.default),
  ])
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })
  if (!mapEl.value) return

  // The map: an OpenStreetMap tile layer, plus one marker for this country.
  map = L.map(mapEl.value).setView([props.lat, props.lng], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map)
  L.marker([props.lat, props.lng]).addTo(map).bindPopup(props.label)
})

// Re-centre without re-creating the map when a different country is shown.
watch((): [number, number] => [props.lat, props.lng], ([lat, lng]) => map?.setView([lat, lng], map.getZoom()))

onBeforeUnmount(() => { map?.remove(); map = null })
</script>

<template>
  <div ref="mapEl" class="map-frame" role="img" :aria-label="`Map showing the location of ${label}`" />
</template>
