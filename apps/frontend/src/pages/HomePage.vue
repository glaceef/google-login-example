<template>
  <Welcome :name="'member'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Welcome from '@/components/Welcome.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    Welcome,
  },
});
</script>
