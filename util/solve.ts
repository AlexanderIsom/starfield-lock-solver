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

	if (locksWithMissingCutputs.length > 0) {
		errorMessage.push(lockMessage)
	}

	if (keysWithMissingPins.length > 0) {
		errorMessage.push(keyMessage)
	}


	if (invalid) {
		return [false, errorMessage]
	}

	const keys = bruteForceUnlock(locksToUse, keysToUse);

	if (keys === undefined) {
		return [false, ["No solution found please try again"]]
	}
	return [true, [], keys]
}



function bruteForceUnlock(lockLayers: Array<gauge>, keys: Array<gauge>): Array<finalKey> | undefined {
	function attemptUnlock(lockLayerIndex: number, currentLayer: Array<number>, remainingKeys: Array<gauge>, usedKeys: Array<finalKey>): Array<finalKey> | undefined {
		if (lockLayerIndex >= lockLayers.length) {
			return usedKeys
		}

		if (currentLayer.length === 0) {
			const nextlockLayer = lockLayers[lockLayerIndex + 1]
			const nextPins = nextlockLayer !== undefined ? nextlockLayer.getPins() : [];
			return attemptUnlock(lockLayerIndex + 1, nextPins, remainingKeys, usedKeys)
		}

		for (let keyIndex = 0; keyIndex < remainingKeys.length; keyIndex++) {
			const key = remainingKeys[keyIndex];
			for (const cutout of currentLayer) {
				const offset = cutout - key.getFirstPin();
				const offsetKeyPins = key.getPins().map(k => (k + offset + 32) % 32);
				if (offsetKeyPins.every(k => currentLayer.includes(k))) {
					const remainingLock = currentLayer.filter(g => !offsetKeyPins.includes(g))

					const nextRemainingKeys = [...remainingKeys];
					nextRemainingKeys.splice(keyIndex, 1);
					const result = attemptUnlock(lockLayerIndex, remainingLock, nextRemainingKeys, [...usedKeys, { key: key, offset: offset } as finalKey])

					if (result !== undefined) {
						return result;
					}
				}
			}
		}
	}

	return attemptUnlock(0, lockLayers[0].getPins(), keys, [])
}