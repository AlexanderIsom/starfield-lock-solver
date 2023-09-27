<template>
	<div class="flex flex-col">
		<h1 class="text-primary-500 dark:text-primary-400 justify-center text-center text-4xl font-bold">
			Starfield lockpick solver</h1>
		<h2 class="text-gray-900 dark:text-white justify-center text-center text-xl font-bold">Solve
			any lockpick in Starfield!</h2>
		<div class="justify-center items-center self-center flex gap-2">
			<UButton icon="i-material-symbols-arrow-left-alt-rounded" @click="decrease" color="lime" />
			<div class="flex w-28 h-8 justify-center rounded-md items-centertext-black font-bold text-xl ">
				{{
					difficulty[difficultyLevel]
				}}</div>
			<UButton icon="i-material-symbols-arrow-right-alt-rounded" @click="increase" color="lime" />
		</div>
	</div>

	<div>
		<div class=" keyGrid">
			<div class="lock">
				<Lock />
			</div>
			<div class="keys">
				<component v-for="key in items" :key="key.id" :is="Key" v-bind="{ index: key.index }"></component>
			</div>
		</div>
	</div>

	<div class="flex justify-center gap-5">
		<UButtonGroup size="xl" orientation="horizontal">
			<UButton class="text-xl" color="rose" variant="outline">Reset</UButton>
			<UButton class="text-xl" color="emerald" variant="outline" @click="startSolve">Solve</UButton>
		</UButtonGroup>
	</div>
</template>

<script setup>
import Key from '~/components/Key';
import { increaseLayerCount, decreaseLayerCount, difficultyLevel, store } from '../components/settings'
import { difficulty } from "~/util/difficultyUtil"
import solve from "~/util/solve"

const items = store.keys;

const increase = () => {
	increaseLayerCount();
}

const decrease = () => {
	decreaseLayerCount();
}

const startSolve = () => {
	solve();
}

</script>

<style lang="scss">
@use "~/assets/css/index.scss";
</style>