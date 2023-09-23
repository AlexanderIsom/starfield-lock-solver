
import { store, updateLock } from './settings'
import { PropType } from '#imports'
import { describeArc } from '~/util/gaugeUtil'

interface Props {
	layerCount: number
	index: number
	isLock: boolean
}

const ACTIVE_OPACITY = 1
const INACTIVE_OPACITY = 0.25;
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
			default: 1
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
					const isPinActive = true;
					var opacity = isPinActive ? ACTIVE_OPACITY : INACTIVE_OPACITY;

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
			<svg viewBox="-100 -100 200 200" class="overflow-hidden">
				{renderSegments()}
			</svg>
		)
	}
})

