import { createStore } from 'vuex';
import axios from '@/axios';

const store = createStore({
  state: {
    user: null,
    userType: localStorage.getItem('userType') || '',
    isAuthenticated: !!localStorage.getItem('accessToken'),
    poligonos: [],
    lecciones: [],
    fracciones: [],
    tiradores: [],
    usuarios: [],
    armas: [],
    resultados: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserType(state, userType) {
      state.userType = userType;
      localStorage.setItem('userType', userType);
    },
    setToken(state, token) {
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', token);
    },
    setId(state, id_usuario) {
      localStorage.setItem('id_usuario', id_usuario);
    },
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios;
    },
    setArmas(state, armas) {
      state.armas = armas;
    },
    logout(state) {
      state.user = null;
      state.userType = '';
      state.isAuthenticated = false;
      state.poligonos = [];
      state.lecciones = [];
      state.fracciones = [];
      state.tiradores = [];
      state.usuarios = [];
      state.armas = [];
      state.resultados = [];
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
    setResultados(state, resultados) {
      state.resultados = resultados;
    },
  },
  actions: {
    async fetchUser({ commit, state }) {
      try {
        // Si ya tenemos los datos del usuario en el estado, los retornamos directamente
        if (state.user) {
          return state.user;
        }

        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No se encontró el token de acceso');
        }

        const response = await axios.get(`usuarios/${localStorage.getItem('id_usuario')}`, {
          headers: {Authorization: `Token ${token}`},
        });
        commit('setUser', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener la información del perfil', error);
        throw error;
      }
    },
    login({ commit }, { token, id_usuario, userType }) {
      commit('setToken', token);
      commit('setId', id_usuario);
      commit('setUserType', userType);
    },
    logout({ commit }) {
      commit('logout');
    },
    async fetchPoligonos({ commit }) {
      try {
        const response = await axios.get('poligonos/');
        commit('setPoligonos', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener polígonos:', error);
        throw error;
      }
    },
    async fetchLecciones({ commit }, { id_poligono, pagina, limite }) {
      try {
        const response = await axios.get(`poligonos/${id_poligono}/lecciones/`, {
          params: {
            page: pagina,
            limit: limite
          }
        });
        commit('setLecciones', response.data);
        return {
          data: response.data,
          total: response.data.length
        };
      } catch (error) {
        console.error('Error al obtener las lecciones', error);
        return {
          data: [],
          total: 0
        };
      }
    },
    async buscarLecciones({ commit }, { id_poligono, query }) {
      try {
        const response = await axios.get(`poligonos/${id_poligono}/lecciones/`, {
          params: {
            search: query
          }
        });
        commit('setLecciones', response.data);
        return {
          data: response.data,
          total: response.data.length
        };
      } catch (error) {
        console.error('Error en la búsqueda de lecciones', error);
        return {
          data: [],
          total: 0
        };
      }
    },
    async fetchFracciones({ commit }, idLeccion) {
      try {
        const response = await axios.get(`lecciones/${idLeccion}/fracciones`);
        console.log('Fracciones: ', response.data);
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
        return tiradores;
      } catch (error) {
        console.error('Error cargando tiradores', error);
      }
    },
    async crearPoligono({ commit }, poligono) {
      try {
        await axios.post('poligonos/', poligono);
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
    async crearFraccion({ }, fraccionData) {
      try {
        console.log('Fracción a crear: ', fraccionData);
        const response = await axios.post(`fracciones/`, fraccionData);
        console.log('Fracción creada: ', response.data);
      } catch (error) {
        console.error('Error al crear la fracción', error);
      }
    },
    async fetchUsuarios({ commit }) {
      try {
        const response = await axios.get('usuarios/');
        commit('setUsuarios', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
      }
    },
    async fetchArmas({ commit }) {
      try {
        const response = await axios.get('armas/');
        commit('setArmas', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener armas:', error);
        throw error;
      }
    },
    async crearUsuario({ commit }, usuarioData) {
      try {
        console.log('Datos enviados para crear usuario (store): ', usuarioData);
        const response = await axios.post('usuarios/', usuarioData);
        return response;
      } catch (error) {
        console.error('Error al crear el usuario', error);
        throw error;
      }
    },
    async crearArma({ commit }, armaData) {
      try {
        const response = await axios.post('armas/', armaData);
        return response;
      } catch (error) {
        console.error('Error al crear el arma', error);
        throw error;
      }
    },
    async crearResultado({ commit }, resultadoData) {
      try {
        const response = await axios.post('resultados/', resultadoData);
        return response;
      }catch (error) {
        console.error('Error al crear el resultado', error);
        throw error;
      }
    },
    async updateUser({ commit }, {idUsuario = null, updateData}) {
      try {
        const userId = idUsuario || localStorage.getItem('id_usuario');

        if (!userId) {
          throw new Error('No se encontró el id del usuario');
        }

        const response = await axios.patch(`usuarios/${userId}/`, updateData);
        console.log('Usuario actualizado(vuex): ', response.data);

        if (idUsuario === null || userId === localStorage.getItem('id_usuario')) {
        commit('setUser', response.data);
        }
        return response.data;
      }catch (error) {
        console.error('Error al actualizar el usuario(vuex)', error);
        throw error;
      }
    },
    async cambiarContrasena({ state }, { idUsuario = null, old_password = null, new_password }) {
      try {
        idUsuario = idUsuario || localStorage.getItem('id_usuario');

        const data = old_password
        ? { old_password, new_password }
        : { new_password };

        console.log('Datos de cambio', idUsuario, data);

        const response = await axios.post(`usuarios/${idUsuario}/cambiar-contrasena/`, data);

        console.log('Contraseña cambiada: ', response.data);
        return response.data;

      } catch (error) {
        console.error('Error al cambiar la contraseña', error);
        throw error;
      }
    },
    async eliminarUsuario({ commit }, idUsuario) {
      try {
        const response = await axios.delete(`usuarios/${idUsuario}/`);
        return response;
      } catch (error) {
        console.error('Error al eliminar el usuario', error);
        throw error;
      }
    },
    async fetchLeccionesPoligono({ commit }, idPoligono) {
      try {
        const response = await axios.get(`poligonos/${idPoligono}/lecciones/`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener lecciones del polígono:', error);
        throw error;
      }
    },
    async fetchResultadosLeccion({ commit }, idLeccion) {
      try {
        const response = await axios.get(`lecciones/${idLeccion}/resultados/`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener resultados de la lección:', error);
        throw error;
      }
    },
    async fetchUsuariosLeccion({ commit }, idLeccion) {
      try {
        const response = await axios.get(`lecciones/${idLeccion}/usuarios/`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener usuarios de la lección:', error);
        throw error;
      }
    },
    async fetchResultados({ commit }) {
      try {
        const response = await axios.get('resultados/');
        const resultadosConId = response.data.map(resultado => ({
          ...resultado,
          id_resultado: resultado.id_resultado || resultado.id // Aseguramos que siempre haya un id único
        }));
        commit('setResultados', resultadosConId);
        return resultadosConId;
      } catch (error) {
        console.error('Error al obtener resultados:', error);
        throw error;
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    userType: state => state.userType
  }
});

export default store;