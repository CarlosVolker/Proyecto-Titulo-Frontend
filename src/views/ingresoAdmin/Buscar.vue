<template>
  <div class="buscar-container">
    <h1>Búsqueda</h1>
    
    <div class="search-controls">
      <select v-model="tipoSeleccionado" @change="cargarDatos" class="search-select">
        <option value="">Seleccione tipo de búsqueda</option>
        <option value="poligonos">Polígonos</option>
        <option value="lecciones">Lecciones</option>
        <option value="armas">Armas</option>
        <option value="tiradores">Tiradores (Tiros acertados)</option>
      </select>

      <!-- Filtros específicos para armas -->
      <div v-if="tipoSeleccionado === 'armas'" class="armas-filters">
        <select v-model="tipoArmaSeleccionado" @change="filtrarArmas" class="search-select">
          <option value="">Todos los tipos de arma</option>
          <option v-for="tipo in tiposArma" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
        <input 
          type="text" 
          v-model="numeroSerieFilter" 
          placeholder="Buscar por número de serie"
          class="search-input"
          @input="filtrarArmas"
        >
      </div>
    </div>

    <!-- Título del polígono seleccionado -->
    <div v-if="poligonoSeleccionado" class="poligono-info">
      <h2>Lecciones en {{ poligonoSeleccionado.nombre }}</h2>
      <button @click="volverAPoligonos" class="volver-btn">Volver a Polígonos</button>
    </div>

    <!-- Detalles de la lección seleccionada -->
    <div v-if="leccionSeleccionadaDetalles" class="leccion-detalles">
      <div class="leccion-header">
        <h2>Detalles de la Lección</h2>
        <button @click="volverALecciones" class="volver-btn">Volver a Lecciones</button>
      </div>
      <div class="leccion-info">
        <div class="info-item">
          <span class="label">Fecha de Tiro:</span>
          <span>{{ leccionSeleccionadaDetalles.fecha_tiro }}</span>
        </div>
        <div class="info-item">
          <span class="label">Número de Orden:</span>
          <span>{{ leccionSeleccionadaDetalles.numero_orden || 'No especificado' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Fecha de Orden:</span>
          <span>{{ leccionSeleccionadaDetalles.fecha_orden || 'No especificada' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Distancia:</span>
          <span>{{ leccionSeleccionadaDetalles.distancia }} metros</span>
        </div>
        <div class="info-item">
          <span class="label">Tiros de Cereo:</span>
          <span>{{ leccionSeleccionadaDetalles.cant_tiros_cereo }}</span>
        </div>
        <div class="info-item">
          <span class="label">Tiros de Lección:</span>
          <span>{{ leccionSeleccionadaDetalles.cant_tiros_leccion }}</span>
        </div>
        <div class="info-item">
          <span class="label">Tipo de Tiro:</span>
          <span>{{ leccionSeleccionadaDetalles.tipo_tiro || 'No especificado' }}</span>
        </div>
      </div>
    </div>

    <!-- Campo de búsqueda general -->
    <div v-if="datos.length > 0 && tipoSeleccionado !== 'armas'" class="search-filter">
      <input 
        type="text" 
        v-model="searchQuery" 
        :placeholder="'Buscar en ' + getTipoTablaActual()"
        class="search-input"
        @input="filtrarDatos"
      >
    </div>

    <DataTable 
      v-if="datosFiltrados.length > 0"
      :columns="columnas" 
      :rows="datosFiltrados"
      :rowKey="rowKey"
      :showEditButton="false"
      @row-click="handleRowClick"
    />
    <p v-else class="no-data">{{ mensajeNoData }}</p>

    <!-- Detalles del tirador seleccionado -->
    <div v-if="tiradorSeleccionado" class="tirador-detalles">
      <div class="tirador-header">
        <h2>Detalles del Tirador</h2>
        <button @click="volverATiradores" class="volver-btn">Volver a Tiradores</button>
      </div>
      <div class="tirador-info">
        <div class="info-item">
          <span class="label">RUT:</span>
          <span>{{ tiradorSeleccionado.rut }}</span>
        </div>
        <div class="info-item">
          <span class="label">Grado:</span>
          <span>{{ tiradorSeleccionado.grado }}</span>
        </div>
        <div class="info-item">
          <span class="label">Nombre Completo:</span>
          <span>{{ tiradorSeleccionado.nombre }} {{ tiradorSeleccionado.apellido_paterno }} {{ tiradorSeleccionado.apellido_materno }}</span>
        </div>
        <div class="info-item">
          <span class="label">Total Lecciones:</span>
          <span>{{ tiradorSeleccionado.total_lecciones }}</span>
        </div>
        <div class="info-item">
          <span class="label">Tiros Acertados:</span>
          <span>{{ tiradorSeleccionado.tiros_acertados }}</span>
        </div>
        <div class="info-item">
          <span class="label">Total Tiros:</span>
          <span>{{ tiradorSeleccionado.total_tiros }}</span>
        </div>
      </div>
    </div>
    </div>
    </template>
    
    <script setup>
import { ref, computed } from 'vue';
    import { useStore } from 'vuex';
import DataTable from '@/components/DataTable.vue';
import axios from '@/axios';
    
    const store = useStore();
const tipoSeleccionado = ref('');
const leccionSeleccionada = ref('');
const datos = ref([]);
const lecciones = ref([]);
const mensajeNoData = ref('Seleccione un tipo de búsqueda');
const poligonoSeleccionado = ref(null);
const searchQuery = ref('');
const datosFiltrados = ref([]);

// Nuevas variables para filtros de armas
const tipoArmaSeleccionado = ref('');
const numeroSerieFilter = ref('');
const tiposArma = ref([]);

const leccionSeleccionadaDetalles = ref(null);

const rowKey = computed(() => {
  if (poligonoSeleccionado.value) return 'id_leccion';
  switch(tipoSeleccionado.value) {
    case 'poligonos': return 'id_poligono';
    case 'lecciones': return 'id_leccion';
    case 'armas': return 'id_arma';
    case 'tiradores': return 'resultado_id';
    default: return 'id';
  }
});

const columnas = computed(() => {
  if (poligonoSeleccionado.value) {
    return [
      { key: 'fecha_tiro', label: 'Fecha de Tiro' },
      { key: 'numero_orden', label: 'Número de Orden' },
      { key: 'fecha_orden', label: 'Fecha de Orden' },
      { key: 'tipo_tiro', label: 'Tipo de Tiro' },
      { key: 'cant_tiros_cereo', label: 'Tiros Cereo' },
      { key: 'cant_tiros_leccion', label: 'Tiros Lección' },
      { key: 'distancia', label: 'Distancia (m)' }
    ];
  }

  if (leccionSeleccionadaDetalles.value) {
    return [
      { key: 'RUT', label: 'RUT' },
      { key: 'Grado', label: 'Grado' },
      { key: 'Apellido_paterno', label: 'Apellido Paterno' },
      { key: 'Apellido_materno', label: 'Apellido Materno' },
      { key: 'Nombre', label: 'Nombre' },
      { key: 'Unidad Regimentaria', label: 'Unidad Regimentaria' },
      { key: 'Unidad de Combate', label: 'Unidad de Combate' },
      { key: 'Unidad Fundamental', label: 'Unidad Fundamental' },
      { key: 'Tipo Arma', label: 'Tipo de Arma' },
      { key: 'Modelo de Arma', label: 'Modelo de Arma' },
      { key: 'Número de Serie', label: 'Número de Serie' },
      { key: 'Carril', label: 'Carril' },
      { key: 'Tiros Acertados', label: 'Tiros Acertados' },
      { key: 'Total Tiros', label: 'Total Tiros' }
    ];
  }

  switch(tipoSeleccionado.value) {
    case 'poligonos':
      return [
        { key: 'nombre', label: 'Nombre' },
        { key: 'ciudad', label: 'Ciudad' },
        { key: 'carriles_maximos', label: 'Carriles Máximos' },
        { key: 'distancia_maxima', label: 'Distancia Máxima' }
      ];
    case 'lecciones':
      return [
        { key: 'fecha_tiro', label: 'Fecha de Tiro' },
        { key: 'numero_orden', label: 'Número de Orden' },
        { key: 'fecha_orden', label: 'Fecha de Orden' },
        { key: 'tipo_tiro', label: 'Tipo de Tiro' },
        { key: 'cant_tiros_cereo', label: 'Tiros Cereo' },
        { key: 'cant_tiros_leccion', label: 'Tiros Lección' },
        { key: 'distancia', label: 'Distancia (m)' },
        { key: 'poligono_nombre', label: 'Polígono' }
      ];
    case 'armas':
      return [
        { key: 'tipo_arma', label: 'Tipo de Arma' },
        { key: 'modelo_arma', label: 'Modelo' },
        { key: 'numero_serie', label: 'Número de Serie' }
      ];
    case 'tiradores':
      return [
        { key: 'rut', label: 'RUT' },
        { key: 'grado', label: 'Grado' },
        { key: 'apellido_paterno', label: 'Apellido Paterno' },
        { key: 'apellido_materno', label: 'Apellido Materno' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha_leccion', label: 'Fecha Lección' },
        { key: 'tiros_acertados', label: 'Tiros Acertados' },
        { key: 'tiros_leccion', label: 'Tiros Lección' }
      ];
    default:
      return [];
  }
});

const getTipoTablaActual = () => {
  if (poligonoSeleccionado.value) return 'lecciones';
  return tipoSeleccionado.value || '';
};

const filtrarDatos = () => {
  if (!searchQuery.value) {
    datosFiltrados.value = datos.value;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  datosFiltrados.value = datos.value.filter(item => {
    return columnas.value.some(column => {
      const valor = item[column.key];
      if (valor === null || valor === undefined) return false;
      
      // Convertir el valor a string y buscar
      return String(valor).toLowerCase().includes(query);
    });
  });

  mensajeNoData.value = datosFiltrados.value.length === 0 ? 'No se encontraron resultados para la búsqueda' : '';
};

const cargarLecciones = async () => {
  try {
    const response = await axios.get('lecciones/');
    lecciones.value = response.data;
  } catch (error) {
    console.error('Error al cargar lecciones:', error);
  }
};

const cargarDatos = async () => {
  if (!tipoSeleccionado.value) {
    datos.value = [];
    datosFiltrados.value = [];
    mensajeNoData.value = 'Seleccione un tipo de búsqueda';
    return;
  }

  try {
    switch(tipoSeleccionado.value) {
      case 'poligonos':
        const poligonos = await store.dispatch('fetchPoligonos');
        datos.value = poligonos;
        break;
      case 'lecciones':
        const lecciones = await store.dispatch('fetchLecciones');
        const poligonosData = await store.dispatch('fetchPoligonos');
        const poligonosMap = {};
        poligonosData.forEach(poligono => {
          poligonosMap[poligono.id_poligono] = poligono.nombre;
        });
        datos.value = lecciones.map(leccion => ({
          ...leccion,
          poligono_nombre: poligonosMap[leccion.id_poligono] || 'No asignado'
        }));
        break;
      case 'armas':
        const armas = await store.dispatch('fetchArmas');
        datos.value = armas;
        tiposArma.value = obtenerTiposArma(armas);
        break;
      case 'tiradores':
        const resultados = await store.dispatch('fetchResultados');
        datos.value = resultados.map(resultado => ({
          resultado_id: resultado.id_resultado,
          id_usuario: resultado.id_usuario,
          rut: resultado.RUT,
          grado: resultado.Grado,
          apellido_paterno: resultado.Apellido_paterno,
          apellido_materno: resultado.Apellido_materno,
          nombre: resultado.Nombre,
          fecha_leccion: resultado.fecha_tiro,
          tiros_acertados: resultado.Tiros_Acertados,
          tiros_leccion: resultado.Total_Tiros
        }));
        break;
    }
    datosFiltrados.value = datos.value;
    mensajeNoData.value = datos.value.length === 0 ? 'No se encontraron resultados' : '';
    searchQuery.value = '';
  } catch (error) {
    console.error('Error al cargar datos:', error);
    mensajeNoData.value = 'Error al cargar los datos';
    datos.value = [];
    datosFiltrados.value = [];
  }
};

const handleRowClick = async (row) => {
  if (tipoSeleccionado.value === 'tiradores') {
    if (!tiradorSeleccionado.value) {
      tiradorSeleccionado.value = row;
      try {
        // Obtener todos los resultados del tirador
        const response = await axios.get(`usuarios/${row.id_usuario}/resultados/`);
        datos.value = response.data.map(resultado => ({
          fecha_tiro: resultado.fecha_tiro,
          nombre_leccion: resultado.nombre_leccion,
          tipo_tiro: resultado.tipo_tiro,
          tipo_arma: resultado.tipo_arma,
          modelo_arma: resultado.modelo_arma,
          numero_serie: resultado.numero_serie,
          numero_carril: resultado.numero_carril,
          tiros_acertados: resultado.tiros_acertados,
          total_tiros: resultado.total_tiros
        }));
        datosFiltrados.value = datos.value;
      } catch (error) {
        console.error('Error al cargar resultados del tirador:', error);
        mensajeNoData.value = 'Error al cargar los resultados';
      }
    }
  } else if (tipoSeleccionado.value === 'poligonos' && !poligonoSeleccionado.value) {
    poligonoSeleccionado.value = row;
    await cargarLeccionesPoligono(row.id_poligono);
  } else if (poligonoSeleccionado.value && !leccionSeleccionadaDetalles.value) {
    leccionSeleccionadaDetalles.value = row;
    await cargarTiradoresLeccion(row.id_leccion);
  } else {
    console.log('Fila seleccionada:', row);
  }
};

// Nueva función para filtrar armas
const filtrarArmas = () => {
  if (!datos.value.length) return;

  datosFiltrados.value = datos.value.filter(arma => {
    const cumpleTipoArma = !tipoArmaSeleccionado.value || 
                          arma.tipo_arma === tipoArmaSeleccionado.value;
    const cumpleNumeroSerie = !numeroSerieFilter.value || 
                             arma.numero_serie.toLowerCase().includes(numeroSerieFilter.value.toLowerCase());
    return cumpleTipoArma && cumpleNumeroSerie;
  });

  mensajeNoData.value = datosFiltrados.value.length === 0 ? 'No se encontraron armas con los filtros seleccionados' : '';
};

// Función para obtener tipos únicos de arma
const obtenerTiposArma = (armas) => {
  const tipos = new Set(armas.map(arma => arma.tipo_arma));
  return Array.from(tipos);
};

const volverALecciones = () => {
  leccionSeleccionadaDetalles.value = null;
  cargarLeccionesPoligono(poligonoSeleccionado.value.id_poligono);
};

const cargarTiradoresLeccion = async (idLeccion) => {
  try {
    const resultados = await store.dispatch('fetchResultadosLeccion', idLeccion);
    datos.value = resultados;
    datosFiltrados.value = datos.value;
    mensajeNoData.value = datos.value.length === 0 ? 'No hay tiradores en esta lección' : '';
  } catch (error) {
    console.error('Error al cargar tiradores de la lección:', error);
    mensajeNoData.value = 'Error al cargar los tiradores';
    datos.value = [];
    datosFiltrados.value = [];
  }
};

// Agregar variable para el tirador seleccionado
const tiradorSeleccionado = ref(null);

// Agregar función para volver a la lista de tiradores
const volverATiradores = () => {
  tiradorSeleccionado.value = null;
  cargarDatos();
};

const cargarLeccionesPoligono = async (idPoligono) => {
  try {
    const lecciones = await store.dispatch('fetchLeccionesPoligono', idPoligono);
    datos.value = lecciones.map(leccion => ({
      ...leccion,
      poligono_nombre: poligonoSeleccionado.value.nombre
    }));
    datosFiltrados.value = datos.value;
    mensajeNoData.value = datos.value.length === 0 ? 'No hay lecciones en este polígono' : '';
    searchQuery.value = '';
  } catch (error) {
    console.error('Error al cargar lecciones del polígono:', error);
    mensajeNoData.value = 'Error al cargar las lecciones';
    datos.value = [];
    datosFiltrados.value = [];
  }
};

const volverAPoligonos = () => {
  poligonoSeleccionado.value = null;
  cargarDatos();
};
    </script>
    
    <style scoped>
.buscar-container {
  padding: 20px;
}

     h1 {
        font-size: 2rem;
  margin-bottom: 2rem;
  color: aliceblue;
}

h2 {
  font-size: 1.5rem;
        margin-bottom: 1rem;
        color: aliceblue;
      }

.search-controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-select, .leccion-select select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 1rem;
  min-width: 200px;
}

.no-data {
        color: aliceblue;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
}

.poligono-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.volver-btn {
  padding: 8px 16px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.volver-btn:hover {
  background-color: #2d3748;
}

.search-filter {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: #4a5568;
  box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.2);
}

.armas-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.armas-filters .search-input {
  min-width: 200px;
}

.leccion-detalles {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.leccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.leccion-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-weight: bold;
  color: #a0aec0;
  font-size: 0.875rem;
}

.info-item span:not(.label) {
  color: white;
  font-size: 1rem;
      }

.tirador-detalles {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.tirador-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tirador-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-weight: bold;
  color: #a0aec0;
  font-size: 0.875rem;
}

.info-item span:not(.label) {
  color: white;
  font-size: 1rem;
}

.volver-btn {
  padding: 8px 16px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.volver-btn:hover {
  background-color: #2d3748;
      }
    </style>