<script setup lang="ts">
import { useId } from 'vue'
import IconSearch from '~/assets/icons/search.svg'

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

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value === '' ? null : value)
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
