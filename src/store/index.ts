


export function getDefaultDrawExportFileName(): string {
	return `drawData-${ getCurrentTimeString() }`
}

function getCurrentTimeString(): string {
	const now: Date = new Date()

	return `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() }-${ now.getHours() }-${ now.getMinutes() }-${ now.getSeconds() }`
}
