<template>
    <div>

      <h1>CONFIGURACIÓN</h1>
      
      <!-- Formulario para mostrar y editar datos -->
      <form @submit.prevent="actualizarUsuario">
        <h2>Editar Datos</h2>
        <label>RUT:</label>
        <input v-model="form.rut" type="text" :disabled="!editable">
        <label>Grado:</label>
        <input type="text" v-model="form.grado" :disabled="!editable">
        <label>Apellido Paterno:</label>
        <input type="text" v-model="form.apellido_paterno" :disabled="!editable">
        <label>Apellido Materno:</label>
        <input type="text" v-model="form.apellido_materno" :disabled="!editable">
        <label>Nombre:</label>
        <input type="text" v-model="form.nombre" :disabled="!editable">
        <label>Correo:</label>
        <input type="text" v-model="form.correo" :disabled="!editable">
        <label>Unidad Regimentaria:</label>
        <input type="text" v-model="form.unidad_regimentaria" :disabled="!editable">
        <label>Unidad de Combate:</label>
        <input type="text" v-model="form.unidad_combate" :disabled="!editable">
        <label>Unidad Fundamental:</label>
        <input type="text" v-model="form.unidad_fundamental" :disabled="!editable">
        <div>
          <button type="button" @click="habilitarEdicion">
            {{ editable ? 'Cancelar Edición' : 'Editar' }}
          </button>
          <button type="button" @click="abrirModalPassword">Cambiar Contraseña</button>
          <button type="submit" v-if="editable">Guardar Cambios</button>
        </div>
      </form>
      <Modal 
      :visible="modalPasswordVisible" 
      :title="'Cambio de Contraseña'" 
      @close="cerrarModalPassword">
      <form @submit.prevent="actualizarContrasena" class="form-modal">
        <div class="form-group">
          <label class="label-modal">Contraseña Actual</label>
          <input 
          type="password" 
          v-model="password.contrasena_actual" 
          placeholder="Contraseña Actual" 
          required 
          />
        </div>
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
          <button type="button" class="cancel-button" @click="cerrarModalPassword">Cancelar</button>
        </div>
      </form>
      </Modal>
    </div>
    </template>
    
    <script setup>
    import { reactive ,ref, computed, onMounted } from 'vue';
    import Modal from '@/components/Modal.vue';
    import { useStore } from 'vuex';

    const store = useStore();
    const user = computed(() => store.state.user);

    // Estado para controlar la edicion
    const editable = ref(false);
    const modalPasswordVisible = ref(false);

    // Formularios
    const form = reactive({
      rut: '',
      grado: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombre: '',
      correo: '',
      unidad_regimentaria: '',
      unidad_combate: '',
      unidad_fundamental: '',
    });

    const password = reactive({
      contrasena_actual: '',
      nueva: '',
      confirmar: '',
    });

    onMounted(() => {
      store.dispatch('fetchUser').then(() => {
        if (user.value) {
          form.rut = user.value.rut;
          form.grado = user.value.grado;
          form.apellido_paterno = user.value.apellido_paterno;
          form.apellido_materno = user.value.apellido_materno;
          form.nombre = user.value.nombre;
          form.correo = user.value.correo;
          form.unidad_regimentaria = user.value.unidad_regimentaria;
          form.unidad_combate = user.value.unidad_combate;
          form.unidad_fundamental = user.value.unidad_fundamental;

        }
      });
    });

    // Funcioan para alternar el modo edicion
    const habilitarEdicion = () => {
      editable.value = !editable.value;
    };

    // Abrir y cerrar modal de contraseña
    const abrirModalPassword = () => {
      modalPasswordVisible.value = true;
    }

    const cerrarModalPassword = () => {
      modalPasswordVisible.value = false;
      password.contrasena_actual = '';
      password.nueva = '';
      password.confirmar = '';
    }

    const actualizarUsuario = async () => {
      try {
        await store.dispatch('updateUser', {
          updateData: form, // Datos actualizados del formulario
      });
      console.log('Usuario actualizado correctamente');
      editable.value = false; // Deshabilitar edicion
      } catch (error) {
        console.log('Error al actualizar usuario', error);
        alert('Error al actualizar usuario(config)', error);
      }
    };

    // Cambiar contraseña
    const actualizarContrasena = async () => {
      if (password.nueva !== password.confirmar) {
        alert('Las contraseñas no coinciden');
        return;
      }
      try {
        await store.dispatch('cambiarContrasena', {
          old_password: password.contrasena_actual,
          new_password: password.nueva,
        });
        console.log('Contraseña actualizada');
        cerrarModalPassword();

      } catch (error) {
        alert('Error al actualizar contraseña');
      }
    };

    </script>
    
    <style scoped>
     h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: aliceblue;
      }
      p {
        font-size: 1.2rem;
        color: aliceblue;
      }
    </style>