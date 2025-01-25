import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/auth/Login.vue';
import RecoverAccount from '../views/auth/RecoverAccount.vue'; 
import InicioAdmin from '../views/ingresoAdmin/InicioAdmin.vue';
import InicioLimitado from '../views/ingresoLimitado/InicioLimitado.vue';
import InicioTirador from '../views/ingresoTirador/InicioTirador.vue';
import Layout from '../components/Layout.vue';
import CrearLeccion from '@/views/ingresoAdmin/CrearLeccion.vue';
import Perfil from '@/views/genericas/Perfil.vue';
import Configuracion from '@/views/genericas/Configuracion.vue';
import Buscar from '@/views/ingresoAdmin/Buscar.vue';
import UsuariosListar from '@/views/ingresoAdmin/UsuariosListar.vue';
import ArmasUnidades from '@/views/ingresoLimitado/ArmasUnidades.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Redirige la ruta raiz a login
  { path: '/login', component: Login }, // Ruta para el componente de inicio
  { path: '/recover', component: RecoverAccount }, // Ruta para el componente de recuperar cuenta
  {
    path: '/admin',
    component: Layout, // Usa componente layout como contenedor de las rutas hijas
    meta: { requiresAuth: true, role: 'admin' }, // Propiedad meta para verificar si la ruta requiere autenticación
    children: [
      {
        path: '',
        component: InicioAdmin // Coomponente que se renderiza en la ruta
      },
      {
        path: '/:userType/crear-leccion',
        component: CrearLeccion
      },
      {
        path: '/:userType/buscar',
        component: Buscar
      },
      {
        path: '/:userType/usuarios-listar',
        component: UsuariosListar

      },
    ]
  },
  {
    path: '/limitado',
    component: Layout,
    meta: { requiresAuth: true, role: 'limitado' },
    children: [
      {
        path: '',
        component: InicioLimitado
      },
      {
        path: '/:userType/armas-unidades',
        component: ArmasUnidades
      }
    ]
  },
  {
    path: '/tirador',
    component: Layout,
    meta: { requiresAuth: true, role: 'tirador' },
    children: [
      {
        path: '',
        component: InicioTirador
      }
    ]
  },
  {
    path: '/:userType/perfil',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: Perfil
      }
    ]
  },
  {
    path: '/:userType/configuracion',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: Configuracion
      }
    ]
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth); // Verifica si la ruta requiere autenticación
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Verifica si el usuario está autenticado
  const userType = localStorage.getItem('userType'); // Obtiene el tipo de usuario (admin, limitado, tirador)

  if (to.path === '/login' && isAuthenticated) {
    //Redirige al usuario a su pagina correspondiente
    if (userType === 'admin') {
      next({ path: '/admin' });
    } else if (userType === 'limitado') {
      next({ path: '/limitado' });
    } else if (userType === 'tirador') {
      next({ path: '/tirador' });
    }  else {
      next();
    }
  } else if (requiresAuth && !isAuthenticated) {
    // Redirige al usuario a la página de login si no está autenticado
    next('/login' );
  } else if (requiresAuth && to.meta.role && to.meta.role !== userType) {
    next('./login');
  } else {
    next();
  }
});


export default router;