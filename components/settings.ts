import { reactive } from 'vue'
import { gauge } from '~/util/gaugeUtil';

const maxKeyCount = 12;
const maxLockLayerCount = 4;
export const difficultyLevel = ref(0);

interface storeProps {
	segments: number,
	lock: Array<gauge>,
	keys: Array<gauge>
}

export const store = reactive<storeProps>({
	segments: 32,
	lock: Array.from({ length: maxLockLayerCount }, (_, index) => new gauge(index)),
	keys: Array.from({ length: maxKeyCount }, (_, index) => new gauge(index)),
})

export function updateLock(layer: number, index: number) {
	const existingLock = store.lock[layer]

	if (existingLock) {
		existingLock.flipPin(index)
	}
}

export function updateKey(id: number, index: number) {
	const existingLock = store.keys[id]

	if (existingLock) {
		existingLock.flipPin(index)
	}
}

export function resetLocksAndKeys() {
	console.log("reset")
	store.lock = Array.from({ length: maxLockLayerCount }, (_, index) => new gauge(index));
	store.keys = Array.from({ length: maxKeyCount }, (_, index) => new gauge(index));
}

export function increaseLayerCount() {
	difficultyLevel.value = (difficultyLevel.value + 1) % 4
}

export function decreaseLayerCount() {
	difficultyLevel.value = (difficultyLevel.value - 1 + 4) % 4
}