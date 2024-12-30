<template>
  <div class="layout-container">
    <Dashboard />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Dashboard from '../components/Dashboard.vue';
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh; /* Ocupa toda la altura de la página */
  position: relative;
  overflow: hidden;
}

.layout-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/fondosWeb/FondoWeb.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px); /* Ajusta el valor para más o menos desenfoque */
  z-index: -1; /* Coloca la imagen detrás del contenido */
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* Permite el desplazamiento si el contenido es demasiado grande */
}
</style>