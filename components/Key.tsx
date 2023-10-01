
import { difficultyLevel, store, updateKey } from './settings'
import { PropType } from '#imports'
import styles from "../assets/css/gauge.module.scss"
import { describeArc } from '~/util/gaugeUtil'

interface Props {
	index: number,
	offset:number,
	clickable:boolean,
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
		offset:{
			type: Number as PropType<number>,
			default:0
		},
		clickable:{
			type: Boolean as PropType<boolean>,
			default:true
		}
	},


	render: (props: Props) => {
		const key = store.keys[props.index];
		const disabled = props.index >= Math.max((difficultyLevel.value + 1) * 3, 4) || props.clickable === false;

		function renderSegments() {
			const segments: JSX.Element[] = [];
			for (let i = 0; i < segmentCount; i++) {
				const startAngle = (i + props.offset) * (segmentDegree + gapDegree) - 11.25 / 2 + gapDegree / 2;
				const endAngle = startAngle + segmentDegree;
				const doesSegmentExist = (key.isPinActive(i));

				var opacity = doesSegmentExist ? ACTIVE_OPACITY : INACTIVE_OPACITY;
				if (disabled) opacity = DISABLED_OPACITY;
				const thicknessOffset = doesSegmentExist ? THICKNESS_OFFSET : 0

				segments.push(
					<path
						key={`${props.index}-${i}`}
						d={describeArc(0, 0, startRadius - thickness - thicknessOffset, startRadius + thicknessOffset, startAngle, endAngle)}
						fill={'#bddfd5'}
						opacity={opacity}
						onClick={() => {
							if (disabled) return;
							key.flipPin(i);
						}}
						style={{ cursor: disabled ? 'auto' : 'pointer' }}
					/>
				);
			}
			return segments;
		}

		return (
			<div class={styles.key}>
				<svg class={styles.keysvg} viewBox="-100 -100 200 200">
					{renderSegments()}
					<text x="0" y="0" fill={disabled ? "black" : "white"} text-anchor="middle" dominant-baseline="middle" font-size="32">
						{props.index !== undefined ? props.index + 1 : ""}
					</text>
				</svg>
			</div>
		)
	}
})

