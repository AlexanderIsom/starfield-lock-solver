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
	const validKeysForLock: Array<{ lock: gauge, validKeys: Array<validKeyWithOffset> }> = new Array<{ lock: gauge, validKeys: Array<validKeyWithOffset> }>();

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
		const validkeys: Array<validKeyWithOffset> = new Array<validKeyWithOffset>;
		for (const key of keysToUse) {
			const validOffsets = []
			const firstPinPosition = key.getFirstPin();
			for (const position of lock.getPins()) {
				let offset = position - firstPinPosition
				const newKey = key.getPins().map(v => (v + offset) % 32).sort((a, b) => a - b)
				if (DoesFit(newKey, lock.getPins())) {
					validOffsets.push(offset);
				}
			}
			if (validOffsets.length > 0) {
				validkeys.push({ key: key, validPositions: validOffsets } as validKeyWithOffset);
			}
		}

		validKeysForLock.push({ lock: lock, validKeys: validkeys })
	}
	const [success, keys] = bruteForceKeys(validKeysForLock, 0, validKeysForLock[0].lock.getPins());

	if (!success) {
		return [false, ["No solution found please try again"]]
	}
	return [true, [], keys.reverse()]
}

function DoesFit(arr1: Array<number>, arr2: Array<number>): boolean {
	return arr1.every(v => arr2.includes(v));
}

function bruteForceKeys(locksWithValidKeys: Array<{ lock: gauge, validKeys: Array<validKeyWithOffset> }>, index: number, remainingPins: Array<number>): [boolean, Array<finalKey>] {
	const validKeys = locksWithValidKeys[index].validKeys;

	function checkKeyOffsets(validKey: validKeyWithOffset): [boolean, Array<finalKey>] {
		for (const offset of validKey.validPositions) {
			const shiftedKey = validKey.key.getPins().map(k => (k + offset) % 32).sort((a, b) => a - b);
			if (shiftedKey.every(k => remainingPins.includes(k))) {
				var remainingLockPins = remainingPins.filter(l => !shiftedKey.includes(l));
				var nextIndex = index
				if (remainingLockPins.length === 0) {
					nextIndex += 1
					if (locksWithValidKeys[nextIndex] === undefined) {
						return [true, [{ key: validKey.key, offset: offset } as finalKey]]
					}
					remainingLockPins = locksWithValidKeys[nextIndex].lock.getPins();
				}
				validKey.key.setUsed(true)
				const [success, keys] = bruteForceKeys(locksWithValidKeys, nextIndex, remainingLockPins);
				if (success) {
					keys.push({ key: validKey.key, offset: offset } as finalKey)
					return [true, keys]
				}
				validKey.key.setUsed(false);
			}
		}
		return [false, []]
	}

	for (const validKey of validKeys) {
		if (!validKey.key.isUsed()) {
			const [success, keys] = checkKeyOffsets(validKey);
			if (success) {
				return [true, keys]
			}
		}
	}
	return [false, []]
}