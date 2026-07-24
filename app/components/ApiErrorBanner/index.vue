<script setup lang="ts">
import type { ApiError } from '~/services/api'
import BaseButton from '~/components/BaseButton/index.vue'

defineProps<{ error: ApiError }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-banner">
    <strong>{{ error.kind }}</strong> — {{ error.userMessage }}
    <span v-if="error.status"> (HTTP {{ error.status }})</span>
    <p class="error-banner-action">
      <BaseButton variant="outline" type="button" @click="$emit('retry')">Try again</BaseButton>
    </p>
  </div>
</template>
