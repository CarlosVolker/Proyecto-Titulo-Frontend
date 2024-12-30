<template>
  <div class="dashboard">
    <nav class="sidebar">
      <ul class="menu-superior">
        <li v-for="(item, index) in menuItemsSuperior" :key="index" :class="{ active: item.active }" @click="navigate(item.text)">
          {{ item.text }}
        </li>
      </ul>
      <ul class="menu-inferior">
        <li v-for="(item, index) in menuItemsInferior" :key="index" @click="navigate(item.text)">
          {{ item.text }}
          <a v-if="item.logOutButton === 'CERRAR SESIÓN'" @click="logout">{{ item.logOutButton }}</a>
        </li>
      </ul>
    </nav>
    <main class="content">
      
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const userType = computed(() => store.state.userType);

// Menus para cada tipo de usuario
const menuItemsSuperior = computed(() => {
  switch (userType.value) {
    case 'admin':
      return [
        { text: 'INICIO' },
        { text: 'CREAR LECCIÓN', active: true },
        { text: 'BUSCAR' },
        { text: 'USUARIOS' },
      ];
    case 'limitado':
      return [
        { text: 'INICIO', active: true },
        { text: 'CREAR LECCIÓN' },
        { text: 'BUSCAR' }
      ];
    case 'tirador':
      return [
        { text: 'INICIO', active: true },
        { text: 'MIS LECCIONES' },
        { text: 'PERFIL' }
      ];
    default:
      return [];
  }
});
const menuItemsInferior = computed(() => {
  switch (userType.value) {
    case 'admin':
      return [
        { text: 'PERFIL' },
        { text: 'CONFIGURACIÓN' },
        { logOutButton: 'CERRAR SESIÓN' }
      ];
    case 'limitado':
      return [
        { text: 'PERFIL' },
        { text: 'CONFIGURACIÓN' },
        { logOutButton: 'CERRAR SESIÓN' }
      ];
    case 'tirador':
      return [
        { text: 'PERFIL' },
        { text: 'CONFIGURACIÓN' },
        { logOutButton: 'CERRAR SESIÓN' }
      ];
    default:
      return [];
  }
});

// Manejo de la navegación
const navigate = (menuItem) => {
  const basePath = `/${userType.value}`;
  if (menuItem === 'INICIO'){
    router.push('/');
  } else if (menuItem === 'CREAR LECCIÓN'){
    router.push(`${basePath}/crear-leccion`);
  } else if (menuItem === 'BUSCAR') {
    router.push(`${basePath}/buscar`);
  } else if (menuItem === 'PERFIL') {
    router.push(`${basePath}/perfil`);
  } else if (menuItem === 'CONFIGURACIÓN') {
    router.push(`${basePath}/configuracion`);
  }
}
// Manejo del cierre de sesión
const logout = () => {
  store.commit('logout');
  router.push('/login');
};
</script>

<style scoped>
.dashboard {
  display: flex;
  background-image: url('../assets/fondosWeb/FondoDashboard.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  font-family: "Asap", sans-serif;
}

.sidebar {
  width: 200px;
  background-color: rgba(248, 249, 250, 0.0);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.menu-superior {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

.menu-inferior {
  list-style-type: none;
  padding: 0;
  display: flex;
  margin-top: auto;
  flex-direction: column;
  align-items: center;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  color: azure;
  font-weight: bold;
}

.sidebar li.active {
  background-color: #bababa;
  color: white;
}

.sidebar li a {
  text-decoration: none;
  color: inherit;
}

.content {
  flex: 1;
  padding: 0px;
}
</style>