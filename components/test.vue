<script setup lang ="ts">
const isOpen = ref(false)
</script>
<template>
	<UButton label="Open" @click="isOpen = true" />
	<UModal v-model="isOpen" prevent-close :ui="{ width: 'sm:max-w-none' }">
		<div>hello</div>
	</UModal>
</template>