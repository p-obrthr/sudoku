import './App.css';
import { useState } from 'react';

function App() {

	const matrix = [ 
		[5, 3, -1, -1, 7, -1, -1, -1, -1],
		[6, -1, -1, 1, 9, 5, -1, -1, -1],
		[-1, 9, 8, -1, -1, -1, -1, 6, -1],
		[8, -1, -1, -1, 6, -1, -1, -1, 3],
		[4, -1, -1, 8, -1, 3, -1, -1, 1],
		[7, -1, -1, -1, 2, -1, -1, -1, 6],
		[-1, 6, -1, -1, -1, -1, 2, 8, -1],
		[-1, -1, -1, 4, 1, 9, -1, -1, 5],
		[-1, -1, -1, -1, 8, -1, -1, 7, 9]
	];

	const [sudokuArr, setSudokuArr] = useState(getDeepCopy(matrix));

	function getDeepCopy(arr) {
		return JSON.parse(JSON.stringify(arr));
	}

  	function onInputChange(e, row, col) {
		var val = parseInt(e.target.value) || -1, grid = getDeepCopy(sudokuArr);
		if (val === -1 || val >= 1 && val <= 9) {
			grid[row][col] = val;
		}
	setSudokuArr(grid);
  	}

	function solve() {
		if (solveSudoku(0, 0)) {
		  	setSudokuArr([...sudokuArr]);
		} else {
		  	alert("no solution");
		}
	}
	  
	function solveSudoku(row, col) {
		if (row === 9) {
			return true;
		}
	  
	if (sudokuArr[row][col] !== -1) {
			return col === 8 ? solveSudoku(row + 1, 0) : solveSudoku(row, col + 1);
	}
	  
	for (let num = 1; num <= 9; num++) {
		if (isValidMove(row, col, num)) {
			sudokuArr[row][col] = num;
	  
			if (col === 8 ? solveSudoku(row + 1, 0) : solveSudoku(row, col + 1)) {
			  return true;
			}
	  
			sudokuArr[row][col] = -1;
		  }
		}
	  
		return false;
	  }
	  
	function isValidMove(row, col, num) {
		for (let i = 0; i < 9; i++) {
		  if (sudokuArr[row][i] === num || sudokuArr[i][col] === num) {
			return false;
		  }
		}
	  
		const startRow = Math.floor(row / 3) * 3;
		const startCol = Math.floor(col / 3) * 3;
		for (let i = startRow; i < startRow + 3; i++) {
		  for (let j = startCol; j < startCol + 3; j++) {
			if (sudokuArr[i][j] === num) {
			  return false;
			}
		  }
		}
	  
		return true;
	  }

	function reset() {
		setSudokuArr(getDeepCopy(matrix));
	}
	  
return (
	<div className="App">
	  <div className="App-header">
		<h3>let's solve your sudoku:</h3>
		<table>
		  <tbody>
			{
			  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) =>  {
				return <tr key={rIndex} className={(row + 1) %3 === 0 ? 'bBorder' : ''}>
				  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
					return <td key={rIndex + cIndex} className={(col + 1) %3 === 0 ? 'rBorder' : ''}>
					  <input onChange={(e) => onInputChange(e, row, col)} 
					  value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
					  className = "cellInput"
					  disabled={matrix[row][col] !== -1}
					  />
					</td>
				  })}
				</tr>
			  })
			}
		  </tbody>
		</table>
		<div className="buttonContainer">
			<button className="button-30" onClick={solve}>solve</button>
			<button className="button-30" onClick={reset}>reset</button>
	  </div>
	  </div>
	</div>
  );
}

export default App;
