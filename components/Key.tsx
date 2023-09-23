
import { difficulty, store, updateKey } from './settings'
import { PropType } from '#imports'
import styles from "../assets/css/gauge.module.scss"
import { describeArc } from '~/util/gaugeUtil'

interface Props {
	layerCount: number
	index: number
	disabled: boolean
	id: number
}

const ACTIVE_OPACITY = 1
const INACTIVE_OPACITY = 0.25;
const DISABLED_OPACITY = 0.05;
const THICKNESS_OFFSET = 6;

const startRadius = 100
const thickness = 15
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
		},
		disabled: {
			type: Boolean as PropType<boolean>,
			default: false
		},
		id: {
			type: Number as PropType<number>,
			default: 0
		}
	},

	render: (props: Props) => {
		function renderSegments() {
			const segments: JSX.Element[] = [];
			for (let i = 0; i < segmentCount; i++) {
				const startAngle = i * (segmentDegree + gapDegree) - 11.25 / 2 + gapDegree / 2;
				const endAngle = startAngle + segmentDegree;
				const doesSegmentExist = (store.keys[props.id] && store.keys[props.id].find(v => v === i));
				const disabled = props.id >= Math.max((difficulty.value + 1) * 3, 4);

				var opacity = doesSegmentExist ? ACTIVE_OPACITY : INACTIVE_OPACITY;
				if (disabled) opacity = DISABLED_OPACITY;
				const thicknessOffset = doesSegmentExist ? THICKNESS_OFFSET : 0

				segments.push(
					<path
						key={`${props.id}-${i}`}
						d={describeArc(0, 0, startRadius - thickness - thicknessOffset, startRadius + thicknessOffset, startAngle, endAngle)}
						fill={'#bddfd5'}
						opacity={opacity}
						onClick={() => {
							if (props.disabled) return;
							updateKey(props.id, i)
						}}
						style={{ cursor: props.disabled ? 'auto' : 'pointer' }}
					/>
				);
			}
			return segments;
		}

		return (
			<div class={styles.key}>
				<svg class={styles.keysvg} viewBox="-100 -100 200 200">
					{renderSegments()}
					<text x="0" y="0" fill={props.disabled ? "black" : "white"} text-anchor="middle" dominant-baseline="middle" font-size="32">
						{props.id !== undefined ? props.id + 1 : ""}
					</text>
				</svg>
			</div>
		)
	}
})

