
import { store, updateLock, difficulty } from './settings'
import { PropType } from '#imports'
import styles from "../assets/css/gauge.module.scss"
import { describeArc } from '~/util/gaugeUtil'

interface Props {
	layerCount: number
	index: number
	isLock: boolean
}

const ACTIVE_OPACITY = 1
const INACTIVE_OPACITY = 0.25;
const DISABLED_OPACITY = 0.05;

const startRadius = 100
const thickness = 12
const thicknessChangePerLevel = 1
const layerDifference = 2;
const offset = 0
const segmentCount = store.segments
const gapDegree = 0.2
const segmentDegree = (360 - segmentCount * gapDegree) / segmentCount

export default defineComponent({
	props: {
		index: {
			type: Number as PropType<number>,
			default: 0
		},
		layerCount: {
			type: Number as PropType<number>,
			default: 4
		},
		activeLayerCount: {
			type: Number as PropType<number>,
			default: 4
		}
	},

	render: (props: Props) => {
		function renderSegments() {
			const segments: JSX.Element[] = [];
			var previousSegmentEnd = null;
			for (let layerIndex = 0; layerIndex < props.layerCount; layerIndex++) {
				const segmentOuterRadius: number = previousSegmentEnd !== null ? previousSegmentEnd - layerDifference : startRadius - (thickness + layerDifference) * layerIndex;
				const segmentThickness = thickness - layerIndex * thicknessChangePerLevel;
				previousSegmentEnd = segmentOuterRadius - segmentThickness

				for (let i = 0; i < segmentCount; i++) {
					const startAngle = (i + offset!) * (segmentDegree + gapDegree) - 11.25 / 2 + gapDegree / 2;
					const endAngle = startAngle + segmentDegree;
					const isPinActive = !(store.lock[layerIndex] !== undefined && store.lock[layerIndex].find(v => v === i))
					var opacity = isPinActive ? ACTIVE_OPACITY : INACTIVE_OPACITY;
					if (layerIndex >= Math.max((difficulty.value + 1), 2)) opacity = DISABLED_OPACITY;

					segments.push(
						<path
							key={`${i}`}
							d={describeArc(0, 0, segmentOuterRadius - segmentThickness, segmentOuterRadius, startAngle, endAngle)}
							fill={'#bddfd5'}
							opacity={opacity}
							onClick={() => {
								updateLock(layerIndex, i);
							}}
							style={{ cursor: 'pointer' }}
						/>
					);

				}
			};
			return segments;
		}

		return (
			<svg class={styles.lock} viewBox="-100 -100 200 200" >
				{renderSegments()}
			</svg>
		)
	}
})

