import { reactive } from 'vue'

export const keyCount = 12;
export const difficulty = ref(0);

export const store = reactive({
	segments: 32,
	lock: new Array<Array<number>>,
	keys: new Array<Array<number>>,
})

export function updateLock(layer: number, index: number) {
	if (store.lock[layer] === undefined) {
		store.lock[layer] = new Array<number>
	}
	const existingIndex = store.lock[layer].findIndex(v => v === index)

	if (existingIndex >= 0) {
		store.lock[layer].splice(existingIndex, 1)
	} else {
		store.lock[layer].push(index)
		store.lock[layer] = store.lock[layer].sort((a, b) => a - b)
	}
}

export function updateKey(id: number, index: number) {
	if (store.keys[id] === undefined) {
		store.keys[id] = new Array<number>
	}

	const existingIndex = store.keys[id].findIndex(v => v === index)

	if (existingIndex >= 0) {
		store.keys[id].splice(existingIndex, 1)
	} else {
		store.keys[id].push(index)
		store.keys[id] = store.keys[id].sort((a, b) => a - b)
	}
}

export function increaseLayerCount() {
	difficulty.value = (difficulty.value + 1) % 4
}

export function decreaseLayerCount() {
	difficulty.value = (difficulty.value - 1 + 4) % 4
}