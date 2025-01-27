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
                <div class="form-header" v-if="!esCreacion">
                  <button type="button" @click="habilitarEdicion">
                    {{ editable ? 'Cancelar Edición' : 'Editar' }}
                  </button>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>RUT</label>
                    <input type="text" id="rut" v-model="usuarioSeleccionado.rut" placeholder="Ingrese RUT" :disabled="!editable && !esCreacion" required />
                  </div>

                  <div class="form-group">
                    <label>Grado</label>
                    <input type="text" id="grado" v-model="usuarioSeleccionado.grado" placeholder="Ingrese Grado" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Apellido Paterno</label>
                    <input type="text" id="apellido_paterno" v-model="usuarioSeleccionado.apellido_paterno" placeholder="Ingrese Apellido Paterno" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Apellido Materno</label>
                    <input type="text" id="apellido_materno" v-model="usuarioSeleccionado.apellido_materno" placeholder="Ingrese Apellido Materno" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="nombre" v-model="usuarioSeleccionado.nombre" placeholder="Ingrese Nombre" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Correo</label>
                    <input type="text" id="correo" v-model="usuarioSeleccionado.correo" placeholder="Ingrese Correo" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Rol</label>
                    <input type="text" id="rol" v-model="usuarioSeleccionado.rol" placeholder="Ingrese Rol" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Unidad Regimentaria</label>
                    <input type="text" id="unidad-regimentaria" v-model="usuarioSeleccionado.unidad_regimentaria" placeholder="Ingrese Unidad Regimentaria" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Unidad de Combate</label>
                    <input type="text" id="unidad-combate" v-model="usuarioSeleccionado.unidad_combate" placeholder="Ingrese Unidad de Combate" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>Unidad Fundamental</label>
                    <input type="text" id="unidad-fundamental" v-model="usuarioSeleccionado.unidad_fundamental" placeholder="Ingrese Unidad Fundamental" :disabled="!editable && !esCreacion" />
                  </div>

                  <div class="form-group">
                    <label>¿Habilitado para iniciar sesión?</label>
                    <select
                      v-model="usuarioSeleccionado.habilitado"
                      :disabled="!editable && !esCreacion"
                      @change="actualizarEstadoHabilitado"
                    >
                      <option value="" disabled>Seleccione una opción</option>
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
                      {{ esCreacion ? 'Crear Contraseña' : 'Cambiar Contraseña' }}
                    </button>
                  </div>
                </div>

                <div class="form-footer">
                  <button 
                    type="submit" 
                    class="save-button"
                    :disabled="guardando"
                  >
                    {{ guardando ? 'Guardando...' : 'Guardar' }}
                  </button>
                  <button 
                    type="button" 
                    v-if="!esCreacion" 
                    @click="eliminarUsuario" 
                    class="delete-button"
                    :disabled="guardando"
                  >
                    Eliminar
                  </button>
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
                  <button 
                    type="submit" 
                    class="save-button"
                    :disabled="guardandoPassword"
                  >
                    {{ guardandoPassword ? 'Guardando...' : 'Guardar' }}
                  </button>
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
const esCreacion = ref(false);
const guardando = ref(false);
const guardandoPassword = ref(false);

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
  esCreacion.value = true;
  modalVisible.value = true;

}

const editarUsuariosModal = (row) => {
  modalTitle.value = 'Editar Usuario';
  usuarioSeleccionado.value = {...row};
  editable.value = false;
  esCreacion.value = false;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  usuarioSeleccionado.value = null;
  editable.value = false;
  esCreacion.value = false;
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
    guardandoPassword.value = true;
    await store.dispatch('cambiarContrasena', {
      idUsuario: usuarioSeleccionado.value.id_usuario,
      new_password: password.value.nueva
    });
    console.log('Contraseña guardada para usuario:', usuarioSeleccionado.value.id_usuario);
    cerrarModalPassword();
    if (esCreacion.value) {
      cerrarModal();
      await cargarUsuarios();
    }
  } catch (error) {
    console.error('Error al guardar contraseña:', error);
    alert('Error al guardar la contraseña');
  } finally {
    guardandoPassword.value = false;
  }
};

const guardarCambios = async () => {
  try {
    guardando.value = true;
    let nuevoUsuario;
    if (!usuarioSeleccionado.value.id_usuario) {
      // Crear nuevo usuario
      nuevoUsuario = await store.dispatch('crearUsuario', usuarioSeleccionado.value);
      if (nuevoUsuario && usuarioSeleccionado.value.habilitado === true) {
        usuarioSeleccionado.value.id_usuario = nuevoUsuario.id_usuario;
        abrirModalPassword();
      } else {
        await cargarUsuarios();
        cerrarModal();
      }
    } else {
      // Actualizar usuario existente
      await store.dispatch('updateUser', {
        idUsuario: usuarioSeleccionado.value.id_usuario,
        updateData: usuarioSeleccionado.value
      });
      await cargarUsuarios();
      cerrarModal();
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    alert('Error al guardar los cambios del usuario');
  } finally {
    guardando.value = false;
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
/* Remover estilos que interfieren con el Modal */
.form-modal {
  /* Los estilos del formulario vendrán del Modal.vue */
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: aliceblue;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  font-size: 0.9rem;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.input-busqueda {
  width: 100%;
  max-width: 300px;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  font-size: 0.9rem;
}

.input-busqueda:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  margin-bottom: 1rem;
  color: aliceblue;
}

p {
  color: aliceblue;
  margin-bottom: 1rem;
}

.save-button,
.action-button {
  background: #4a9eff;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.save-button:hover,
.action-button:hover {
  background: #3d8be6;
}

.delete-button {
  background: #ff4a4a;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: #e63d3d;
}

.save-button:disabled,
.action-button:disabled,
.delete-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.save-button:disabled:hover,
.action-button:disabled:hover,
.delete-button:disabled:hover {
  background: #cccccc;
}

.form-group select {
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  font-size: 0.9rem;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  cursor: pointer;
}

.form-group select option {
  background-color: #1a1a1a;
  color: aliceblue;
  padding: 0.6rem;
}

.form-group select:focus {
  outline: none;
  border-color: #4a9eff;
  background-color: rgba(255, 255, 255, 0.1);
}

.form-group select::-ms-expand {
  display: none;
}

.form-group select option:hover,
.form-group select option:focus,
.form-group select option:active,
.form-group select option:checked {
  background-color: #4a9eff;
  color: white;
}
</style>