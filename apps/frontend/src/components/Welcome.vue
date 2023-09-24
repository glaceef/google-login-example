<template>
  <div class="text-purple-600">
    {{ name }}へようこそ！
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Welcome',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
});
</script>
