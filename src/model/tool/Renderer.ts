import Particle from "../Particle"
import Getters from "../../store/draw/getters"

export default class Renderer extends Particle {
	constructor( props ) {
		super( props )
	}

	get ctx(): CanvasRenderingContext2D {
		return this.getters.ctx
	}

	clear() {
		this.resetTransform()
		this.getters.ctx.clearRect(
			0,
			0,
			this.getters.canvasWidth,
			this.getters.canvasHeight
		)
	}

	resetTransform() {
		this.ctx.setTransform( 1, 0, 0, 1, 0, 0 )
	}

	setTransformViewPort() {
		const { zoom, movementX, movementY, ctx }: Getters = this.getters
		// ctx.globalCompositeOperation = "source-over"
		ctx.setTransform( zoom, 0, 0, zoom, movementX, movementY )
		// this.ctx.setTransform( 2, 0, 0, 2, 100,100 )
	}

	setTransformViewPortToRenderMiniMap() {
		const { ctx, zoom, movementX, movementY } = this.getters
		const {
			initialRatio,
			basicLeft,
			basicTop,
		} = this.getters.miniMap.viewBox

		ctx.setTransform(
			zoom / initialRatio,
			0,
			0,
			zoom / initialRatio,
			basicLeft + movementX / initialRatio,
			basicTop + movementY / initialRatio
		)
	}
}
