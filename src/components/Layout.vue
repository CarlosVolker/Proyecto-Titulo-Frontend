<template>
  <div class="background-image"></div>
  <div class="background-overlay"></div>
  <div class="layout-container">
    <Dashboard>
      <router-view />
    </Dashboard>

  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import Dashboard from '../components/Dashboard.vue';

const emit = defineEmits(['switchView']);
</script>

<style scoped>
/* Asegurar que el body no tiene margen */
body {
  margin: 0;
  overflow: hidden;
}


/* Contenedor principal */
.layout-container {
  position: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: transparent; /* Evita un fondo sólido */
}

/* Imagen de fondo */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fondosWeb/FondoWeb.jpg'); /* Ruta correcta */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1; /* Detrás del contenido */
}

/* Superposición oscura */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Ajusta opacidad según necesidad */
  z-index: 0;
}

/* Ajustes del dashboard y contenido */
.dashboard-layout {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 1; /* Encima de la imagen de fondo */
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .content {
    padding: 10px;
  }
}
</style>
