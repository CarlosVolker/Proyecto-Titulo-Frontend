<template>
  <div class="background-image"></div>
  <div class="login-container">
    <div class="background-overlay">
    </div>
    <div class="login-content">
      <h1 class="main-title">GESTIÓN POLÍGONO</h1>

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



// Manejo de inicio de sesión
const handleLogin = async () => {
  try {
    // Envío de solicitud POST al servidor
    const response = await axios.post('api-token-auth/', {
      rut: rut.value,
      password: contrasena.value,
    });

    // Verifica que la respuesta tenga la estructura esperada
    if (response && response.data) {
      // Guarda el token en localStorage
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('userType', response.data.rol);
      localStorage.setItem('id', response.data.id);

      console.log('Inicio de sesión exitoso:', response.data);

      // Determina el tipo de usuario y redirige a la página correspondiente
      const rol = response.data.rol;
      store.commit('setUserType', rol); // Guarda el tipo de usuario en Vuex

      // Redirige al usuario a la página correspondiente
      if (rol === 'admin') {
        router.push('/admin');
      } else if (rol === 'limitado') {
        router.push('/limitado');
      } else if (rol === 'tirador') {
        router.push('/tirador');
      } else {
        alert('Tipo de usuario desconocido.');
      }

      // Restablece el temporizador de inactividad
      resetLogoutTimer();
    } else {
      throw new Error('Respuesta del servidor no válida');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Credenciales inválidas. Por favor intenta de nuevo.');
  }
};

// Función para cambiar a la vista de recuperación de cuenta
const switchToRecover = () => {
  emit("switchView", "recoverAccount");
};

let logoutTimer;

// Manejo de deslogeo por inactividad
const resetLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer); // Limpiar temporizador anterior
  }

  logoutTimer = setTimeout(() => {
    store.commit('logout'); // Ejecuta acción de deslogeo
    alert('Sesión cerrada por inactividad.'); // Muestra alerta de deslogeo
    router.push('/login'); // redirige a la página de inicio de sesión
  }, 1000 * 60 * 10); // 10 minutos
};


</script>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Evita el desplazamiento */
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9); /* Fondo oscuro semitransparente */
  background: url('@/assets/fondosWeb/FondoWeb.jpg') no-repeat center center/cover;
  z-index: -1; /* Coloca la imagen detrás del contenido */
  
  
}

/* Contenedor principal */
.login-container {
  display: flex;
  flex-direction: column; /* Apila elementos verticalmente */
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* Asegura que ocupe todo el ancho de la ventana */
  position: relative;
  overflow: hidden; /* Evita bordes no deseados */
}

/* Contenedor de superposición (overlay) */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  backdrop-filter: blur(10px); /* Efecto de desenfoque para el fondo */
}

/* Contenido del formulario */
.login-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  width: 90%; /* Para mantener márgenes seguros en pantallas pequeñas */
  max-width: 400px; /* Limita el ancho máximo del formulario */
  margin-top: 2rem; /* Separa el formulario del título */
}

/* Texto "GESTIÓN POLÍGONO" */
.main-title {
  font-size: 4rem; /* Tamaño grande */
  color: white;
  font-weight: bold;
  margin-bottom: 3rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap; /* Fuerza el texto a mantenerse en una sola línea */
  position: relative; /* Evita que el título se superponga incorrectamente */
  z-index: 3; /* Asegura que el título quede siempre encima del formulario */
}

/* Contenedor del formulario */
.form-container {
  background: rgba(255, 255, 255, 0.1); /* Fondo semitransparente */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: rgba(138, 137, 137, 0.35) 0px 5px 10px;
  backdrop-filter: blur(25px); /* Más desenfoque para resaltar */
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: white;
}

p {
  margin-bottom: 0.3rem;
  font-size: 1rem;
  color: white;
  font-weight: 600;
}

/* Input */
.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: calc(80% - 2rem); /* Ajusta el ancho dejando espacio en los laterales */
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

.input-group input::placeholder {
  color: #999;
  text-align: center;
}

/* Botón */
.login-button {
  width: calc(60% - 2rem); /* Ancho uniforme con margen */
  padding: 0.8rem;
  background: radial-gradient(#5d5d5d, #969696) ;
  border: none;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.6s ease;
  font-weight: bold;
}

.login-button:hover {
  background: #cecece;
}

/* Enlace de recuperación */
.recover-link {
  display:flex;
  margin-top: 1.5rem;
  color: #000000;
  text-decoration: underline;
  cursor: pointer;
  flex-direction: column;
}

.recover-link:hover {
  color: #cfcfcf;
}
</style>


