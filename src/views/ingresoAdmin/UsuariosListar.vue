<template>
    <div>
        <h1>USUARIOS</h1>
        <p>Esta es la página de Usuarios.</p>

        <!-- Input de busqueda-->
        <input 
        type="text" 
        v-model="busquedaEnLista" 
        placeholder="Buscar en la lista"
        class="input-busqueda" 
        />

        <div>
          <button type="button" @click="crearUsuarioModal" class="save-button">Crear Usuario</button>
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
                    <input type="text" id="rut" v-model="usuarioSeleccionado.rut" placeholder="RUT" :disabled="!editable" required />
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
                  <button type="button" @click="eliminarUsuario" class="save-button">Eliminar</button>
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

            <!-- v-if="usuarios.length > 0" -->
        <DataTable
        v-if="filtrarUsuarios.length > 0"
        :columns="columnasUsuarios" 
        :rows="filtrarUsuarios" 
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


//Configuiración Formulario para Modal
const modalVisible = ref(false);
const modalPasswordVisible = ref(false); // Segundo modal
const modalTitle = ref('');
const usuarios = ref([]);
const usuarioSeleccionado = ref(null);
const password = ref({nueva: '', confirmar: ''});//Campos del 2do modal
const editable = ref(false);
const busquedaEnLista = ref(''); // Input de busqueda

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
});

const cargarUsuarios = async () => {
    await store.dispatch('fetchUsuarios');
    const idUsuarioActual = localStorage.getItem('id_usuario');
    usuarios.value = store.state.usuarios
    .filter(usuario => {
      // Filtramos el usuario actual para que no aparezca en la tabla
      return usuario.id_usuario.toString() !== idUsuarioActual.toString();
    })
    .map(usuario => {
        return {
            ...usuario,
            habilitado: usuario.habilitado ? 'true' : 'false'
        }
    });
};

const filtrarUsuarios = computed(() => {
  const consulta = busquedaEnLista.value.toLowerCase();
  return usuarios.value.filter(usuario => {
    return (
      usuario.rut.includes(consulta) ||
      usuario.grado.toLowerCase().includes(consulta) ||
      usuario.nombre.toLowerCase().includes(consulta) ||
      usuario.apellido_paterno.toLowerCase().includes(consulta) ||
      usuario.apellido_materno.toLowerCase().includes(consulta) ||
      usuario.correo.toLowerCase().includes(consulta) ||
      usuario.rol.toLowerCase().includes(consulta) ||
      usuario.unidad_regimentaria.toLowerCase().includes(consulta) ||
      usuario.unidad_combate.toLowerCase().includes(consulta) ||
      usuario.unidad_fundamental.toLowerCase().includes(consulta)
    );
  });
});

const crearUsuarioModal = (row)=> {
  modalTitle.value = 'Crear Usuario';
  usuarioSeleccionado.value = {
    rut: '',
    grado: '',
    apellido_paterno: '',
    apellido_materno: '',
    nombre: '',
    correo: '',
    rol: '',
    unidad_regimentaria: '',
    unidad_combate: '',
    unidad_fundamental: '',
    habilitado: 'true'
  };
  editable.value = true;
  modalVisible.value = true;

}

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
  if (!usuarioSeleccionado.value || !usuarioSeleccionado.value.id_usuario) {
    alert('Selecciona un usuario váñido antes de cambiar la contraseña');
    return;
  }
  modalPasswordVisible.value = true;
};

const cerrarModalPassword = () => {
  modalPasswordVisible.value = false;
};

const guardarPassword = async () => {
  if (password.value.nueva !== password.value.confirmar) {
    alert('Las contraseñas no coinciden');
    return;
  }
  try {
    if (!usuarioSeleccionado.value || !usuarioSeleccionado.value.id_usuario) {
      alert('No se ha seleccionado un usuario válido');
      return;
    }
    await store.dispatch('cambiarContrasena', {
      idUsuario: usuarioSeleccionado.value.id_usuario,
      new_password: password.value.nueva
    });
    console.log('Contraseña cambiada para usuario:', usuarioSeleccionado.value.id_usuario);
    cerrarModalPassword();

  } catch (error) {
    alert('Error al guardar contraseña');
  }
};

const guardarCambios = async () => {
  try {
    if (!usuarioSeleccionado.value.id_usuario) {
      // Crea nuevo usuario
      await store.dispatch('crearUsuario', usuarioSeleccionado.value);
    } else {
      // Actualizar un usuario existente
      await store.dispatch('updateUser', {
        idUsuario: usuarioSeleccionado.value.id_usuario,
        updateData: usuarioSeleccionado.value
      });
    }
    console.log('Usuario de la tabla actualizado', usuarioSeleccionado.value);
    cargarUsuarios();
    cerrarModal();
  }catch (error) {
    alert('Error al guardar cambios');
  }
};

const eliminarUsuario = async () => {
  try {
    console.log('Usuario seleccionado:', usuarioSeleccionado.value);
    await store.dispatch('eliminarUsuario', usuarioSeleccionado.value.id_usuario);
    console.log('Usuario eliminado correctamente');
    cargarUsuarios();
    cerrarModal();
  } catch (error) {
    alert('Error al eliminar usuario');
  }
}
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