
export function describeArc(x: number,
	y: number,
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number) {
	const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
	const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
	const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
	const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);

	const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

	const d = [
		'M',
		innerStart.x,
		innerStart.y,
		'A',
		innerRadius,
		innerRadius,
		0,
		largeArcFlag,
		0,
		innerEnd.x,
		innerEnd.y,
		'L',
		outerEnd.x,
		outerEnd.y,
		'A',
		outerRadius,
		outerRadius,
		0,
		largeArcFlag,
		1,
		outerStart.x,
		outerStart.y,
		'L',
		innerStart.x,
		innerStart.y,
		'Z',
	].join(' ');

	return d;
}

function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number
) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
}

export class gauge {
	private index: number;
	private pins: Array<number>
	constructor(index: number) {
		this.index = index;
		this.pins = new Array<number>;
	}

	flipPin(value: number) {
		const existingIndex = this.pins.findIndex(v => v === value)
		if (existingIndex >= 0) {
			this.pins.splice(existingIndex, 1)
		} else {
			this.pins.push(value)
			this.pins = this.pins.sort((a, b) => a - b)
		}
	}

	getFirstPin() {
		return this.pins[0]
	}

	isPinActive(id: number) {
		return this.pins.includes(id);
	}

	getPins() {
		return this.pins
	}

	getIndex() {
		return this.index;
	}
}