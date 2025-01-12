import { createStore } from 'vuex';
import axios from '../axios';

const store = createStore({
  state: {
    userType: localStorage.getItem('userType') || '',
    isAuthenticated: !!localStorage.getItem('accessToken'),
    poligonos: [],
    lecciones: [],
    fracciones: [],
    tiradores: [],
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
    },
    setPoligonos(state, poligonos) {
      state.poligonos = poligonos;
    },
    setLecciones(state, lecciones) {
      state.lecciones = lecciones;
    },
    setFracciones(state, fracciones) {
      state.fracciones = fracciones;
    },
    setTiradores(state, tiradores) {
      state.tiradores = tiradores;
    },
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

    async fetchPoligonos({ commit }) {
      try {
        const response = await axios.get('poligonos/');
        commit('setPoligonos', response.data);
        //console.log('Poligonos: ', response.data);
      } catch (error) {
        console.error('Error al obtener los poligonos', error);
      }
    },
    async fetchLecciones({ commit }, poligonoId) {
      try {
        const response = await axios.get(`poligonos/${poligonoId}/lecciones`);
        commit('setLecciones', response.data);
        //console.log('Lecciones: ', response.data);
      } catch (error) {
        console.error('Error al obtener las lecciones', error);
      }
    },

    async fetchFracciones({ commit }, leccionId) {
      try {
        const response = await axios.get(`lecciones/${leccionId}/fracciones`);
        commit('setFracciones', response.data);
      } catch (error) {
        console.error('Error al obtener las fracciones', error);
      }
    },

    async fetchTiradores({ commit }, fraccionId) {
      try {
        const response = await axios.get(`fracciones/${fraccionId}/resultados`);
        const tiradores = response.data.map(item => ({
          grado: item.usuario.grado,
          rut: item.usuario.rut,
          nombre: item.usuario.nombre,
          apellido_paterno: item.usuario.apellido_paterno,
          apellido_materno: item.usuario.apellido_materno,
          uniCombate: item.usuario.unidad_combate,
          uniFundamental: item.usuario.unidad_fundamental,
          modeloArma: item.arma.modelo_arma,
          serieArma: item.arma.numero_serie,
          numero_carril: item.resultado.numero_carril,
          tiros_acertados: item.resultado.tiros_acertados,
          resultado_id: item.resultado.id_resultado
        }));
        commit('setTiradores', tiradores);
      } catch (error) {
        console.error('Error cargando tiradores', error);
      }
    },

    async crearPoligono({ commit }, poligono) {
      try {
        await axios.post('poligonos/', poligono);
        //commit('agregarPoligono', poligono);
      } catch (error) {
        console.error('Error al crear el poligono', error);
      }
    },

    async crearLeccion({ commit }, leccionData) {
      try {
        const response = await axios.post(`lecciones/`, leccionData);
        commit('setLecciones', response.data);
        console.log('Leccion creada: ', response.data);

      } catch (error) {
        console.error('Error al crear la leccion', error);
      }

    },

    logout({ commit }) {
      commit('logout');
    }
  }

});

export default store;