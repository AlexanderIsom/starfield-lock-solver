import { store, difficultyLevel } from "~/components/settings";
import { gauge } from "./gaugeUtil";

interface validKeyWithOffset {
	key: gauge,
	validPositions: Array<number>
}

interface finalKey {
	key: gauge,
	offset: number,
}

const completedLock: Map<gauge, Array<finalKey>> = new Map<gauge, Array<finalKey>>();

export default function Solve() {
	const difficulty = difficultyLevel.value + 1;
	const locksToUse = store.lock.slice(0, Math.max(2, difficulty)) as Array<gauge>
	const keysToUse = store.keys.slice(0, Math.max(4, difficulty * 3)) as Array<gauge>
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
	// go through each lock until all the valid keys complete the lock, then go to the next layer, if the layer fails then re do with new keys

	validKeysForLock.forEach((validKeys, lock) => {
		console.log(toRaw(bruteForceKeys(lock.getPins(), validKeys)))
	});
}

function DoesFit(arr1: Array<number>, arr2: Array<number>): boolean {
	return arr1.every(v => arr2.includes(v));
}

function bruteForceKeys(remainingPins: Array<number>, remainingKeys: Array<validKeyWithOffset>): [boolean, Array<finalKey>] {
	function checkKeyOffsets(validKey: validKeyWithOffset): [boolean, Array<finalKey>] {
		for (const offset of validKey.validPositions) {
			const shiftedKey = validKey.key.getPins().map(k => k + offset);
			if (shiftedKey.every(k => remainingPins.includes(k))) {
				const remainingLock = remainingPins.filter(l => !shiftedKey.includes(l));
				const leftOverKeys = remainingKeys.filter(k => k.key !== validKey.key);
				if (remainingLock.length === 0) {
					validKey.key.setUsed(true)
					return [true, [{ key: validKey.key, offset: offset }]]
				}
				const [success, keys] = bruteForceKeys(remainingLock, leftOverKeys);
				if (success) {
					validKey.key.setUsed(true)
					keys.push({ key: validKey.key, offset: offset } as finalKey)
					return [true, keys]
				}
			}
		}
		return [false, []]
	}

	for (const validKey of remainingKeys) {
		if (!validKey.key.isUsed()) {
			const [success, keys] = checkKeyOffsets(validKey);
			if (success) {
				return [true, keys]
			}
		}
	}
	return [false, []]
}