<template>
    <div>
        <h1>BUSCAR</h1>
        <p>Esta es la página de BUSCAR.</p>

        <button @click="abrirModal">Agregar Nuevo Polígono</button>
        <Modal :visible="modalVisible" title="Agregar Nuevo Polígono" @close="cerrarModal">
      <form @submit.prevent="crearPoligono">


        <button type="submit">Guardar</button>
      </form>
    </Modal>
    </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import Modal from '@/components/Modal.vue';
    import { useStore } from 'vuex';
    
    const store = useStore();
    
    const modalVisible = ref(false);
    const nuevoPoligono = ref({
      nombre: '',
      ciudad: '',
      carriles_maximos: null,
      distancia_maxima: null
    });
    
    const abrirModal = () => {
      modalVisible.value = true;
    };
    
    const cerrarModal = () => {
      modalVisible.value = false;
    };
    
    const crearPoligono = async () => {
      await store.dispatch('crearPoligono', nuevoPoligono.value);
      cerrarModal();
      store.dispatch('fetchPoligonos'); // Actualiza la lista de polígonos
    };
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
    </style>