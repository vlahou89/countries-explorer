<script setup lang="ts" generic="T extends string">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import IconSearch from '~/assets/icons/search.svg'
import IconChevron from '~/assets/icons/chevron-down.svg'

// A custom <select>: a button that toggles a listbox, built to the ARIA combobox pattern (see template).
const props = withDefaults(defineProps<{
  modelValue: T | null
  options: { label: string; value: T }[]
  label: string
  placeholder?: string
  hideLabel?: boolean
  disabled?: boolean
}>(), { placeholder: 'Select', hideLabel: false, disabled: false })
const emit = defineEmits<{ 'update:modelValue': [T | null] }>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const listboxId = useId()
const labelId = useId()

// Visible label, and which option assistive tech should treat as "focused" while the list is open.
const selectedLabel = computed(() => props.options.find(o => o.value === props.modelValue)?.label ?? null)
const activeOptionId = computed(() => (open.value && activeIndex.value >= 0) ? `${listboxId}-${activeIndex.value}` : undefined)

// One setter for both open and close: opening highlights the current value, closing clears the highlight.
function setOpen(value: boolean) {
  if (value && props.disabled) return
  open.value = value
  activeIndex.value = value ? Math.max(0, props.options.findIndex(o => o.value === props.modelValue)) : -1
}
function toggle() { setOpen(!open.value) }
function select(option: { label: string; value: T }) { emit('update:modelValue', option.value); setOpen(false) }

// Arrow keys move the highlight, Enter selects it, Escape/Tab close the list.
const OPENING_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', ' ']
function onButtonKeydown(e: KeyboardEvent) {
  if (OPENING_KEYS.includes(e.key)) e.preventDefault()
  if (!open.value) { if (OPENING_KEYS.includes(e.key)) setOpen(true); return }

  const active = props.options[activeIndex.value]
  if (e.key === 'ArrowDown') activeIndex.value = Math.min(activeIndex.value + 1, props.options.length - 1)
  else if (e.key === 'ArrowUp') activeIndex.value = Math.max(activeIndex.value - 1, 0)
  else if (e.key === 'Enter' && active) select(active)
  else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
}

// Click anywhere outside the component to close the list.
function onClickOutside(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) setOpen(false)
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="root" class="select">
    <span :id="labelId" :class="hideLabel ? 'sr-only' : 'field-label'">{{ label }}</span>

    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-labelledby="labelId"
      :aria-activedescendant="activeOptionId"
      :disabled="disabled"
      class="select-trigger"
      @click="toggle"
      @keydown="onButtonKeydown"
    >
      <IconSearch class="shrink-0" />
      <span class="select-value" :class="selectedLabel ? 'text-black' : 'text-faint'">{{ selectedLabel ?? placeholder }}</span>
      <IconChevron class="shrink-0 text-[#2B2B2B]" />
    </button>

    <ul
      v-if="open"
      :id="listboxId"
      role="listbox"
      :aria-label="label"
      class="select-list"
    >
      <!--
        Options are deliberately not focusable or individually keyboard-handled.
        This follows the ARIA combobox "virtual focus" pattern: real DOM focus
        stays on the trigger button the whole time, and the button's
        aria-activedescendant (set above) tells assistive tech which option is
        "active" instead. Arrow keys are handled once, on the button itself
        (see onButtonKeydown).
      -->
      <li
        v-for="(o, i) in options"
        :id="`${listboxId}-${i}`"
        :key="o.value"
        role="option"
        :aria-selected="o.value === modelValue"
        class="select-option"
        :class="[i === activeIndex ? 'select-option--active' : '', o.value === modelValue ? 'font-semibold text-black' : 'text-black']"
        @click="select(o)"
        @mousemove="activeIndex = i"
      >
        {{ o.label }}
      </li>
    </ul>
  </div>
</template>
