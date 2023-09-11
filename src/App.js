import './App.css';
import { useState, useEffect } from 'react';

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

	const defaultMatrix = [ 
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1]
	];

	const [sudokuArr, setSudokuArr] = useState(getDeepCopy(defaultMatrix));
	const [solved, setSolved] = useState(false);
	const [isExampleSet, setIsExampleSet] = useState(false);

	useEffect(() => {
		setSolved(false); 
	  }, [sudokuArr]);

	function getDeepCopy(arr) {
		return JSON.parse(JSON.stringify(arr));
	}

	function fillExampleMatrix() {
		setSudokuArr(getDeepCopy(matrix));
		setIsExampleSet(true);
	}	

	function fillRandomMatrix() {
		let randomMatrix = [ 
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1]
		];

		let i = 0;
		while (i<20) {
			const row = Math.floor(Math.random() * 9);
      		const col = Math.floor(Math.random() * 9);
			const num = Math.floor(Math.random() * 9)+1;
			if(randomMatrix[row][col] === -1 & 
				isValidInRow(randomMatrix, row, num) &&
				isValidInCol(randomMatrix, col, num) &&
				isValidInBox(randomMatrix, row, col, num)
			) {
				randomMatrix[row][col] = num;
				i++;
			}
		}

		setSudokuArr(randomMatrix);
   
	}

	function isValidInRow(board, row, num) {
		return !board[row].includes(num);
	  }

	function isValidInCol(board, col, num) {
		for (let i = 0; i < 9; i++) {
		  if (board[i][col] === num) {
			return false;
		  }
		}
		return true;
	  }

	function isValidInBox(board, row, col, num) {
		const boxStartRow = Math.floor(row / 3) * 3;
		const boxStartCol = Math.floor(col / 3) * 3;
		for (let i = boxStartRow; i < boxStartRow + 3; i++) {
		  for (let j = boxStartCol; j < boxStartCol + 3; j++) {
			if (board[i][j] === num) {
			  return false;
			}
		  }
		}
		return true;
	  }

  	function onInputChange(e, row, col) {
		if (!solved && !isExampleSet) {
		  const val = parseInt(e.target.value) || -1;
		  if (val === -1 || (val >= 1 && val <= 9)) {
			const updatedSudoku = getDeepCopy(sudokuArr);
			updatedSudoku[row][col] = val;
			setSudokuArr(updatedSudoku);
		  }
		}
	  }

	function solve() {
		const inputs = document.querySelectorAll(".cellInput");
  		inputs.forEach((input) => {
		const row = parseInt(input.getAttribute("data-row"));
		const col = parseInt(input.getAttribute("data-col"));
		if (sudokuArr[row][col] !== -1) {
			input.setAttribute("disabled", "true");
		}
	});
		if (solveSudoku(0, 0)) {
			setSolved(true);
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
		const inputs = document.querySelectorAll(".cellInput");
  		inputs.forEach((input) => {
    	input.removeAttribute("disabled");
 		});
		setSudokuArr(getDeepCopy(defaultMatrix));
		setSolved(false); 
	}
	  
return (
	<div className="App">
	  <div className="App-header">
		<h3>sudoku:</h3>
		<table>
		  <tbody>
			{
			  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) =>  {
				return <tr key={rIndex} className={(row + 1) %3 === 0 ? 'bBorder' : ''}>
				  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
					return <td key={rIndex + cIndex} className={(col + 1) %3 === 0 ? 'rBorder' : ''}>
					  <input 
					  onChange={(e) => onInputChange(e, row, col)} 
					  value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
					  className = "cellInput"
					  data-row={row}
                      data-col={col}
					  /* disabled={(isExampleSet && matrix[rIndex][cIndex] !== -1) || solved} */
					  />
					</td>
				  })}
				</tr>
			  })
			}
		  </tbody>
		</table>
		<div className="buttonContainer">
			<button className="button-30" onClick={fillExampleMatrix}>example</button>
			<button className="button-30" onClick={fillRandomMatrix}>random</button>
			<button className="button-30" onClick={solve}>solve</button>
			<button className="button-30" onClick={reset}>reset</button>
	  </div>
	  </div>
	</div>
  );
}

export default App;
