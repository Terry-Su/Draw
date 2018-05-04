export function isFirst( index: number ) {
	return index === 0
}

export const notFirst = ( index: number ) => ! isFirst( index )

export function isLast( index: number, array: any[] ) {
	return index === array.length - 1
}

export const notLast = ( index: number, array: any[] ) => ! isLast( index, array )


export function isFirstElement( element: any, index: number ) {
	return isFirst( index )
}

export const notFirstElement = ( element: any, index: number ) => ! isFirstElement( element, index )

export function isLastElement( element: any, index: number, array: any[] ) {
	return isLast( index, array )
}

export const notLastElement = ( element: any, index: number, array: any[] ) => ! isLastElement( element, index, array )
