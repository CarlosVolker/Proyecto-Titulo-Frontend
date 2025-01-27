<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="closeOnOverlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const closeOnOverlay = (event) => {
  if (props.closeOnClickOutside) {
    emit('close');
  }
};

// Función para bloquear el scroll del body
const blockScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '8px'; // Compensar el ancho del scrollbar
};

// Función para desbloquear el scroll del body
const unblockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

// Observar cambios en la propiedad visible
watch(() => props.visible, (newValue) => {
  if (newValue) {
    blockScroll();
  } else {
    unblockScroll();
  }
}, { immediate: true });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
  overflow: hidden;
}

.modal-content {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  color: aliceblue;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.modal-close {
  background: none;
  border: none;
  color: aliceblue;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #4a9eff;
  background-color: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: transparent;
}

/* Estilos para formularios dentro del modal */
:deep(form) {
  display: grid;
  gap: 1rem;
  margin: 0 auto;
  max-width: 90%;
}

:deep(input),
:deep(select),
:deep(textarea) {
  width: 100%;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: aliceblue;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

:deep(input:focus),
:deep(select:focus),
:deep(textarea:focus) {
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: rgba(240, 248, 255, 0.5);
}

:deep(label) {
  color: aliceblue;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
}

:deep(button) {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

:deep(button[type="submit"]) {
  background: #4a9eff;
  color: white;
}

:deep(button[type="submit"]:hover) {
  background: #3d8be6;
}

:deep(button[type="button"]) {
  background: rgba(255, 255, 255, 0.1);
  color: aliceblue;
}

:deep(button[type="button"]:hover) {
  background: rgba(255, 255, 255, 0.2);
}

/* Estilos para la lista de sugerencias */
:deep(ul) {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
}

:deep(li) {
  padding: 0.6rem 1rem;
  color: aliceblue;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(li:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #4a9eff;
}

/* Estilos para mensajes de error o validación */
:deep(.error-message) {
  color: #ff4a4a;
  font-size: 0.875rem;
  margin-top: 0.3rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>