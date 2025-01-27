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
const currentRoute = computed(() => router.currentRoute.value.path);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const isMenuItemActive = (menuItem) => {
  const path = currentRoute.value.toLowerCase();
  switch (menuItem) {
    case 'INICIO':
      return path === '/' || path === `/${userType.value}`;
    case 'CREAR LECCIÓN':
      return path.includes('crear-leccion');
    case 'BUSCAR':
      return path.includes('buscar');
    case 'USUARIOS':
      return path.includes('usuarios-listar');
    case 'ARMAS':
      return path.includes('armas-unidades');
    case 'PERFIL':
      return path.includes('perfil');
    case 'CONFIGURACIÓN':
      return path.includes('configuracion');
    default:
      return false;
  }
};

const menuItemsSuperior = computed(() => {
  switch (userType.value) {
    case 'admin':
      return [
        { text: 'INICIO', active: isMenuItemActive('INICIO') },
        { text: 'CREAR LECCIÓN', active: isMenuItemActive('CREAR LECCIÓN') },
        { text: 'BUSCAR', active: isMenuItemActive('BUSCAR') },
        { text: 'USUARIOS', active: isMenuItemActive('USUARIOS') },
      ];
    case 'limitado':
      return [
        { text: 'INICIO', active: isMenuItemActive('INICIO') },
        { text: 'ARMAS', active: isMenuItemActive('ARMAS') }
      ];
    case 'tirador':
      return [
        { text: 'INICIO', active: isMenuItemActive('INICIO') },
        { text: 'MIS LECCIONES', active: isMenuItemActive('MIS LECCIONES') },
        { text: 'PERFIL', active: isMenuItemActive('PERFIL') }
      ];
    default:
      return [];
  }
});

const menuItemsInferior = computed(() => {
  return [
    { text: 'PERFIL', active: isMenuItemActive('PERFIL') },
    { text: 'CONFIGURACIÓN', active: isMenuItemActive('CONFIGURACIÓN') },
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: transparent;
  background-image: url('@/assets/fondosWeb/FondoDashboard.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  z-index: 20;
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
  margin-left: 250px;
  height: 100vh;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  position: relative;
  z-index: 15;
}

.content.expanded {
  margin-left: 60px;
}

@media screen and (max-width: 768px) {
  .sidebar {
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
