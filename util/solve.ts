import { store, difficultyLevel } from "~/components/settings";
import { gauge } from "./gaugeUtil";

interface validKeyWithOffset {
	key: gauge,
	validPositions: Array<number>
}

export default function Solve() {
	const difficulty = difficultyLevel.value + 1;
	const locksToUse = store.lock.slice(0, Math.max(2, difficulty))
	const keysToUse = store.keys.slice(0, Math.max(4, difficulty * 3))
	const validKeysForLock: Map<gauge, Array<validKeyWithOffset>> = new Map<gauge, Array<validKeyWithOffset>>();
	for (const lock of locksToUse) {
		for (const key of keysToUse) {
			const validOffsets = []
			const firstPinPosition = key.getFirstPin();
			for (const position of lock.getPins()) {
				let offset = position - firstPinPosition
				const newKey = key.getPins().map(v => v + offset)
				if (DoesFit(newKey, lock.getPins())) {
					validOffsets.push(offset);
				}
			}
			if (validOffsets.length > 0) {
				if (!validKeysForLock.has(lock as gauge)) {
					validKeysForLock.set(lock as gauge, new Array<validKeyWithOffset>)
				}
				validKeysForLock.get(lock as gauge)!.push({ key: key, validPositions: validOffsets } as validKeyWithOffset);
			}
		}
	}
	console.log(validKeysForLock)
}

function DoesFit(arr1: Array<number>, arr2: Array<number>): boolean {
	return arr1.every(v => arr2.includes(v));
}