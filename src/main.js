import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './axios'; // Importa la instancia de Axios configurada

// Configura Axios para incluir el token de autenticación en las solicitudes
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

// Configuración para cierre automático
let logoutTimer;

const resetLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }

  logoutTimer = setTimeout(() => {
    store.commit('logout');
    router.push('/login');
  }, 1000 * 60 * 15); // 15 minutos
}

document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);

resetLogoutTimer();