import { fileRankToSquare } from './utility.js';

// knightsTour(): attempt a single Knight's tour, using Warnsdorff's rule
// M = width (number of ranks), N = height (number of files)
// startFile and StartRank represent starting square, (0 to M-1, 0 to N-1 respectively)
// shuffleMoveOrder:  if true, randomize the order of Knight's moves searched

function knightsTour(M, N, startFile, startRank, shuffleMoveOrder = false) {

  let [centerHoriz, centerVert] = [M / 2, N / 2]; // geometric center of board

  // create a collection of unvisited squares:
  let unvisitedSquares=[];
  for(let m=0; m < M; m++) {
    for(let n=0; n < N; n++) {
      unvisitedSquares.push({file: m, rank: n});
    }
  }

  let knightsPath = [];
  let [currentFile, currentRank] = [startFile, startRank];

  do {
      /* eslint no-loop-func: off */ // (stfu, eslint !!)
    knightsPath.push(fileRankToSquare(currentFile,currentRank));
    unvisitedSquares = unvisitedSquares.filter(sq => currentFile !== sq.file || currentRank !== sq.rank); // visit (remove current square from unvistedSquares)
    let neighbors = getNeighbors(currentFile, currentRank, unvisitedSquares, shuffleMoveOrder);
    if(neighbors.length === 0) {
      break;
    }

    // select neighbors who themselves have the smallest number of neighbors:
    let neighborsOfNeighbors = neighbors.map((n) => getNeighbors(n.file, n.rank, unvisitedSquares.filter(unv => unv.file !== n.file || unv.rank !== n.rank)));
    let minDegree = neighborsOfNeighbors.reduce((a, n) => Math.min(a, n.length),8);
    let bestNeighbors = neighbors.filter((n, i) => neighborsOfNeighbors[i].length === minDegree);

    if(bestNeighbors.length > 1) { // tie-breaker

      bestNeighbors = bestNeighbors.sort((a,b)=>
        distanceTocenterSquared(b.file, b.rank, centerHoriz, centerVert) -
        distanceTocenterSquared(a.file, a.rank, centerHoriz, centerVert)
      ); // sort by distance to center
    }

    currentFile=bestNeighbors[0].file;
    currentRank=bestNeighbors[0].rank;

  } while(unvisitedSquares.length);

  return {
    knightsPath: knightsPath,
    unvisitedSquareCount: unvisitedSquares.length,
    success: !unvisitedSquares.length
  };
}

function getNeighbors(file, rank, unvisitedSquares, shuffleMoveOrder = false) {

  const knightMoves = [
    [1,2],
    [2,1],
    [2,-1],
    [1,-2],
    [-1,-2],
    [-2,-1],
    [-2,1],
    [-1,2]
  ];

  if (shuffleMoveOrder) { // randomly shuffle move-order
    let i = knightMoves.length, r;
    while (i > 1) {
      i -= 1;
      r = Math.floor(Math.random() * i);
      [knightMoves[i], knightMoves[r]] = [knightMoves[r], knightMoves[i]]; // exchange
    }
  }

  let neighbors = [];
  knightMoves.forEach(move => {
    let newSquare = {file: file + move[0], rank: rank + move[1]};
    if(unvisitedSquares.filter(unvisited => newSquare.file === unvisited.file && newSquare.rank === unvisited.rank).length) {
      neighbors.push(newSquare);
    }
  });

  return neighbors;
}

function distanceTocenterSquared(file, rank, centerHoriz, centerVert) {
  return Math.pow(0.5 + file - centerHoriz, 2) + Math.pow(0.5 + rank - centerVert, 2); // note: add 0.5 to get geometric center of each square
}

export { knightsTour };