// utility functions:

// squareToFileRank() : convert a square name (eg 'c4') to [file, rank]
// note: beyond 26 columns, we run out of alpha characters, which are followed by '{', '|', '}', '~', DEL , and then we need to use weird utf-16 characters ...
// (I suppose we could implement a system like Excel's column numbering, going to 'aa' after 'z' ...)

export function squareToFileRank (square) {
	let alphaNumSplit = square.match(/(\d+|[^\d]+)/g);
	let file = alphaNumSplit[0].toLowerCase().charCodeAt(0)-97;
	let rank = Number(alphaNumSplit[1])-1;
	return([file, rank]);
}

// fileRankToSquare() : convert file, rank to a square name
export function fileRankToSquare (file, rank) {
	return String.fromCharCode(97 + file) + (1+rank);
}

// export { squareToFileRank, fileRankToSquare };