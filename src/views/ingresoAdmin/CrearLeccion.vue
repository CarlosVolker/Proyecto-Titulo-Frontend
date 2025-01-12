<template>
  <div>
    <h1>Gestión de Lecciones de Tiro</h1>

    <template v-if="tablaActual === 'lecciones'">
      <div class="poligono-container">
        <h3>Polígono detalle:</h3>
        <label for="poligono-select">Seleccionar un Polígono</label>
        <select id="poligono-select" v-model="poligonoSeleccionado" @change="cargarLecciones">
          <option v-for="poligono in poligonos" :key="poligono.id_poligono" :value="poligono.id_poligono">
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
        <template v-if="modalType === 'poligono'">
          <form @submit.prevent="crearPoligono">
            <input type="text" id="nombre" v-model="nuevoPoligono.nombre" placeholder="Nombre Polígono" required>
            <input type="text" id="ciudad" v-model="nuevoPoligono.ciudad" placeholder="Ciudad" required>
            <input type="number" id="carriles-maximos" v-model="nuevoPoligono.carriles_maximos" placeholder="Carriles Máximos" required>
            <input type="number" id="distancia-maxima" v-model="nuevoPoligono.distancia_maxima" placeholder="Distancia Máxima">
            <button type="submit">Guardar</button>
          </form>
        </template>

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
        <button @click="abrirModal('leccion')">Agregar Lección</button>
        <DataTable 
        :columns="columnasLecciones" 
        :rows="lecciones" 
        rowKey="id_leccion"
        @row-click="cargarFracciones"
        />

      </div>
    </template>

    <template v-else-if="tablaActual === 'fracciones'">
      <h2>Fracciones de Tiro</h2>
      <button @click="volverALecciones">Volver</button>
      <DataTable
      :columns="columnasFracciones"
      :rows="fracciones"
      rowKey="id_fraccion"
      @row-click="cargarTiradores"
      >
      </DataTable>
    </template>

    <template v-else-if="tablaActual === 'tiradores'">
      <h2>Fracciones de Tiro</h2>
      <button @click="volverAFracciones">Volver</button>
      <DataTable
      :columns="columnasTiradores"
      :rows="tiradores"
      rowKey="id_resultado"
      
      >
      </DataTable>
    </template>
    
 </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import { useStore } from 'vuex';

const store = useStore();


//Configuración formulario para Modal
const modalVisible = ref(false);
const modalType = ref ('');
const modalTitle = ref ('');
const poligonoSeleccionado = ref(null);

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

// Estado de tablas
const poligonos = computed(() => store.state.poligonos);
const lecciones = computed(() => store.state.lecciones);
const fracciones = computed(() => store.state.fracciones);
const tiradores = computed(() => store.state.tiradores);

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



const abrirModal = (tipo) => {
  modalType.value = tipo;
  modalTitle.value = tipo == 'leccion' ? 'Agregar Nueva Lección' : 'Agregar Nuevo Polígono';
  modalVisible.value = true;
}

const cerrarModal = () => {
  modalVisible.value = false;
}

// Crear nuevo polígono
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


const tablaActual =ref('lecciones');

const volverALecciones = () => {
  tablaActual.value = 'lecciones';
};
const volverAFracciones = () => {
  tablaActual.value = 'fracciones';
};

// Cargar polígonos y lecciones al montar
onMounted(() => {
  store.dispatch('fetchPoligonos');
  //cargarLecciones();   // Cargar las lecciones
});

// Función para cargar las lecciones basadas en el polígono seleccionado
const cargarLecciones = async () => {
  if (poligonoSeleccionado.value) {
    const lecciones = await store.dispatch('fetchLecciones', poligonoSeleccionado.value);
    //await store.dispatch('fetchLecciones', poligonoSeleccionado.value);
/*     if (!Array.isArray(lecciones)) {
      console.error('Las lecciones no son un array:', lecciones);
      return;
    } */
  }

};

// Cargar fracciones al hacer clic en una lección
const cargarFracciones = (leccion) => {
  store.dispatch('fetchFracciones', leccion.id_leccion);
  tablaActual.value = 'fracciones';
}

// Cargar tiradores al hacer clic en una fracción
const cargarTiradores = (fraccion) => {
  store.dispatch('fetchTiradores', fraccion.id_fraccion);
  tablaActual.value = 'tiradores';
};

// Cargar polígonos
const poligonoActual = computed(() => {
  return poligonos.value.find(poligono => poligono.id_poligono === poligonoSeleccionado.value);

});

// Mostrar la tabla de fracciones y ocultar la de lecciones
/* const mostrarFracciones = async (leccion) => {
  console.log('Lección Seleccionada:', leccion.id_leccion);
  tablaActual.value = true;  // Mostrar la tabla de fracciones
  await cargarFracciones(leccion);
}; */


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
h3 {
  color: aliceblue;
}

p {
  text-align: center;
  font-size: 1.2rem;
  color: aliceblue;
}
.poligono-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>