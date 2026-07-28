<script setup lang="ts">
import { useId } from 'vue'
import IconSearch from '~/assets/icons/search.svg'

// A labelled <input>, optionally with a search icon; emits null (not '') when cleared.
const inputId = useId()
withDefaults(defineProps<{
  modelValue: string | null
  label: string
  placeholder?: string
  hideLabel?: boolean
  disabled?: boolean
  variant?: 'default' | 'search'
  type?: 'text' | 'number' | 'email'
  size?: 'sm' | 'md'
}>(), { placeholder: '', hideLabel: false, disabled: false, variant: 'default', type: 'text', size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [string | null] }>()

// Treat an emptied field as "no value" rather than an empty string.
function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value || null)
}
</script>

<template>
  <label :for="inputId" class="field" :class="size === 'sm' ? 'field--sm' : 'field--md'">
    <span :class="hideLabel ? 'sr-only' : 'field-label'">{{ label }}</span>
    <span class="field-shell">
      <IconSearch v-if="variant === 'search'" class="field-icon" />
      <input
        :id="inputId"
        :value="modelValue ?? ''"
        :type="variant === 'search' ? 'search' : type"
        :disabled="disabled"
        :placeholder="placeholder"
        autocomplete="off"
        class="field-input"
        :class="variant === 'search' ? 'field-input--search' : 'field-input--plain'"
        @input="onInput"
      >
    </span>
  </label>
</template>
