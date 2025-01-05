<template>
  <div>
    <h1>PERFIL</h1>
    <p v-if="user">RUT: {{ user.rut }}</p>
    <p v-if="user">Grado: {{ user.grado }}</p>
    <p v-if="user">Nombre: {{ user.nombre }}</p>
    <p v-if="user">Apellido Paterno: {{ user.apellido_paterno }}</p>
    <p v-if="user">Apellido Materno: {{ user.apellido_materno }}</p>

    <p v-if="user">Correo: {{ user.correo }}</p>
    <div v-if="user">
      <h2>Información de Unidad</h2>
      <p>Unidad Regimentaria: {{ user.unidad_regimental }}</p>
      <p>Unidad de Combate: {{ user.unidad_combate }}</p>
      <p>Unidad Fundamental: {{ user.unidad_fundamental }}</p>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.state.user);

onMounted(() => {
  store.dispatch('fetchUser');
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: aliceblue;
}
p {
  font-size: 1.2rem;
  color: aliceblue;
}
h2 {
  font-size: 1.5rem;
  margin-top: 1rem;
  color: aliceblue;
}
</style>


