<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), { variant: 'secondary', type: 'button', disabled: false })
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="{
      'btn--primary': variant === 'primary',
      'btn--secondary': variant === 'secondary',
      'btn--outline': variant === 'outline',
    }"
  >
    <span v-if="$slots.icon" class="btn-icon" aria-hidden="true"><slot name="icon" /></span>
    <slot />
  </button>
</template>
