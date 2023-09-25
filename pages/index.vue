<template>
	<div>
		<div class="flex flex-col">
			<h1 class="text-primary-500 dark:text-primary-400 justify-center text-center text-4xl font-bold">
				Starfield lockpick solver</h1>
			<h2 class="text-gray-900 dark:text-white justify-center text-center text-xl font-bold">Solve
				any lockpick in Starfield!</h2>
			<div class="justify-center items-center self-center">
				<UButton icon="i-material-symbols-arrow-left-alt-rounded" @click="decrease" />
				<UButton icon="i-material-symbols-arrow-right-alt-rounded" @click="increase" />
			</div>
		</div>

		<div>
			<div class=" keyGrid">
				<div class="lock">
					<Lock />
				</div>
				<div class="keys">
					<component v-for="comp in items" :key="comp.id" :is="Key" v-bind="{ id: comp.id }"></component>
				</div>
			</div>
		</div>

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
@use "~/assets/css/index.scss";
</style>