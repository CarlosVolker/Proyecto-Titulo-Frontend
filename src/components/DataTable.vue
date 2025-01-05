<template>
  <div>
    <button @click="editarTerminar" :disabled="rows.length === 0">
      {{ isEditMode ? 'Terminar' : 'Editar' }}
    </button>
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
                @keydown.enter="saveEdit(row, column.key, 'guardar')"
                @keydown.tab="saveEdit(row, column.key, 'guardar')"
                @keydown.esc="cancelEdit(row, column.key, 'cancelar')"
                @input="validarInput(row, column.key)"
                :placeholder="'Edit ' + column.label"
                class="editable-input"
                type="number"
              />
            </template>
            <!-- Non-editable cells -->
            <template v-else>
              <span >
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
import { ref, defineProps, defineEmits } from 'vue';
import axios from '@/axios';

// Recibir las propiedades del componente
const { columns, rowKey = 'id', rows } = defineProps({
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

const validarInput = (row, columnKey) => {
  if (row[columnKey] === '' || row[columnKey] < 0) {
    row[columnKey] = 0;
  }
};

const isEditMode = ref(false);

const editarTerminar = () => {
  isEditMode.value = !isEditMode.value;
  if (isEditMode.value) {
    rows.forEach(row => {
      columns.forEach(column => {
        if (column.editable) {
          isEditing.value[`${row[rowKey]}${column.key}`] = true;
        }
      });
    });
  } else {
    rows.forEach(row => {
      columns.forEach(column => {
        if (column.editable) {
          delete isEditing.value[`${row[rowKey]}${column.key}`];
        }
      });
    });
  }
  //isEditMode.value = !isEditMode.value;
};

// Función para guardar la edición
const saveEdit = async (row, columnKey, accion) => {
  if (accion === 'guardar') {
/*     console.log('Editando sobre ID: ', row.id_leccion);
    console.log('columnKey:', columnKey);
    console.log('row:', row);
    console.log('row[columnKey]:', row[columnKey]);
    
    const id_edit = row.id_leccion; //obtiene ID de la fila
    console.log('id_edit:', id_edit); */
    const daata = {
      [columnKey]: row[columnKey]
    }
    //console.log('data:', daata);
    try {
      const response = await axios.patch(`lecciones/${row.id_leccion}/`, daata);
      console.log('Datos Guardados', response.data.distancia);
    } catch (error) {
      console.error('Error al guardar la edición:', error);
    }
    console.log('Edición Cerrada');
  } 
};

const cancelEdit = (row, columnKey) => {
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