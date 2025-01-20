<template>
  <div class="background-image"></div>
  <div class="background-overlay"></div>
  <div class="recover-container">
    <div class="main-title">
      <h1>GESTIÓN POLÍGONO</h1>
    </div>
    <!--Paso 1 -->
    <div class="recover-content">
      <div class="form-container">
        <h2>RECUPERAR CONTRASEÑA</h2>

        <!--Verificar RUT-->
        <form v-if="step === 1" @submit.prevent="manejarPasoRutYCorreo">
          <div class="input-group">
            <input 
            type="text" 
            v-model="rut" 
            id="rut" 
            placeholder="RUT" 
            :disabled="rutVerificado" />
          </div>
          <div v-if="rutVerificado" class="input-group">
            <label>Verifica tu correo: {{ correoCensurado }}</label>
            <input type="mail" v-model="correo" id="correo" placeholder="Correo Electrónico" />
          </div>
           <button type="submit" class="recover-button">
            {{ rutVerificado ? "Enviar Código" : "Verificar RUT" }}
          </button>
        </form>

        <!-- Ingresar código d everificación -->
        <form v-if="step === 3" @submit.prevent="verificarCodigo">
          <div class="input-group">
            <input type="text" v-model="codigo" id="code" placeholder="Codigo Verificación" />
          </div>
          <button type="submit" class="recover-button">Verificar</button>
        </form>

        <!-- Ingresar nu8eva contraseña -->
         <form v-if="step === 4" @submit.prevent="cambiarContrasena">
          <div class="input-group">
            <input 
            type="password" 
            v-model="nuevaContrasena" 
            id="nueva-contraseña" 
            placeholder="Nueva Contraseña" />
          </div>
          <div class="input-group">
            <input 
            type="password" 
            v-model="confirmarContrasena" 
            id="confirmar-contraseña" 
            placeholder="Confirmar Contraseña" />
          </div>
          <button type="submit" class="recover-button">Actualizar Contraseña</button>
         </form>
        <a href="#" class="login-link" @click.prevent="switchToLogin" >Iniciar Sesión</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';

// Variables reactivas
const step = ref(1);
const rut = ref('');
const correo = ref('');
const correoCensurado = ref('');
const codigo = ref('');
const nuevaContrasena = ref('');
const confirmarContrasena = ref('');
const rutVerificado = ref(false);

// Define el evento que emitirá este componente
const emit = defineEmits(["switchView"]);



// Logica de verificacion de rut y correo
const manejarPasoRutYCorreo = async () => {
  if (!rutVerificado.value) {
    //Verificar RUT
    try {
      const response = await axios.post('recuperar/', {rut: rut.value});
      correoCensurado.value = response.data.correo_censurado;
      rutVerificado.value = true;

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.mensaje || 'Error al verificar el RUT');
    }
  } else {
    //Enviar código
    try {
      await axios.post('recuperar/crear/', {rut: rut.value, correo: correo.value});
      console.log('Código enviado');
      step.value = 3;
    } catch (error) {
      console.log('rut', rut.value, 'correo', correo.value);
      console.error(error);
      alert(error.response?.data?.mensaje || 'Error al enviar el código de verificación');
    }
  }
};

// verificar codigo
const verificarCodigo = async () => {
  try {
    await axios.post('recuperar/comprobar/', {rut: rut.value, codigo: codigo.value});
    console.log('Código verificado');
    step.value = 4;

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.mensaje || 'Error al verificar el código');
  }
};

const cambiarContrasena = async () => {
  if (nuevaContrasena.value !== confirmarContrasena.value) {
    console.log('Las contraseñas no coinciden');
    return;
  }
  try {
    await axios.post('recuperar/cambiar/', {
      rut: rut.value,
      codigo: codigo.value,
      nueva_contrasena: nuevaContrasena.value
    })
    alert('Contraseña cambiada correctamente');
    switchToLogin();

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.mensaje || 'Error al cambiar la contraseña');
  }
}

// Cambiar la vista al componente de inicio de sesión
const switchToLogin = () => {
  emit("switchView", "login");
};
</script>

<style scoped>
:root {
  --input-width: calc(80% - 2rem);
  --button-width: calc(60% - 2rem);
  --border-radius: 15px;
  --text-color: white;
  --placeholder-color: #999;
  --transition-time: 0.6s;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/fondosWeb/FondoWeb.jpg') no-repeat center center/cover;
  z-index: -1;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
}

.recover-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: auto;
  z-index: 0;
}


.main-title {
  font-size: 2rem;
  color: var(--text-color);
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  z-index: 3;
}

.form-container {
  display: grid;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  height: 400px;
  width: 400px;
  border-radius: 10px;
  box-shadow: rgba(138, 137, 137, 0.35) 0px 5px 10px;
  backdrop-filter: blur(25px);
  align-content: center;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: var(--text-color);
}

p {
  margin-bottom: 0.3rem;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 600;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: var(--input-width);
  padding: 0.8rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  text-align: center;
}

.input-group input::placeholder {
  color: var(--placeholder-color);
  text-align: center;
}

.recover-button {
  width: var(--button-width);
  padding: 0.8rem;
  background: radial-gradient(#5d5d5d, #969696);
  border: none;
  border-radius: var(--border-radius);
  color: #000;
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--transition-time) ease;
  font-weight: bold;
}

.recover-button:hover {
  background: #cecece;
}

.login-link {
  display: flex;
  margin-top: 1.5rem;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  flex-direction: column;
}

.login-link:hover {
  color: #cfcfcf;
}
</style>