<template>
  <div>
    <h1>Recuperar Cuenta</h1>
    <form @submit.prevent="handleRecover">
      <div>
        <label for="rut">RUT:</label>
        <input type="text" v-model="rut" id="rut" />
      </div>
      <div>
        <label for="email">Correo:</label>
        <input type="email" v-model="correo" id="correo" />
      </div>
      <button type="submit">Recuperar</button>
    </form>
    <a href="#" class="login-link" @click.prevent="switchToLogin">Iniciar Sesión</a>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';

// Define el evento que emitirá este componente
const emit = defineEmits(["switchView"]);

// Variables reactivas
const rut = ref("");
const correo = ref("");

// Función para manejar la recuperación de cuenta
const handleRecover = async () => {
  console.log("Recuperando cuenta para:", rut.value, correo.value);
  // Lógica para manejar la recuperación de cuenta
  try {
    const responde = await axios.post("recover/", {
      rut: rut.value,
      correo: correo.value,
    });
    alert('Se ha enviado una nueva constraseña a su correo electrónico');
  } catch (error) {
    console.error('Error al recuperar la cuenta', error);
    alert('Hubo un error al intentar recuperar la cuenta. Por favor, inténtelo de nuevo.');
  }
};

// Cambiar la vista al componente de inicio de sesión
const switchToLogin = () => {
  emit("switchView", "login");
};
</script>