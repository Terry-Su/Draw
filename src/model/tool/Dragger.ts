import { cloneDeep } from "lodash"
import Particle from "../Particle"

class Dragger extends Particle {
	enable: boolean
	prevEvent: any

	get prevPoint(): Point2DInitial {
		const point: Point2DInitial = this.getters.getInitialPoint( this.prevEvent )
		return point
	}

	updatePrevEvent( event ) {
		this.prevEvent = event
	}

	update( event ) {}
	start( event ): void {
		const point: Point2D = this.getters.getInitialPoint( event )

		this.enable = true

		this.updatePrevEvent( event )

		this.handleStart && this.handleStart( event )
	}
	dragging( event ): void {
		const point: Point2D = this.getters.getInitialPoint( event )

		this.update( event )

		this.updatePrevEvent( event )

		this.handleDragging && this.handleDragging( event )
	}
	stop( event ): void {
		this.enable = false
		this.handleStop && this.handleStop( event )
	}
	handleStart( event ) {}
	handleDragging( event ) {}
	handleStop( event ) {}

	getDeltaPointToPrevPoint( point ): Point2D {
		const { x, y }: Point2D = point
		const { x: prevX, y: prevY } = this.prevPoint

		const deltaPoint: Point2D = {
			x: x - prevX,
			y: y - prevY
		}
		return deltaPoint
	}
	getDeltaXToPrevPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPoint( point )
		return deltaPoint.x
	}
	getDeltaYToPrevPoint( point ): number {
		const deltaPoint: Point2D = this.getDeltaPointToPrevPoint( point )
		return deltaPoint.y
	}
}

export default Dragger
