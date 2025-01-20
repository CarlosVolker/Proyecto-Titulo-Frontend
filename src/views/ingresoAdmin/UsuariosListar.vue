<template>
    <div>
        <h1>USUARIOS</h1>
        <p>Esta es la página de Usuarios.</p>
        <div>
            <Modal
            :visible="modalVisible"
            :title="modalTitle"
            @close="cerrarModal">
            <template v-if="usuarios">
              <form @submit.prevent="guardarCambios" class="form-modal">
                <div class="form-header">
                  <button type="button" @click="habilitarEdicion">
                    {{ editable ? 'Cancelar Edición' : 'Editar' }}
                  </button>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label class="label-modal">RUT</label>
                    <input type="text" id="rut" v-model="usuarioSeleccionado.rut" placeholder="RUT" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Grado</label>
                    <input type="text" id="grado" v-model="usuarioSeleccionado.grado" placeholder="Grado" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Apellido Paterno</label>
                    <input type="text" id="apellido_paterno" v-model="usuarioSeleccionado.apellido_paterno" placeholder="Apellido paterno" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Apellido Materno</label>
                    <input type="text" id="apellido_materno" v-model="usuarioSeleccionado.apellido_materno" placeholder="Apellido materno" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Nombre</label>
                    <input type="text" id="nombre" v-model="usuarioSeleccionado.nombre" placeholder="Nombre" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Correo Electrónico</label>
                    <input type="text" id="correo" v-model="usuarioSeleccionado.correo" placeholder="Correo" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Rol</label>
                    <input type="text" id="rol" v-model="usuarioSeleccionado.rol" placeholder="Rol" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Unidad Regimentaria</label>
                    <input type="text" id="unidad-regimentaria" v-model="usuarioSeleccionado.unidad_regimentaria" placeholder="Unidad Regimentaria" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Unidad de Combate</label>
                    <input type="text" id="unidad-combate" v-model="usuarioSeleccionado.unidad_combate" placeholder="Unidad Combate" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Unidad Fundamental</label>
                    <input type="text" id="unidad-fundamental" v-model="usuarioSeleccionado.unidad_fundamental" placeholder="Unidad Fundamental" :disabled="!editable" />
                  </div>

                  <div class="form-group">
                    <label class="label-modal">Habilitado para Iniciar Sesión</label>
                    <select
                    v-model="usuarioSeleccionado.habilitado"
                    :disabled="!editable"
                    @change="actualizarEstadoHabilitado"
                    >
                    <option :value="true">Sí</option>
                    <option :value="false">No</option>
                    </select>
                    <!--<input type="text" id="habilitado" v-model="usuarioSeleccionado.habilitado" placeholder="Habilitado" :disabled="!editable" />-->
                  </div>
                  <div class="form-group" v-if="usuarioSeleccionado.habilitado">
                    <button 
                    type="button" 
                    class="action-button" 
                    @click="abrirModalPassword"
                    >
                    {{ usuarioSeleccionado.habilitado ? 'Cambiar Contraseña' : 'Crear Contraseña' }}
                  </button>
                  </div>
                </div>

                <div class="form-footer">
                  <button type="submit" class="save-button">Guardar</button>
                </div>
              </form>
            </template>
            </Modal>

            <!--Modal Cambio o creacion de contraseña -->
            <Modal :visible="modalPasswordVisible" :title="'Contraseña'" @close="cerrarModalPassword">
              <form @submit.prevent="guardarPassword" class="form-modal">
                <div class="form-group">
                  <label class="label-modal">Nueva Contraseña</label>
                  <input 
                  type="password" 
                  v-model="password.nueva" 
                  placeholder="Nueva Contraseña" 
                  required 
                  />
                </div>
                <div class="form-group">
                  <label class="label-modal">Confirmar Contraseña</label>
                  <input 
                  type="password" 
                  v-model="password.confirmar" 
                  placeholder="Confirmar Contraseña" 
                  required 
                  />
                </div>
                <div class="form-footer">
                  <button type="submit" class="save-button">Guardar</button>
                </div>
              </form>
            </Modal>


        <DataTable 
        v-if="usuarios.length > 0"
        :columns="columnasUsuarios" 
        :rows="usuarios" 
        rowKey="id_usuarios"
        :showEditButton="false"
        @row-click="editarUsuariosModal"
        />
        

      </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DataTable from '@/components/DataTable.vue';
import { useStore } from 'vuex';
import Modal from '@/components/Modal.vue';

const store = useStore();

// Controlador de si los campos del modal son o no editables

//Configuiración Formulario para Modal
const modalVisible = ref(false);
const modalPasswordVisible = ref(false); // Segundo modal
const modalTitle = ref('');
const usuarios = ref([]);
const usuarioSeleccionado = ref(null);
const password = ref({nueva: '', confirmar: ''});//Campos del 2do modal
const editable = ref(false);



const columnasUsuarios =ref ([
    { key: 'rut', label: 'RUT' },
    { key: 'grado', label: 'Grado' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido_paterno', label: 'Apellido paterno' },
    { key: 'apellido_materno', label: 'Apellido materno' },
    //{ key: 'correo', label: 'Correo' },
    { key: 'rol', label: 'Rol' },
    { key: 'habilitado', label: 'Habilitado' }
]);


onMounted(() => {
    cargarUsuarios();
    console.log(usuarios.value);
});

const cargarUsuarios = async () => {
    await store.dispatch('fetchUsuarios');
    console.log('datos: ',store.state.usuarios);
    usuarios.value = store.state.usuarios. map(usuario => {
        return {
            ...usuario,
            habilitado: usuario.habilitado ? 'true' : 'false'
        }
    });
};

const editarUsuariosModal = (row) => {
  modalTitle.value = 'Editar Usuario';
  usuarioSeleccionado.value = {...row};
  editable.value = false;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  usuarioSeleccionado.value = null;
  editable.value = false;
};


const habilitarEdicion = () => {
  editable.value = !editable.value;
};

const actualizarEstadoHabilitado = () => {
  if (usuarioSeleccionado.value.habilitado === 'false') {
    password.value = {nueva: '', confirmar: ''};
  }
};

const abrirModalPassword = () => {
  modalPasswordVisible.value = true;
};

const cerrarModalPassword = () => {
  modalPasswordVisible.value = false;
};

const guardarPassword = () => {
  if (password.value.nueva !== password.value.confirmar) {
    alert('Las contraseñas no coinciden');
    return;
  }
  console.log('Contraseña Guardada:', password.value.nueva);
  cerrarModalPassword();
}

const guardarCambios = () => {
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log('Guardar cambios para', usuarioSeleccionado.value);
    cerrarModal();
};
</script>

<style scoped>
.form-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.form-header {
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columnas por defecto */
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label-modal {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.save-button {
  padding: 0.7rem 1rem;
  border: none;
  background: radial-gradient(#5d5d5d, #969696);
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  transition: background var(--transition-time) ease;
  cursor: pointer;
}

.action-button {
  padding: 0.7rem 1rem;
  background: radial-gradient(#424877, #7483a7);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background var(--transition-time) ease;
  font-size: 1rem;
}

.action-button:hover {
  background: #a3b3f2;
}

.save-button:hover {
  background: #90a08e;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr; /* Cambiar a 1 columna en pantallas pequeñas */
  }
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

</style>