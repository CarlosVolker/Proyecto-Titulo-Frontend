import { createStore } from 'vuex';
import axios from '../axios';

const store = createStore({
  state: {
    userType: localStorage.getItem('userType') || '',
    isAuthenticated: !!localStorage.getItem('accessToken'),
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType;
      localStorage.setItem('userType', userType);
    },
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', token);

    },
    setId(state, id_usuario) {
      localStorage.setItem('id_usuario', id_usuario);

    },
    logout(state) {
      state.userType = '';
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('id_usuario');
    }
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Token de acceso: ', token);
        if (!token) {
          throw new Error('No se encontró el token de acceso');
        }
        const response = await axios.get(`usuarios/${localStorage.getItem('id_usuario')}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Información del perfil: ', response.data);
        commit('setUser', response.data);
      } catch (error) {
        console.error('Error al obtener la información del perfil', error);
      }
    },
    login({ commit }, { token, id_usuario, userType }) {
      commit('setToken', token);
      commit('setId', id_usuario);
      commit('setUserType', userType);

    },

    logout({ commit }) {
      commit('logout');
    }
  }

});

export default store;