<template>
  <div>
    <h1>Gestión de Lecciones de Tiro</h1>
    <!--VISTA LECCIONES-->
    <template v-if="tablaActual === 'lecciones'">
      <div class="poligono-container">
        <h3>Polígono detalle:</h3>
        <label for="poligono-select">Seleccionar un Polígono</label>
        <select id="poligono-select" v-model="poligonoSeleccionado" @change="cargarLecciones">
          <option 
          v-for="poligono in poligonos" 
          :key="poligono.id_poligono" 
          :value="poligono.id_poligono"
          >
            {{ poligono.nombre }}
          </option>
        </select>
        <div class="poligono-info">
          <label v-if="poligonoActual">Ciudad: {{ poligonoActual.ciudad }}</label>
          <label v-if="poligonoActual">Carriles Máximos: {{ poligonoActual.carriles_maximos }}</label>
          <label v-if="poligonoActual">Distancia Máxima: {{ poligonoActual.distancia_maxima }} mts.</label>
        </div>
      </div>

      <div>
        <button @click="abrirModal('poligono')">Agregar Polígono</button>     
        <Modal
        :visible="modalVisible" 
        :title="modalTitle" 
        @close="cerrarModal">
        <!--FORMULARIO CREAR POLIGONO-->
        <template v-if="modalType === 'poligono'">
          <form @submit.prevent="crearPoligono">
            <input type="text" id="nombre" v-model="nuevoPoligono.nombre" placeholder="Nombre Polígono" required>
            <input type="text" id="ciudad" v-model="nuevoPoligono.ciudad" placeholder="Ciudad" required>
            <input type="number" id="carriles-maximos" v-model="nuevoPoligono.carriles_maximos" placeholder="Carriles Máximos" required>
            <input type="number" id="distancia-maxima" v-model="nuevoPoligono.distancia_maxima" placeholder="Distancia Máxima">
            <button type="submit">Guardar</button>
          </form>
        </template>

        <!--FORMULARIO CREAR LECCION-->
        <template v-else-if="modalType === 'leccion'">
          <form @submit.prevent="crearLeccion">
            <input type="date" id="fecha-tiro" v-model="nuevaLeccion.fecha_tiro" placeholder="Fecha de Tiro" required>
            <input type="text" id="numero-orden" v-model="nuevaLeccion.numero_orden" placeholder="Número de Orden">
            <input type="date" id="fecha-orden" v-model="nuevaLeccion.fecha_orden" placeholder="Fecha de Orden">
            <select id="tipo-tiro" v-model="nuevaLeccion.tipo_tiro"  required>
              <option value="evaluacion">Evaluación</option>
              <option value="entrenamiento">Entrenamiento</option>
            </select>
            <input type="number" id="tiros-cereo" v-model="nuevaLeccion.cant_tiros_cereo" placeholder="Cantidad tiros Cereo" required>
            <input type="number" id="tiros-leccion" v-model="nuevaLeccion.cant_tiros_leccion" placeholder="Cantidad tiros Lección" required>
            <input type="number" id="distancia" v-model="nuevaLeccion.distancia" placeholder="Distancia (m)" required>
            <button type="submit">Guardar</button>
          </form>
        </template> 
        </Modal>
      </div>

      <div>
        <h2>Lecciones de Tiro</h2>
        <div class="actions-container">
          <button @click="abrirModal('leccion')">Agregar Lección</button>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar lecciones..." 
            class="search-input"
            @input="buscarConDebounce($event.target.value)"
          />
        </div>

        <div class="table-container">
          <div v-if="cargando" class="loading-overlay">
            <div class="spinner"></div>
          </div>
          
          <DataTable 
            :columns="columnasLecciones" 
            :rows="lecciones" 
            rowKey="id_leccion"
            @row-click="cargarFracciones"
            @scroll="manejarScroll"
          />

          <div v-if="!cargando && lecciones.length === 0" class="no-data">
            No se encontraron lecciones
          </div>
        </div>
      </div>
    </template>

    <!--VISTA FRACCIONES-->
    <template v-else-if="tablaActual === 'fracciones'">
      <h2>Fracciones de Tiro</h2>
      <button @click="volverALecciones">Volver</button>
      <button @click="crearFraccion">Agregar Fracción</button>
      <DataTable
      :columns="columnasFracciones"
      :rows="fracciones"
      rowKey="id_fraccion"
      @row-click="cargarTiradores"
      >
      </DataTable>
    </template>

    <!--VISTA TIRADORES-->
    <template v-else-if="tablaActual === 'tiradores'">
      <h2>Fracciones de Tiro</h2>
      <button @click="volverAFracciones">Volver</button>
      <button @click="abrirModal('tiradores')">Agregar Tiradores</button>

      <DataTable
      :columns="columnasTiradores"
      :rows="tiradores"
      rowKey="id_resultado"  
      />

      <Modal
        :visible="modalVisible" 
        :title="modalTitle" 
        @close="cerrarModal">
        <!--FORMULARIO PARA CREAR TIRADORES(USUARIO, ARMA Y RESULTADO)-->
        <template v-if="modalType === 'tiradores'">
          <form @submit.prevent="guardarTirador">
            <input type="text" id="rut" v-model="nuevoTirador.rut" placeholder="RUT" required @input="buscarSugerencias"/>
            <!--SUGERENCIAS-->
            <ul v-if="mostrarSugerencias">
              <li
                v-for="usuario in sugerencias"
                :key="usuario.rut"
                @click="seleccionarUsuario(usuario)"
                >
                {{ usuario.rut }} - {{ usuario.nombre }}
              </li>
            </ul>

            <input type="email" id="correo" v-model="nuevoTirador.correo" placeholder="Correo">
            <input type="text" id="grado" v-model="nuevoTirador.grado" placeholder="Grado">
            <input type="text" id="apellido-paterno" v-model="nuevoTirador.apellido_paterno" placeholder="Apellido Paterno" required>
            <input type="text" id="apellido-materno" v-model="nuevoTirador.apellido_materno" placeholder="Apellido Materno" required>
            <input type="text" id="nombre" v-model="nuevoTirador.nombre" placeholder="Nombre" required>
            <input type="text" id="uni-regimentaria" v-model="nuevoTirador.unidad_regimentaria" placeholder="Unidad Regimentaria" required>
            <input type="text" id="uni-combate" v-model="nuevoTirador.unidad_combate" placeholder="Unidad Combate" required>
            <input type="text" id="uni-fundamental" v-model="nuevoTirador.unidad_fundamental" placeholder="Unidad Fundamental" required>
            <input type="text" id="tipo-arma" v-model="nuevoTirador.tipo_arma" placeholder="Modelo Arma" required>
            <input type="text" id="modelo-arma" v-model="nuevoTirador.modelo_arma" placeholder="Modelo Arma" required>
            <input type="text" id="serie-arma" v-model="nuevoTirador.numero_serie" placeholder="Número de Serie" required>
            <button type="submit">Guardar</button>
          </form>
        </template>
      </Modal>
    </template>
 </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import { debounce } from 'lodash';

