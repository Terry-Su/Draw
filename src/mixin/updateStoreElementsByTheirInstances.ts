import * as _ from 'lodash'
import * as interfaces from 'interface/index'
import storeElementFields from 'store/storeElementFields'


export default function ( drawStore:interfaces.DrawStore ): interfaces.DrawStore {
	const store = _.cloneDeep( drawStore )

	store.panels.map( resolvePanel )

	function resolvePanel( panel, panelIndex ) {
		panel.elements.map( resolveElement( panelIndex ) )
	}
	function resolveElement( panelIndex ) {
		return ( element, elementIndex ) => {
			const { __instance__ } = element
			if ( ! _.isNil( __instance__ ) ) {
				const instanceFields = Object.keys( __instance__ )
				const intersectionFields = _.intersection( instanceFields, storeElementFields )
				intersectionFields.map( setField( panelIndex, elementIndex ) )
			}
		}
	}
	function setField( panelIndex, elementIndex ) {
		return field => {
			store.panels[ panelIndex ][ 'elements' ][ elementIndex ][ field ] = store.panels[ panelIndex ][ 'elements' ][ elementIndex ]['__instance__'][ field ]
		}
	}
	return store
}