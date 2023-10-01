<script setup lang ="ts">
const props = defineProps<{
  isOpen: boolean,
}>();
</script>
<template>
  <div v-if="isOpen">The boolean is true!</div>
  <div v-else>The boolean is false!</div>
</template>