// Store
const store = useStore();

// Variables para búsqueda
const searchQuery = ref('');

// Variables para paginación y carga
const paginaActual = ref(1);
const elementosPorPagina = ref(10);
const totalElementos = ref(0);
const cargando = ref(false);
const todosLosDatosCargados = ref(false);

// Cache para datos
const cacheDatos = ref(new Map());
const tiempoCache = 5 * 60 * 1000; // 5 minutos

//Configuración formulario para Modal
const modalVisible = ref(false);
const modalType = ref ('');
const modalTitle = ref ('');
const tablaActual = ref('lecciones');

// Selecciones actuales
const poligonoSeleccionado = ref(null);
const leccionActual = ref(null);
const fraccionActual = ref(null);


// Datos del formulario
const nuevoPoligono = ref ({
  nombre: '',
  ciudad: '',
  carriles_maximos: null,
  distancia_maxima: null
});

const nuevaLeccion = ref({
  fecha_tiro: '',
  numero_orden: '',
  fecha_orden: '',
  tipo_tiro: '',
  cant_tiros_cereo: null,
  cant_tiros_leccion: null,
  distancia: null
});

// Array para almacenar todos los usuarios
const nuevoTirador = ref({
  rut: '',
  correo: '',
  grado: '',
  apellido_paterno: '',
  apellido_materno: '',
  nombre: '',
  unidad_regimentaria: '',
  unidad_combate: '',
  unidad_fundamental: '',
  tipo_arma: '',
  modelo_arma: '',
  numero_serie: '',
  rol: 'tirador',
  tiros_acertados: 0,
  total_tiros: 0,
  numero_carril: 1
});

