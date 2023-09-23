<template>
	<div>
		<div class="keyGrid">
			<div class="lock">
				<Lock />
			</div>
			<div class="keys">
				<component v-for="comp in items" :key="comp.id" :is="Key" v-bind="{ id: comp.id }"></component>
			</div>
		</div>
	</div>
	<div>
		<button v-on:click="increase" class="text-white">increase</button>
	</div>
	<div>
		<button v-on:click="decrease" class="text-white">decrease</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import Key from '~/components/Key';
import { increaseLayerCount, decreaseLayerCount } from '../components/settings'

const items = ref([]);

for (let index = 0; index < 12; index++) {
	items.value.push({ id: index })
}

const increase = () => {
	increaseLayerCount();
}

const decrease = () => {
	decreaseLayerCount();
}

</script>

<style lang="scss">
@use "~/assets/css/index.scss"
</style>