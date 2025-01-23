<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="cerrar">X</button>
      </header>
      <section class="modal-body">
        <slot></slot>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['close']);

defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Modal'
  }
});

const cerrar = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  max-height: 90vh;
  overflow-y: auto;
  background: #575757;
  padding: 1rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 1rem;
}
</style>