<template>
  <div class="dashboard-layout">
    <nav class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <button class="toggle-button" @click="toggleSidebar">
        {{ isSidebarCollapsed ? '>>' : '<<' }}
      </button>
      <ul class="menu-superior">
        <li 
          v-for="(item, index) in menuItemsSuperior" 
          :key="index" 
          :class="{ active: item.active }" 
          @click="navigate(item.text)"
        >
          {{ item.text }}
        </li>
      </ul>
      <ul class="menu-inferior">
        <li v-for="(item, index) in menuItemsInferior" :key="index">
          <span @click="navigate(item.text)" v-if="item.text">{{ item.text }}</span>
          <a v-if="item.logOutButton" @click="logout">{{ item.logOutButton }}</a>
        </li>
      </ul>
    </nav>
    <main class="content" :class="{ expanded: isSidebarCollapsed }">
      <slot></slot>
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
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

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
        //{ text: 'CREAR LECCIÓN' },
        { text: 'ARMAS' }
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
  return [
    { text: 'PERFIL' },
    { text: 'CONFIGURACIÓN' },
    { logOutButton: 'CERRAR SESIÓN' }
  ];
});

const navigate = (menuItem) => {
  const basePath = `/${userType.value}`;
  if (menuItem === 'INICIO') {
    router.push('/');
  } else if (menuItem === 'CREAR LECCIÓN') {
    router.push(`${basePath}/crear-leccion`);
  } else if (menuItem === 'BUSCAR') {
    router.push(`${basePath}/buscar`);
  } else if (menuItem === 'ARMAS') {
    router.push(`${basePath}/armas-unidades`);
  } else if (menuItem === 'USUARIOS') {
    router.push(`${basePath}/usuarios-listar`);
  } else if (menuItem === 'PERFIL') {
    router.push(`${basePath}/perfil`);
  } else if (menuItem === 'CONFIGURACIÓN') {
    router.push(`${basePath}/configuracion`);
  }
};

const logout = () => {
  store.commit('logout');
  router.push('/login');
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 250px;
  background-color: transparent;
  background-image: url('@/assets/fondosWeb/FondoDashboard.jpg') ; /* Ruta correcta */
  background-size: cover; /* Ajusta la imagen para que cubra todo el espacio */
  background-position: center; /* Centra la imagen */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  text-align: center;
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
}

.toggle-button {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  align-self: flex-end;
}

.menu-superior, .menu-inferior {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 15px 20px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar li.active {
  background-color: #3b3b4f;
  color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.content.expanded {
  margin-left: 60px;
}

@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100%;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.collapsed {
    transform: translateX(0);
  }

  .content {
    margin-left: 0;
  }

  .content.expanded {
    margin-left: 0;
  }
}
</style>
