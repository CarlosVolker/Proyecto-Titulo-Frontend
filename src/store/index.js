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
    logout(state) {
      state.userType = '';
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('id');
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
        const response = await axios.get(`usuarios/${localStorage.getItem('id')}`, {
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

    logout({ commit }) {
      commit('logout');
    }
  }

});

export default store;