// Carril inicial para la fraccion actual
const carrilActual = ref(1);
const poligonos = computed(() => store.state.poligonos);
const lecciones = ref([]);
const fracciones = computed(() => store.state.fracciones);
const tiradores = computed(() => store.state.tiradores);
const poligonoActual = computed(() => {
  return poligonos.value.find((poligono) => poligono.id_poligono === poligonoSeleccionado.value);
});
const maxCarriles = computed(() => {
  return poligonoActual.value ? poligonoActual.value.carriles_maximos : 0;
});

//Lista de usuarios sugeridos
const usuarios = ref([]);
const sugerencias = ref([]);
const mostrarSugerencias = ref(false);

// Armas
const armas = ref([]);

// Cargar las armas de la BD
const cargarArmas = async () => {
  try {
    await store.dispatch('fetchArmas');
    armas.value = store.state.armas;
  } catch (error) {
    console.error('Error al cargar las armas:', error);
  }
}

//Cargar todos los usuarios y sugerir
const cargarUsuarios = async () => {
  try {
    await store.dispatch('fetchUsuarios');
    usuarios.value = store.state.usuarios;
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
  }
};

// Función para buscar sugerencias
const buscarSugerencias = () => {
  const inputRut = nuevoTirador.value.rut.toLowerCase();
  sugerencias.value = usuarios.value.filter((usuario) =>
  usuario.rut.toLowerCase().startsWith(inputRut)
  );
  mostrarSugerencias.value = !!sugerencias.value.length;
};

// Al seleccionar usuario de la lista de sugerencias
const seleccionarUsuario = (usuario) => {
  // Rellena los campos edl formulario tirador
  nuevoTirador.value.rut = usuario.rut;
  nuevoTirador.value.correo = usuario.correo;
  nuevoTirador.value.grado = usuario.grado;
  nuevoTirador.value.apellido_paterno = usuario.apellido_paterno;
  nuevoTirador.value.apellido_materno = usuario.apellido_materno;
  nuevoTirador.value.nombre = usuario.nombre;
  nuevoTirador.value.unidad_regimentaria = usuario.unidad_regimentaria;
  nuevoTirador.value.unidad_combate = usuario.unidad_combate;
  nuevoTirador.value.unidad_fundamental = usuario.unidad_fundamental;

  mostrarSugerencias.value = false;
};

