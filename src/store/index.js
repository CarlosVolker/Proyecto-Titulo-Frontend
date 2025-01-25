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
    usuarios: [],
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType;
      localStorage.setItem('userType', userType);
    },
    // Mutacion que maneja un solo usuario (usuario actual)
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
    // Mutacion para un listado de usuarios (setUser y setUsuarios se pueden combinar)
    // pero preferí manejarlos por separado para tener más control
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios;
    },
    setArmas(state, armas) {
      state.armas = armas;
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
    // Autenticacion/manejo de usuario actual
    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem('accessToken');
        
        console.log('Token de acceso: ', token);
        if (!token) {
          throw new Error('No se encontró el token de acceso');
        }
        const response = await axios.get(`usuarios/${localStorage.getItem('id_usuario')}`, {
          headers: {Authorization: `Token ${token}`},
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
    },

    // Polígonos, Lecciones, Fracciones y Tiradores
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
    // Crear una leccion
    async crearLeccion({ commit }, leccionData) {
      try {
        const response = await axios.post(`lecciones/`, leccionData);
        commit('setLecciones', response.data);
        console.log('Leccion creada: ', response.data);
      } catch (error) {
        console.error('Error al crear la leccion', error);
      }
    },
    // Crear una fraccion
    async crearFraccion({ }, fraccionData) {
      try {
        console.log('Fracción a crear: ', fraccionData);
        const response = await axios.post(`fracciones/`, fraccionData);
        console.log('Fracción creada: ', response.data);
      } catch (error) {
        console.error('Error al crear la fracción', error);
      }
    },

    //Módulo de usuarios, armas y resultados

    // Obtener todos los usuarios de la BD
    async fetchUsuarios({ commit }) {
      try {
        const response = await axios.get('usuarios/');
        commit('setUsuarios', response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      }
    },
    // Obtener todas las armas de la BD
    async fetchArmas({ commit }) {
      try {
        const response = await axios.get('armas/');
        commit('setArmas', response.data);
      } catch (error) {
        console.error('Error al obtener las armas', error);
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
    // Actualizar datos de usuario
    async updateUser({ commit }, {idUsuario = null, updateData}) {
      try {
        // Si no recibe el id del usuario, se toma el id del usuario actual
        const userId = idUsuario || localStorage.getItem('id_usuario');

        if (!userId) {
          throw new Error('No se encontró el id del usuario');
        }

        const response = await axios.patch(`usuarios/${userId}/`, updateData);
        console.log('Usuario actualizado(vuex): ', response.data);

        // Si se actualiza el usuario actual, se actualiza el state
        if (idUsuario === null || userId === localStorage.getItem('id_usuario')) {
        commit('setUser', response.data);
        }
        return response.data;
      }catch (error) {
        console.error('Error al actualizar el usuario(vuex)', error);
        throw error;
      }
    },
    // Cambiar contraseña
    async cambiarContrasena({ state }, {old_password, new_password}) {
      try {
        //const token = localStorage.getItem('accessToken');
        const idUsuario = localStorage.getItem('id_usuario');
        console.log('Datos de cambio', idUsuario, old_password, new_password);
        const response = await axios.post(
          `usuarios/${idUsuario}/cambiar-contrasena/`,
          { old_password, new_password }, 

        );
         console.log('Contraseña cambiada: ', response.data);
         return response.data;

      } catch (error) {
        console.error('Error al cambiar la contraseña', error.response.data);
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
    }
  },
});

export default store;