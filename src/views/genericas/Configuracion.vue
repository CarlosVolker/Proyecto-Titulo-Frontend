<template>
    <div class="container">
      <h1>CONFIGURACIÓN</h1>
      
      <!-- Formulario para mostrar y editar datos -->
      <form @submit.prevent="actualizarUsuario">
        <h2>Editar Datos</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>RUT:</label>
            <input v-model="form.rut" type="text" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Grado:</label>
            <input type="text" v-model="form.grado" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Apellido Paterno:</label>
            <input type="text" v-model="form.apellido_paterno" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Apellido Materno:</label>
            <input type="text" v-model="form.apellido_materno" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Nombre:</label>
            <input type="text" v-model="form.nombre" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Correo:</label>
            <input type="text" v-model="form.correo" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Unidad Regimentaria:</label>
            <input type="text" v-model="form.unidad_regimentaria" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Unidad de Combate:</label>
            <input type="text" v-model="form.unidad_combate" :disabled="!editable">
          </div>
          <div class="form-group">
            <label>Unidad Fundamental:</label>
            <input type="text" v-model="form.unidad_fundamental" :disabled="!editable">
          </div>
        </div>
        <div class="button-group">
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
        <form @submit.prevent="cambiarContrasena" class="form-modal">
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
            <button type="button" class="cancel-button" @click="cerrarModalPassword">Cancelar</button>
            <button type="submit" class="save-button">Guardar</button>
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

    onMounted(async () => {
      try {
        const userData = await store.dispatch('fetchUser');
        if (userData) {
          Object.keys(form).forEach(key => {
            form[key] = userData[key] || '';
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
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
        const updateData = { ...form };
        await store.dispatch('updateUser', { updateData });
        editable.value = false;
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    };

    const cambiarContrasena = async () => {
      if (password.nueva !== password.confirmar) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        await store.dispatch('cambiarContrasena', {
          old_password: password.contrasena_actual,
          new_password: password.nueva
        });
        
        password.contrasena_actual = '';
        password.nueva = '';
        password.confirmar = '';
        
        modalPasswordVisible.value = false;
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
      }
    };

    </script>
    
    <style scoped>
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    h1 {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      margin-bottom: 1rem;
      color: aliceblue;
      text-align: center;
    }

    h2 {
      font-size: clamp(1.1rem, 3vw, 1.5rem);
      color: aliceblue;
      margin-bottom: 1rem;
    }

    form {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      max-width: 800px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    label {
      color: aliceblue;
      font-size: 0.9rem;
      font-weight: 500;
    }

    input {
      padding: 0.6rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: aliceblue;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #4a9eff;
      background: rgba(255, 255, 255, 0.1);
    }

    input:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-group {
      display: flex;
      gap: 0.8rem;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button[type="submit"] {
      background: #4a9eff;
      color: white;
    }

    button[type="submit"]:hover {
      background: #3d8be6;
    }

    button[type="button"] {
      background: rgba(255, 255, 255, 0.1);
      color: aliceblue;
    }

    button[type="button"]:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Estilos para el modal de cambio de contraseña */
    .form-modal {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .label-modal {
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.8rem;
      margin-top: 1rem;
    }

    .save-button {
      background: #4a9eff;
      color: white;
    }

    .cancel-button {
      background: #e0e0e0;
      color: #333;
    }

    /* Media queries para responsividad */
    @media (max-width: 768px) {
      .container {
        padding: 0.8rem;
      }

      form {
        padding: 1.2rem;
      }

      .button-group {
        justify-content: center;
      }

      button {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 0.8rem;
      }

      input {
        font-size: 16px;
      }
    }
    </style>