// Guardar tirador (separando usuario/arma/resultado)
const guardarTirador = async () => {
  try {
    if (!fraccionActual.value) {
      throw new Error('No hay fracción seleccionada.');
    }
    console.log('Carril actual:', carrilActual.value, 'Máximo carriles:', maxCarriles.value);
    //VERIFICAR CARRILES DISPONIBLES
    if (carrilActual.value > maxCarriles.value) {
      alert('No hay carriles disponibles');
      return;
    }

    // Verifica si el tirador/usuario ya existe en la fraccion
    const existeTiradorEnFraccion = tiradores.value.some(
      (t) => t.rut === nuevoTirador.value.rut
    );
    if (existeTiradorEnFraccion) {
      alert('El tirador ya existe en la fracción actual');
      return;
    }

    // Verificar si el arma existe
    const existeMismaArma = tiradores.value.some(
      (t) => t.serieArma === nuevoTirador.value.numero_serie 
    );
    if (existeMismaArma) {
      alert('El arma ya está asignada a otro tirador');
      return;
    }

    // Datos del usuario
    const usuarioData = {
      rut: nuevoTirador.value.rut,
      correo: nuevoTirador.value.correo,
      grado: nuevoTirador.value.grado,
      apellido_paterno: nuevoTirador.value.apellido_paterno,
      apellido_materno: nuevoTirador.value.apellido_materno,
      nombre: nuevoTirador.value.nombre,
      unidad_regimentaria: nuevoTirador.value.unidad_regimentaria,
      unidad_combate: nuevoTirador.value.unidad_combate,
      unidad_fundamental: nuevoTirador.value.unidad_fundamental,
      rol: 'tirador',
    };
    console.log('Datos del usuario:', usuarioData);

    // Verifica si el usuario existe
    const usuarioExistente = usuarios.value.find(
      (u) => u.rut === nuevoTirador.value.rut
    );

    let usuarioId;
    if (usuarioExistente) {
      usuarioId = usuarioExistente.id_usuario;
    } else {
      // Si no existe, crea un nuevo usuario
      const usuarioResponse = await store.dispatch('crearUsuario', usuarioData);
      usuarioId = usuarioResponse.data.id_usuario;
    }
    console.log('ID del usuario:', usuarioId);

    // Preparta los datos del arma
    const armaData = {
      tipo_arma: nuevoTirador.value.tipo_arma,
      modelo_arma: nuevoTirador.value.modelo_arma,
      numero_serie: nuevoTirador.value.numero_serie,
    };
    console.log('Datos del arma:', armaData);

    //const armaResponse = await store.dispatch('crearArma', armaData);
    //let armaId = armaResponse.data.id_arma;

    // Verificar si el arma existe
    const armaExistente = armas.value.find(
      (a) => a.numero_serie === nuevoTirador.value.numero_serie
    );

    let armaId;
    if (armaExistente) {
      armaId = armaExistente.id_arma;
    } else {
      // Si no existe, crea una nueva arma
      const armaResponse = await store.dispatch('crearArma', armaData);
      armaId = armaResponse.data.id_arma;
    }
    console.log('ID del arma:', armaId);

    // Prepara datos de resultado
    const resultadoData = {
      id_usuario: usuarioId,
      id_arma: armaId,
      id_fraccion: fraccionActual.value.id_fraccion,
      tiros_acertados: nuevoTirador.value.tiros_acertados,
      total_tiros: nuevoTirador.value.total_tiros,
      numero_carril: carrilActual.value,
    };
    console.log('Datos del resultado:', resultadoData);

    await store.dispatch('crearResultado', resultadoData);
    console.log('Tirador guardado con éxito');
    cargarUsuarios();
    cargarArmas();

    // Incrementar el carril actual
    carrilActual.value += 1;

    // Actualizar la lista de tiradores
    await store.dispatch('fetchTiradores', fraccionActual.value.id_fraccion);
    //cerrarModal();
  } catch (error) {
    console.error('Error al guardar tirador:', error);
  }

};



// Configuración de columnas para tabla
const columnasLecciones = ref( [
  { key: 'fecha_tiro', label: 'Fecha de Tiro', editable:true, endpoint: 'lecciones', type: 'date' },
  { key: 'tipo_tiro', label: 'Tipo de Tiro'},
  { key: 'distancia', label: 'Distancia (m)', editable:true, endpoint: 'lecciones' },
  { key: 'fecha_orden', label: 'Fecha de Orden', editable:true, endpoint: 'lecciones', type: 'date' },
  { key: 'numero_orden', label: 'N.° de Orden', editable:true, endpoint: 'lecciones', type: 'text' }
]);

const columnasFracciones = [
  { key: 'numero_fraccion', label: 'N.° de Fracción' },
  { key: 'tiradores_totales', label: 'Total de Tiradores' }
];

const columnasTiradores = [
  { key: 'numero_carril', label: 'Carril', editable: true, endpoint: 'resultados' },
  { key: 'rut', label: 'RUT', endpoint: 'usuario' },
  { key: 'grado', label: 'Grado', editable:true, endpoint: 'usuarios', type: 'option' },
  { key: 'apellido_paterno', label: 'Ap. Paterno' },
  { key: 'apellido_materno', label: 'Ap. Materno' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'uniCombate', label: 'Unidad Combate' },
  { key: 'uniFundamental', label: 'Unidad Fundamental' },
  { key: 'modeloArma', label: 'Modelo Arma' },
  { key: 'serieArma', label: 'N.° Serie' },
  { key: 'tiros_acertados', label: 'Aciertos', editable: true, endpoint: 'resultados' }
];


// Modal y navegacion de tablas
const abrirModal = (tipo) => {
  modalType.value = tipo;
  modalTitle.value = tipo;
  //modalVisible.value = true;
  if (tipo === 'poligono') {
    modalTitle.value = 'Agregar Nuevo Polígono';
    modalVisible.value = true;
  } else if (tipo === 'leccion') {
    modalTitle.value = 'Agregar Nueva Lección';
    modalVisible.value = true;
  } else if (tipo === 'tiradores') {
    if (carrilActual.value > maxCarriles.value) {
      alert('No hay carriles disponibles');
    }else {
      cargarUsuarios();
      cargarArmas();
      modalTitle.value = 'Agregar Nuevo Tirador';
      modalVisible.value = true;
    };
  };
  console.log('Modal abierto:', modalVisible.value, modalType.value);
}

