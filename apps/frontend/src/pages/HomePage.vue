<script setup lang="ts">
const login = () => {
  alert('ログイン');
}
</script>

<template>
  <button
    class="py-2 px-4 rounded-lg bg-blue-500 text-white"
    @click="login"
  >
    ログイン
  </button>
</template>
