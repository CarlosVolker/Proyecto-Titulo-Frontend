<template>
  <div>
    <button @click="editarTerminar" :disabled="rowsArray.length === 0">
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
        <tr v-for="row in rowsArray" :key="row[rowKey]" @click="handleRowClick(row)">
          <td v-for="column in columns" :key="column.key" @click="handleCellClick($event, row, column)">
            <!-- Editable cells -->
            <template v-if="column.editable && isEditing[row[rowKey] + column.key]">
              <input
                v-model="row[column.key]"
                :type="getInputType(column)"
                @keydown.enter="saveEdit(row, column.key, 'guardar')"
                @keydown.tab="saveEdit(row, column.key, 'guardar')"
                @keydown.esc="cancelEdit(row, column.key, 'cancelar')"
                @input="validarInput(row, column.key)"
                :placeholder="'Edit ' + column.label"
                class="editable-input"
              />
            </template>
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
import { ref, computed, defineProps, defineEmits } from 'vue';
import axios from '@/axios';

// Recibir las propiedades del componente
const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  rows: {
    type: [Array, Object],
    required: true
  },
  rowKey: {
    type: String,
    default: 'id' // Definir valor predeterminado para rowKey
  }
});

const emit = defineEmits();
const isEditing = ref({});  // Mantener el estado de edición de cada celda

const rowsArray = computed(() => {
  return Array.isArray(props.rows) ? props.rows : [props.rows];
});

const isEditMode = ref(false);

const editarTerminar = () => {
  isEditMode.value = !isEditMode.value;
  if (isEditMode.value) {
    rowsArray.value.forEach(row => {
      props.columns.forEach(column => {
        if (column.editable) {
          isEditing.value[`${row[props.rowKey]}${column.key}`] = true;
        }
      });
    });
  } else {
    rowsArray.value.forEach(row => {
      props.columns.forEach(column => {
        if (column.editable) {
          delete isEditing.value[`${row[props.rowKey]}${column.key}`];
        }
      });
    });
  }
};

const handleRowClick = (row) => {
  if (Object.keys(isEditing.value).length > 0) return;

  // Si no estamos en modo edicion, cambiar a la siguiente vista
  emit('row-click', row);
};

const handleCellClick = (event, row, column) => {
  if (column.editable && isEditMode.value[`${row[props.rowKey]}${column.key}`]) {
    event.stopPropagation();
  }
};

const getInputType = (column) => {
  if (column.type === 'number') {
    return 'number';
  } else if (column.type === 'date') {
    return 'date';
  } else {
  return 'text';
  }
};

const validarInput = (row, columnKey) => {
  if (row[columnKey] === '' || row[columnKey] < 0) {
    row[columnKey] = 0;
  }
};


// Función para guardar la edición
const saveEdit = async (row, columnKey, accion) => {
  if (accion === 'guardar') {
    console.log('Editando sobre ID: ', row.resultado_id);
    const column = props.columns.find(col => col.key === columnKey);
    if (!column || !column.editable) return;
    const endpoint = column.endpoint;
    const idKey = endpoint === 'lecciones' ? 'id_leccion' : 'resultado_id';
    const idValue = row[idKey];

    const data = {
      [columnKey]: row[columnKey]
    }
    console.log('data:', data);
    try {
      const url = `${endpoint}/${idValue}/`;
      console.log('URL:', url);
      const response = await axios.patch(url, data);
      console.log('Datos Guardados', response.data);
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