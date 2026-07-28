<script setup lang="ts">
import { computed } from 'vue'
import IconChevronDoubleLeft from '~/assets/icons/chevron-double-left.svg'
import IconChevronLeft from '~/assets/icons/chevron-left.svg'
import IconChevronRight from '~/assets/icons/chevron-right.svg'
import IconChevronDoubleRight from '~/assets/icons/chevron-double-right.svg'

const props = defineProps<{
  page: number
  pageCount: number
}>()
const emit = defineEmits<{ 'update:page': [number] }>()
const NUMBERS_SHOWN = 5

// Always show page 1 and the last page, plus a 3-page window around the current page.
const pageNumbers = computed<number[]>(() => {
  const { page, pageCount } = props
  if (pageCount <= NUMBERS_SHOWN) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.min(Math.max(page - 1, 2), pageCount - 3)
  return [...new Set([1, start, start + 1, start + 2, pageCount])]
})

// Ignore out-of-range pages and clicking the page you're already on.
function go(p: number) {
  if (p < 1 || p > props.pageCount || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <nav v-if="pageCount > 1" aria-label="Pagination" class="pagination">
    <button
      type="button"
      aria-label="First page"
      class="pagination-btn"
      :disabled="page === 1"
      @click="go(1)"
    >
      <IconChevronDoubleLeft />
    </button>
    <button
      type="button"
      aria-label="Previous page"
      class="pagination-btn"
      :disabled="page === 1"
      @click="go(page - 1)"
    >
      <IconChevronLeft />
    </button>

    <button
      v-for="n in pageNumbers"
      :key="n"
      type="button"
      :aria-label="`Go to page ${n}`"
      :aria-current="n === page ? 'page' : undefined"
      class="pagination-btn--number"
      :class="n === page ? 'pagination-btn--active' : 'pagination-btn--inactive'"
      @click="go(n)"
    >
      {{ n }}
    </button>

    <button
      type="button"
      aria-label="Next page"
      class="pagination-btn"
      :disabled="page === pageCount"
      @click="go(page + 1)"
    >
      <IconChevronRight />
    </button>
    <button
      type="button"
      aria-label="Last page"
      class="pagination-btn"
      :disabled="page === pageCount"
      @click="go(pageCount)"
    >
      <IconChevronDoubleRight />
    </button>
  </nav>
</template>