const cerrarModal = () => {
  modalVisible.value = false;
}
const volverALecciones = () => {
  tablaActual.value = 'lecciones';
};
const volverAFracciones = () => {
  tablaActual.value = 'fracciones';
};

// ---------------------------------------------------------
// CRUD Polígonos / Lecciones / Fracciones
// ---------------------------------------------------------
const crearPoligono = async () => {
  await store.dispatch('crearPoligono', nuevoPoligono.value);
  cerrarModal();
  store.dispatch('fetchPoligonos'); // Actualiza la lista de polígonos
}

const crearLeccion = async () => {
  if (poligonoSeleccionado.value) {
    const datosLeccion = {
      ...nuevaLeccion.value,
      id_poligono: poligonoSeleccionado.value, // Con esto agrego el id del polígono a la creación de la lección
      fecha_orden: nuevaLeccion.value.fecha_orden || null
    };

    console.log('Datos de la lección:', datosLeccion);
    try {
      await store.dispatch('crearLeccion', datosLeccion);
      store.dispatch('fetchLecciones', poligonoSeleccionado.value);
      cerrarModal();
    } catch (error) {
      console.error('Error al crear la lección:', error);
    }
  }
};

const crearFraccion = async () => {
  if (!leccionActual.value) {
    console.error('No hay lección seleccionada');
    return;
  }
  //const fraccionNumero = fracciones.value.length + 1;
  const nuevaFraccion = {
    id_leccion: parseInt(leccionActual.value.id_leccion, 10),
    numero_fraccion: fracciones.value.length + 1,
    tiradores_totales: 0
  };
  try {
    await store.dispatch('crearFraccion', nuevaFraccion);
    console.log('Fracción creada:', nuevaFraccion);
    await store.dispatch('fetchFracciones',leccionActual.value.id_leccion);
  } catch (error) {
    console.error('Error al crear la fracción:', error);
  }
};

// ---------------------------------------------------------
// Carga de datos al hacer clic en una fila
// ---------------------------------------------------------
const cargarLecciones = async () => {
  if (poligonoSeleccionado.value) {
    try {
      cargando.value = true;
      const cacheKey = `lecciones-${poligonoSeleccionado.value}-${paginaActual.value}`;
      
      // Verificar caché
      const datosCache = obtenerDatosCache(cacheKey);
      if (datosCache) {
        lecciones.value = datosCache;
        cargando.value = false;
        return;
      }

      const response = await store.dispatch('fetchLecciones', {
        id_poligono: parseInt(poligonoSeleccionado.value),
        pagina: paginaActual.value,
        limite: elementosPorPagina.value
      });

      // Verificar si la respuesta existe antes de acceder a sus propiedades
      if (response && response.data) {
        lecciones.value = response.data;
        totalElementos.value = response.total || 0;
        guardarEnCache(cacheKey, response.data);
      } else {
        lecciones.value = [];
        totalElementos.value = 0;
      }
    } catch (error) {
      console.error('Error al cargar lecciones:', error);
      lecciones.value = [];
      totalElementos.value = 0;
    } finally {
      cargando.value = false;
    }
  }
};

// Función para cargar más datos (scroll infinito)
const cargarMasDatos = async () => {
  if (!cargando.value && !todosLosDatosCargados.value) {
    try {
      cargando.value = true;
      const response = await store.dispatch('fetchLecciones', {
        id_poligono: poligonoSeleccionado.value,
        pagina: paginaActual.value + 1,
        limite: elementosPorPagina.value
      });

      if (response.data && response.data.length > 0) {
        lecciones.value = [...lecciones.value, ...response.data];
        paginaActual.value++;
      } else {
        todosLosDatosCargados.value = true;
      }
    } catch (error) {
      console.error('Error al cargar más datos:', error);
    } finally {
      cargando.value = false;
    }
  }
};

// Función debounce para búsqueda
const buscarConDebounce = debounce((query) => {
  realizarBusqueda(query);
}, 300);

