<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  name: {
    type: String,
    required: true,
  },
}>();
</script>

<template>
  <div class="text-purple-600">
    {{ name }}へようこそ！
  </div>
</template>
