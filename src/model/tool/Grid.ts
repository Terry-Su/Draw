import Particle from '../Particle'

const { abs } = Math

export default class Grid extends Particle {
	canvas: HTMLCanvasElement
	zoom: number = 1
	pan: Point2D = {
		x: 0,
		y: 0
	}

	static INTERVAL: number = 10
	static DEFAULT_ZOOM: number = 1
	static DEFAULT_PAN: Point2D = {
		x: 0,
		y: 0
	}

	interval: number = Grid.INTERVAL

	constructor( props ) {
		super( props )

		this.canvas = props.canvas
	}

	get ctx(): CanvasRenderingContext2D {
		return this.ctx
	}

	get panX(): number {
		return this.pan.x
	}

	get panY(): number {
		return this.pan.y
	}

	get canvasWidth(): number {
		return this.canvas.getBoundingClientRect().width
	}

	get canvasHeight(): number {
		return this.canvas.getBoundingClientRect().height
	}

	get width(): number {
		return ( abs( this.panX ) + this.canvasWidth ) / this.zoom + 5 * this.interval
	}

	get height(): number {
		return ( abs( this.panY ) + this.canvasHeight ) / this.zoom + 5 * this.interval
	}

	get left(): number {
		return -Math.round( this.panX / this.interval ) * this.interval - 2 * this.interval
	}

	get right(): number {
		return this.left + this.width
	}

	get top(): number {
		return -Math.round( this.panY / this.interval ) * this.interval - 2 * this.interval
	}

	get bottom(): number {
		return this.top + this.height
	}

	get path(): Path2D {
		let path = new Path2D()

		const { width, height, interval, left, top, right, bottom } = this

		/**
		 * Draw vertical lines
		 */
		for ( let i = 0, x = 0; x < right; i++ ) {
			x = i * interval
			path.moveTo( left + x + interval, top )
			path.lineTo( left + x + interval, bottom )
		}
		/**
		 * Draw horizontal lines
		 */
		for ( let i = 0, y = 0; y < bottom; i++ ) {
			y = i * interval
			path.moveTo( left, top + y + interval )
			path.lineTo( right, top + y + interval )
		}

		return path
	}

	render(
		interval = Grid.INTERVAL,
		zoom: number = Grid.DEFAULT_ZOOM,
		pan: Point2D = Grid.DEFAULT_PAN,
		setting:any = {}
	) {
		const color = setting.color || "black"

		this.interval = interval
		this.zoom = zoom
		this.pan = pan

		const { ctx } = this.getters
		const { path } = this
		ctx.save()
		ctx.lineWidth = 1
		ctx.strokeStyle = color
		ctx.stroke( path )
		ctx.restore()
	}
}