const realizarBusqueda = async (query) => {
  if (!query) {
    await cargarLecciones();
    return;
  }

  try {
    cargando.value = true;
    // Obtener todas las lecciones primero
    const response = await store.dispatch('fetchLecciones', {
      id_poligono: poligonoSeleccionado.value,
      pagina: 1,
      limite: 100 // Un número grande para obtener todas las lecciones
    });
    
    if (response && response.data) {
      // Filtrar las lecciones localmente
      const leccionesFiltradas = response.data.filter(leccion => {
        const searchStr = query.toLowerCase();
        return (
          (leccion.fecha_tiro && leccion.fecha_tiro.toLowerCase().includes(searchStr)) ||
          (leccion.tipo_tiro && leccion.tipo_tiro.toLowerCase().includes(searchStr)) ||
          (leccion.distancia && leccion.distancia.toString().includes(searchStr)) ||
          (leccion.fecha_orden && leccion.fecha_orden.toLowerCase().includes(searchStr)) ||
          (leccion.numero_orden && leccion.numero_orden.toLowerCase().includes(searchStr))
        );
      });
      
      lecciones.value = leccionesFiltradas;
    }
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    lecciones.value = [];
  } finally {
    cargando.value = false;
  }
};

const cargarFracciones = async (leccion) => {
  leccionActual.value = leccion; // Guarda leccion actual
  try {
    await store.dispatch('fetchFracciones', leccion.id_leccion);
    tablaActual.value = 'fracciones';
  } catch (error) {
    console.error('Error al cargar las fracciones:', error);
  }
};
const cargarTiradores = (fraccion) => {
  console.log('Poligono seleccionado:', poligonoSeleccionado.value);
  fraccionActual.value = fraccion; // Asigna la fraccion actual
  store.dispatch('fetchTiradores', fraccion.id_fraccion);
  tablaActual.value = 'tiradores';
  inicializarCarril(fraccionActual.value);
};

// ---------------------------------------------------------
// Calcula carriles asignados a una fraccion
// ---------------------------------------------------------
const inicializarCarril = async () => {
  if(fraccionActual.value ) {
    try {
      // Carga tiradores para fraccion actual
      const tiradoresEnFraccion = await store.dispatch('fetchTiradores', fraccionActual.value.id_fraccion);
      console.log('Tiradores en la fraccion:', tiradoresEnFraccion);

      // Encuentra el numero mayor de carril ocupado
      const ultimoCarril = tiradoresEnFraccion.reduce((max, tirador) => {
        return tirador.numero_carril > max ? tirador.numero_carril : max;
      }, 0);

      // Establece el siguiente carril disponible
      carrilActual.value = ultimoCarril + 1;
      console.log('Carril inicializado:', carrilActual.value);

    } catch (error) {
      console.error('Error al cargar los carriles:', error);
    }
  }
};

// Función para verificar caché
const obtenerDatosCache = (key) => {
  const datosCache = cacheDatos.value.get(key);
  if (datosCache && Date.now() - datosCache.timestamp < tiempoCache) {
    return datosCache.data;
  }
  return null;
};

// Función para guardar en caché
const guardarEnCache = (key, data) => {
  cacheDatos.value.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Función para manejar el scroll infinito
const manejarScroll = async (event) => {
  const element = event.target;
  if (
    element.scrollHeight - element.scrollTop <= element.clientHeight * 1.5 &&
    !cargando.value &&
    !todosLosDatosCargados.value
  ) {
    await cargarMasDatos();
  }
};

// Cargar polígonos y lecciones al montar
onMounted(() => {
  store.dispatch('fetchPoligonos');
});

</script>

<style scoped>
/* Remover estilos que interfieren con el Modal */
.form-modal {
  /* Los estilos del formulario vendrán del Modal.vue */
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  margin-bottom: 1rem;
  color: aliceblue;
  text-align: center;
}

h2 {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: aliceblue;
  margin-bottom: 1rem;
}

h3 {
  color: aliceblue;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.poligono-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.poligono-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

label {
  color: aliceblue;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.3rem;
}

select {
  width: 100%;
  max-width: 300px;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  margin-bottom: 0.5rem;
}

select:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

button {
  background: #4a9eff;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
}

button:hover {
  background: #3d8be6;
}

.actions-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #4a9eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-container {
  position: relative;
  min-height: 200px;
}

.no-data {
  text-align: center;
  color: aliceblue;
  padding: 2rem;
  font-style: italic;
}
</style>