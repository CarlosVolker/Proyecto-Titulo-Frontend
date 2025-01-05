<template>
  <div class="background-image"></div>
  <div class="background-overlay"></div>
  <div class="login-container">
    <div class="main-title">
        <h1>GESTIÓN POLÍGONO</h1>
    </div>
    <div class="login-content">
      <div class="form-container">
        <h2>INICIAR SESIÓN</h2>
        <p>20.444.555-0</p>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input type="text" v-model="rut" placeholder="RUT" id="rut" required />
          </div>
          <div class="input-group">
            <input type="password" v-model="contrasena" placeholder="Contraseña" id="contrasena" required />
          </div>
          <button type="submit" class="login-button">Iniciar Sesión</button>
        </form>
        <a href="#" @click.prevent="switchToRecover" class="recover-link">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const emit = defineEmits(["switchView"]);

const rut = ref('');
const contrasena = ref('');
const router = useRouter();
const store = useStore();

const handleLogin = async () => {
  try {
    const response = await axios.post('api-token-auth/', {
      rut: rut.value,
      password: contrasena.value,
    });

    if (response && response.data) {
      store.dispatch('login', {
        token: response.data.token,
        id_usuario: response.data.id_usuario,
        userType: response.data.rol,
      });

      const rol = response.data.rol;
      if (rol === 'admin') router.push('/admin');
      else if (rol === 'limitado') router.push('/limitado');
      else if (rol === 'tirador') router.push('/tirador');
      else alert('Tipo de usuario desconocido.');
      console.log('Sesión iniciada correctamente.', response.data);

      resetLogoutTimer();
    } else {
      throw new Error('Respuesta del servidor no válida');
    }
  } catch (error) {
    console.log('Credenciales inválidas. Por favor intenta de nuevo.');
  }
};

const switchToRecover = () => {
  emit("switchView", "recoverAccount");
};

let logoutTimer;
const resetLogoutTimer = () => {
  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    store.commit('logout');
    alert('Sesión cerrada por inactividad.');
    router.push('/login');
  }, 1000 * 60 * 10);
};
</script>

<style >
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


.login-container {
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
  font-size: 4rem;
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

.login-button {
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

.login-button:hover {
  background: #cecece;
}

.recover-link {
  display: flex;
  margin-top: 1.5rem;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  flex-direction: column;
}

.recover-link:hover {
  color: #cfcfcf;
}
</style>
