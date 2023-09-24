<script setup lang="ts">
import { client } from '@/api';

const login = async () => {
  const url = await client.getLoginUrl();

  window.location.href = url;
}
</script>

<template>
  <button class="py-2 px-4 rounded-lg bg-blue-500 text-white" @click="login">
    ログイン
  </button>
</template>
