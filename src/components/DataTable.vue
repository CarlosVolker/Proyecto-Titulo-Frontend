<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]" @row-click="mensajeConsola">
          <td v-for="column in columns" :key="column.key">
            <!-- Editable cells -->
            <template v-if="column.editable && isEditing[row[rowKey] + column.key]">
              <input
                v-model="row[column.key]"
                @blur="cancelEdit(row, column.key)"
                @keydown.enter="saveEdit(row, column.key)"
                @keydown.esc="cancelEdit(row, column.key)"
                :placeholder="'Edit ' + column.label"
                class="editable-input"
                type="number"
                autofocus
              />
            </template>
            <!-- Non-editable cells -->
            <template v-else>
              <span @click="startEditing(row, column.key)">
                {{ row[column.key] }}
              </span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/axios';

// Recibir las propiedades del componente
const { rowKey = 'id', rows } = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Array,
    required: true
  },
  rowKey: {
    type: String,
    default: 'id' // Definir valor predeterminado para rowKey
  }
});

const emit = defineEmits();
const isEditing = ref({});  // Mantener el estado de edición de cada celda

// Función para iniciar la edición de una celda
const startEditing = (row, columnKey) => {
  // Sólo activar la edición para la celda específica
  isEditing.value[`${row[rowKey]}${columnKey}`] = true;
  emit('cell-click', row, columnKey);  // Emitir el clic de la celda
};

// Función para guardar la edición
const saveEdit = async (row, columnKey) => {
  console.log('Editando sobre ID: ', row.id_leccion);
  console.log('columnKey:', columnKey);
  console.log('row:', row);
  console.log('row[columnKey]:', row[columnKey]);
  
  const id_edit = row.id_leccion; //obtiene ID de la fila
  console.log('id_edit:', id_edit);
  const daata = {
    [columnKey]: row[columnKey]
  }
  console.log('data:', daata);
  try {
    const response = await axios.patch(`lecciones/${row.id_leccion}/`, daata);
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al guardar la edición:', error);
  }
  console.log('Edición Cerrada', row);
  // Aquí podrías hacer algo con la edición, como actualizar el servidor.
  delete isEditing.value[`${row[rowKey]}${columnKey}`];  // Devolver la celda a no editable
};

const cancelEdit = (row, columnKey) => {
  console.log('Edición Cancelada');
  delete isEditing.value[`${row[rowKey]}${columnKey}`];  // Devolver la celda a no editable
}


</script>



<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ccc;
}

th, td {
  border: 1px solid #1d1c1c;
  padding: 8px;
  text-align: left;
}

.editable-input {
  width: 50%;
  padding: 5px;
  box-sizing: border-box;
}

span {
  cursor: pointer;
  color: #050505;
}



</style>