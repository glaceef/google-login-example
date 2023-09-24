<script setup lang="ts">
import { client } from '@/api';
import { LoginForm } from '@/api/forms/login_form';
import { ROUTER_NAME } from '@/router';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const form = new LoginForm(
    route.query['state'] as string,
    route.query['code'] as string
  );

  await client.completeLogin(form)
    .then(_ => {
      router.push({
        name: ROUTER_NAME.LoginComplete,
      });
    });
});
</script>

<template>
  Login Callback
</template>
