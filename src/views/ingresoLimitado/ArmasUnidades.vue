<template>
    <div>
      <h1>Gestión de Armas y Unidades</h1>
  
      <!-- Selección de unidad fundamental -->
      <div>
        <label for="unidad-fundamental-select">Seleccionar Unidad Fundamental</label>
        <select id="unidad-fundamental-select" v-model="unidadSeleccionada" @change="filtrarDatos">
          <option v-for="unidad in unidadesFundamentales" :key="unidad" :value="unidad">
            {{ unidad }}
          </option>
        </select>
      </div>
  
      <!-- Tabla de armas y usuarios -->
      <div>
        <h2>Usuarios y Armas</h2>
        <DataTable
          v-if="filtrarDatosTabla.length > 0"
          :columns="columnas"
          :rows="filtrarDatosTabla"
          rowKey="id_resultado"
          @row-click="verDetalles"
        />
        <p v-else>No se encontraron datos para la unidad seleccionada.</p>
      </div>
    </div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  /* Estilos específicos para la vista de usuario especial */
  </style>