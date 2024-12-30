<template>
  <router-view @switchView="handleSwitchView"></router-view>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSwitchView = (view) => {
  if (view === 'recoverAccount') {
    router.push('/recover');
  } else if (view === 'login') {
    router.push('/login');
  }
};
</script>