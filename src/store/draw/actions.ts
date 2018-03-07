import getCellTypeClassMap from "../map/getCellTypeClassMap"
import { isNil, cloneDeep, intersection } from "lodash"
import Draw from "Draw"
import Cell from "../../model/Cell"
import { isNotNil } from "util/index"
import storeElementFields from "store/storeElementFields"
import Selector from "../../model/tool/Selector"
import Interaction from "../../core/interaction"
import ViewPort from "../../model/tool/ViewPort"
import Grid from "../../model/tool/Grid"
import Renderer from "../../model/tool/Renderer"
import DrawStore from "./DrawStore"
import Getters from "./Getters"
import SharedActions from "../../shared/SharedActions";

export default class Actions {
	drawStore: DrawStore

	getters: Getters

	get sharedActions(): SharedActions {
		return this.getters.draw.sharedActions
	}

	constructor( drawStore: DrawStore, getters: Getters ) {
		this.drawStore = drawStore
		this.getters = getters
	}

	UPDATE_STORE( store: DrawStore | DrawStoreWithoutInstance ) {
		const cloned = cloneDeep( store )
		const keys: string[] = Object.keys( store )
		keys.map( set )

		function set( key ) {
			store[ key ] = cloned[ key ]
		}
	}

	UPDATE_DRAW( draw: Draw ) {
		this.drawStore[ "draw" ] = draw
	}

	UPDATE_CANVAS( canvas: HTMLCanvasElement ) {
		this.drawStore[ "canvas" ] = canvas
	}

	/**
	 * View port
	 */
	UPDATE_VIEWPORT( viewPort: ViewPort ) {
		this.drawStore[ "viewPort" ] = viewPort
	}

	UPDATE_RENDERER( renderer: Renderer ) {
		this.drawStore[ "renderer" ] = renderer
	}

	UPDATE_SELECTOR( selector: Selector ) {
		this.drawStore[ "selector" ] = selector
	}

	UPDATE_INTERACTION( interaction: Interaction ) {
		this.drawStore[ "interaction" ] = interaction
	}

	UPDATE_GRID( grid: Grid ) {
		this.drawStore[ "grid" ] = grid
	}

	ADD_ELEMENT(
		draw: Draw,
		elementType: string,
		setting: any,
		panelId?: string
	) {
		const cellTypeClassMap = getCellTypeClassMap()
		const ElementClass = cellTypeClassMap[ elementType ]

		if ( isNil( ElementClass ) ) {
			console.log( `Type not found: "${elementType}"` )
			return
		}
		const instance = new ElementClass( {
			draw,
			...setting
		} )

		const {
			id,
			type,
			top,
			left,
			width,
			height,
			fill,
			angle,
			points,
			draggable,
			shouldSelect
		}: {
			id: string
			type: string
			top: number
			left: number
			width: number
			height: number
			fill: string
			angle: number
			points: Point2D[]
			draggable: boolean
			shouldSelect: boolean
		} = setting

		const wholeElement = {
			id          : !isNil( id ) ? id : this.getters.generateDrawUniqueId(),
			__instance__: instance,
			type,
			top,
			left,
			width,
			height,
			fill,
			angle,
			points,
			draggable,
			shouldSelect
		}

		if ( isNil( panelId ) ) {
			this.getters.storeActiveElements.push( wholeElement )
		}

		if ( !isNil( panelId ) ) {
			this.getters.getStoreElementsByPanelId( panelId ).push( wholeElement )
		}
	}

	ADD_PANEL( name: string ) {
		this.getters.storePanels.push( {
			id      : this.getters.generateDrawUniqueId(),
			name,
			elements: []
		} )
	}

	MODIFY_ACTIVE_PANEL_ID( panelId: string ) {
		this.drawStore.activePanelId = panelId
	}

	ADD_ELEMENT_TO_CELL_LIST( cell: Cell ) {
		this.drawStore.cellList.push( cell )
	}

	UPDATE_STORE_ELEMENTS_BY_THEIR_INSTANCES() {
		this.drawStore.panels.map( resolvePanel )

		function resolvePanel( panel, panelIndex ) {
			panel.elements.map( resolveElement( panelIndex ) )
		}

		function resolveElement( panelIndex ) {
			return ( element, elementIndex ) => {
				const { __instance__ } = element
				if ( isNotNil( __instance__ ) ) {
					const instanceFields = Object.keys( __instance__ )
					const intersectionFields = intersection(
						instanceFields,
						storeElementFields
					)
					intersectionFields.map( setField( panelIndex, elementIndex ) )
				}
			}
		}

		function setField( panelIndex, elementIndex ) {
			return function( field ) {
				this.drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][
					field
				] = this.drawStore.panels[ panelIndex ][ "elements" ][ elementIndex ][
					"__instance__"
				][ field ]
			}
		}
	}



	/**
	 * // CEll
	 */
	START_DRAG_MOST_TOP_CELL_FOCUSED( point ) {
		const cell = this.getters.getMostTopCellFocused( point )
		this.sharedActions.startDragCell( cell, event )
	}

	 START_DRAG_CELLS_SHOULD_SELECT( event ) {
		const self = this

		this.getters.cellsShouldSelect.map( startDrag )

		function startDrag( cell ) {
			self.sharedActions.startDragCell( cell, event )
		}
	}

	DRAGGING_CELLS_SHOULD_DRAG() {
		const self = this

		this.getters.cellsShouldDrag.map( dragging )

		function dragging( cell ) {
			self.sharedActions.draggingCell( cell, event )
		}
	}

	STOP_DRAG_CELLS_SHOULD_DRAG() {
		const self = this

		this.getters.cellsShouldDrag.map( stopDrag )

		function stopDrag( cell ) {
			self.sharedActions.stopDragCell( cell, event )
		}
	}



	/**
	 * // Select
	 */
	DESELECT_ALL_CELLS() {
		this.getters.cellList.map( this.sharedActions.deselectCell )
	}

	SELECT_MOST_TOP_CELL_FOCUSED( point: Point2D ) {
		const mostTopCell = this.getters.getMostTopCellFocused( point )
		this.sharedActions.selectCell( mostTopCell )
	}

	SELECT_CELLS_IN_SELECTOR_RIGION() {
		this.getters.cellsInSelectorRigion.map( this.sharedActions.selectCell )
	}


}
