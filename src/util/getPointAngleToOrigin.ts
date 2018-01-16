export default function getPointAngleToOrigin( point ): number {
	const { x, y } = point
	const absoluteAngle = Math.atan( Math.abs( y / x ) )

	// first coordinate
	if ( x >= 0 && y >= 0 ) {
		return absoluteAngle
	}

	// second coordinate
	if ( x < 0 && y >= 0 ) {
		return Math.PI - absoluteAngle
	}

	// third coordinate
	if ( x < 0 && y < 0 ) {
		return Math.PI + absoluteAngle
	}

	// fourth coordinate
	if ( x >= 0 && y < 0 ) {
		return - absoluteAngle
	}
}