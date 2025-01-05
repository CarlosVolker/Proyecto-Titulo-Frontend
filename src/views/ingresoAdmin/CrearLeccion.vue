<template>
  <div>
    <h1>Gestión de Lecciones de Tiro</h1>

    <div>
      <label for="poligono-select">Seleccionar un Polígono</label>
      <select id="poligono-select" v-model="poligonoSeleccionado" @change="cargarLecciones">
        <option v-for="poligono in poligonos" :key="poligono.id_poligono" :value="poligono.id_poligono">
          {{ poligono.nombre }}
        </option>
      </select>
    </div>

    <h2>Lecciones de Tiro</h2>
    <DataTable 
    :columns="columnasLecciones" 
    :rows="lecciones" 
    rowKey="id_lecciones"
    @row-click="mensajeConsola"
    />
    
 </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import DataTable from '@/components/DataTable.vue';


// Datos de la tabla
const lecciones = ref([]);
const fracciones = ref([]);
const tiradores = ref([]);
const poligonos = ref([]);
const poligonoSeleccionado = ref(null);

// Configuración de columnas
const columnasLecciones = ref( [
  { key: 'fecha_tiro', label: 'Fecha de Tiro' },
  { key: 'tipo_tiro', label: 'Tipo de Tiro'},
  { key: 'distancia', label: 'Distancia (m)', editable: true },
  { key: 'fecha_orden', label: 'Fecha de Orden' },
  { key: 'numero_orden', label: 'N.° de Orden' }
]);
const leccioness = ref([
  { fecha_tiro: '2025-01-01', tipo_tiro: 'Práctica', distancia: 300, fecha_orden: '2024-12-30', numero_orden: 12345 },
  { fecha_tiro: '2025-01-02', tipo_tiro: 'Competencia', distancia: 500, fecha_orden: '2024-12-31', numero_orden: 12346 }
])

const columnasFracciones = [
  { key: 'id_fraccion', label: 'N.° de Fracción' },
  { key: 'tiradores_totales', label: 'Total de Tiradores' }
];

const columnasTiradores = [
  { key: 'numero_carril', label: 'Carril' },
  { key: 'grado', label: 'Grado' },
  { key: 'apellido_paterno', label: 'Ap. Paterno' },
  { key: 'apellido_materno', label: 'Ap. Materno' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'uniCombate', label: 'Unidad Combate' },
  { key: 'uniFundamental', label: 'Unidad Fundamental' },
  { key: 'modeloArma', label: 'Modelo Arma' },
  { key: 'serieArma', label: 'N.° Serie' },
  { key: 'resultado', label: 'Aciertos' }
];



// Cargar polígonos y lecciones al montar
onMounted(() => {
  cargarPoligonos();   // Cargar los polígonos
});

// Función para cargar las lecciones basadas en el polígono seleccionado
const cargarLecciones = async () => {
  console.log('Polígono Seleccionado:', poligonoSeleccionado.value);
  if (poligonoSeleccionado.value) {
    try {
      const response = await axios.get(`poligonos/${poligonoSeleccionado.value}/lecciones`);
      lecciones.value = response.data || [];
    } catch (error) {
      console.error('Error cargando lecciones', error);
    }
  }
};

// Cargar fracciones al hacer clic en una lección
async function cargarFracciones(leccion) {
  console.log('Lección Seleccionada:', leccion.id_leccion);
  try {
    console.log('Cargando fracciones...');
    const response = await axios.get(`lecciones/${leccion.id_leccion}/fracciones`);
    console.log('Fracciones cargadas:', response.data);
    fracciones.value = response.data || [];
    tiradores.value = [];  // Limpiar tiradores al navegar hacia arriba
  } catch (error) {
    console.error('Error cargando fracciones', error);
  }
}

// Cargar tiradores al hacer clic en una fracción
async function cargarTiradores(fraccion) {
  console.log('Fracción Seleccionada:', fraccion.id_fraccion);
  try {
    console.log('Cargando tiradores...');
    const response = await axios.get(`fracciones/${fraccion.id_fraccion}/resultados`);
    console.log('Respuesta Completa:', response.data);
    tiradores.value = response.data.map(item => ({
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
      resultado: item.resultado.tiros_acertados
    }));
    console.log('Tiradores cargados:', tiradores.value);
    const dataaa = JSON.parse(JSON.stringify(response.data));
    console.log('Data:', dataaa);
  } catch (error) {
    console.error('Error cargando tiradores', error);
  }
}

// Cargar polígonos
const cargarPoligonos = async () => {
  try {
    const response = await axios.get('poligonos/');
    poligonos.value = response.data;
  } catch (error) {
    console.error('Error cargando polígonos', error);
  }
};

// Mostrar la tabla de fracciones y ocultar la de lecciones
const mostrarFracciones = (leccion) => {
  console.log('Lección Seleccionada:', leccion.id_leccion);
  tablaVisible.value = true;  // Mostrar la tabla de fracciones
  cargarFracciones(leccion);
};

const mensajeConsola = (row) => {
  console.log('Fila cliqueada:', row.id_leccion);
};

const clicEditarCelda = (row, columnKey) => {
  console.log(`Celda seleccionada: fila `, row, columnKey);

};


</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

button {
  padding: 0.5rem;
  cursor: pointer;
}

label {
  color: aliceblue;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: aliceblue;
}

h2 {
  text-align: center;
  color: aliceblue;
}

p {
  text-align: center;
  font-size: 1.2rem;
  color: aliceblue;
}
</style>