import { store, difficultyLevel } from "~/components/settings";
import { gauge } from "./gaugeUtil";

export interface validKeyWithOffset {
	key: gauge,
	validPositions: Array<number>
}

export interface finalKey {
	key: gauge,
	offset: number,
}

export default function Solve(): [boolean, Array<string>, Array<finalKey>?] {
	const difficulty = difficultyLevel.value + 1;
	const locksToUse = store.lock.slice(0, Math.max(2, difficulty)) as Array<gauge>
	const keysToUse = store.keys.slice(0, Math.max(4, difficulty * 3)) as Array<gauge>
	const validKeysForLock: Map<gauge, Array<validKeyWithOffset>> = new Map<gauge, Array<validKeyWithOffset>>();

	var errorMessage: Array<string> = new Array<string>();
	var invalid = false;
	var locksWithMissingCutputs: string = "";
	var keysWithMissingPins: string = "";

	for (const lock of locksToUse) {
		if (lock.getPins().length === 0) {
			invalid = true;
			if (locksWithMissingCutputs !== "") {
				locksWithMissingCutputs += ", "
			}
			locksWithMissingCutputs += `${lock.getIndex() + 1}`
		}
	}

	for (const key of keysToUse) {
		key.setUsed(false);
		if (key.getPins().length === 0) {
			invalid = true;
			if (keysWithMissingPins !== "") {
				keysWithMissingPins += ", "
			}
			keysWithMissingPins += `${key.getIndex() + 1}`
		}
	}

	const lockMessage = "lock layers: " + locksWithMissingCutputs + " are missing cutouts, please add at least 1 cutout per layer"
	const keyMessage = "keys: " + keysWithMissingPins + " are missing pins, please add at least 1 pin per key"

	errorMessage.push(lockMessage, keyMessage)

	if (invalid) {
		return [false, errorMessage]
	}

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

	var completedLock: Array<finalKey> = new Array<finalKey>();

	var failed = false;

	validKeysForLock.forEach((validKeys, lock) => {
		const [success, keys] = bruteForceKeys(lock.getPins(), validKeys)
		if (!success) {
			failed = true;
		}
		completedLock = completedLock.concat(keys);
	});

	if (failed) {
		return [false, ["No solution found please try again"]]
	}

	return [true, [], completedLock]
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
				return [true, keys.reverse()]
			}
		}
	}
	return [false, []]
}