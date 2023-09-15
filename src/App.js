import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useEffect, useRef } from 'react';

function App() {
	const defaultMatrix = Array.from({ length: 9 }, () => Array(9).fill(-1));

	const [sudokuArr, setSudokuArr] = useState(getDeepCopy(defaultMatrix));
	const [solved, setSolved] = useState(false);
	const [difficulty, setDifficulty] = useState("easy");
	const [openSelect, setOpenSelect] = useState(false);
	const [time, setTime] = useState(0);
	const [timerOn, setTimerOn] = useState(false);

	const leageInput = useRef();

	useEffect(() => {
		setSolved(false); 
	  }, [sudokuArr]);

	useEffect(() => {
		let interval = null;
	
		if (timerOn) {
		  interval = setInterval(() => {
			setTime((prevTime) => prevTime + 10);
		  }, 10);
		} else if (!timerOn) {
		  clearInterval(interval);
		}
	
		return () => clearInterval(interval);
	  }, [timerOn]);

	function getDeepCopy(arr) {
		return JSON.parse(JSON.stringify(arr));
	}

	function fillRandomMatrix() {
		if (solved) {
			return;
		}

		reset();

		let randomMatrix = getDeepCopy(defaultMatrix);
		const matrixSize = 3;
		let x = 0;


		for(let r=0; r<2; r++) {
			let numbers = shuffleArray([1,2,3,4,5,6,7,8,9]);
			for(let row=x; row <matrixSize; row++) {
				for(let col=x; col <matrixSize; col++) {
					randomMatrix[row][col] = numbers.shift();
				}
			}
			x += matrixSize;
		}

		let d = 0;
		switch (difficulty) {
			case "easy":
				d = 20;
				break;
			case "medium":
				d = 40;
				break;
			case "hard":
				d = 60;
				break;
			default:
				d = 20; 
				break;
		}
		randomMatrix = deleteNumbers(matrixSolve(randomMatrix), d); 

		setSudokuArr(randomMatrix);
		setTimerOn(true)
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
			
	function matrixSolve(matrix) {
		  
		function back() {
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (matrix[row][col] === -1) {
						for (let num = 1; num <= 9; num++) {
					  		if (isValidMove(matrix, row, col, num)) {
								matrix[row][col] = num;
								if (back()) {
						  			return true;
								}
								matrix[row][col] = -1;
					  		}
						}
						return false;
				  	}
				}
			}
			return true; 
		}
		
		if (back()) {
			return matrix;
		} 
		  
	}
		  
	function deleteNumbers (sudoku, count) {
		for(let i=0; i<count; i++) {

			while(true) {
				let row = Math.floor(Math.random() * 9);
				let col = Math.floor(Math.random() * 9);
				if (sudoku[row][col] !== -1) {
					sudoku[row][col] = -1;
					break;
				}
			}
		}
		return sudoku;
	}
   
	

  	function onInputChange(e, row, col) {
		if (!solved) {
		  const val = parseInt(e.target.value) || -1;
		  if (val === -1 || (val >= 1 && val <= 9)) {
			let updatedSudoku = getDeepCopy(sudokuArr);
			updatedSudoku[row][col] = val;
			setSudokuArr(updatedSudoku);
		  }
		}
	  }

	function solve() {
		if (solved) {
			return;
		}
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
			setTimerOn(false)
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
			if (isValidMove(sudokuArr, row, col, num)) {
				sudokuArr[row][col] = num;
				if (col === 8 ? solveSudoku(row + 1, 0) : solveSudoku(row, col + 1)) {
			  		return true;
				}
	  			sudokuArr[row][col] = -1;
		 	}
		}
		return false;
	}
	  
	function isValidMove(matrix, row, col, num) {

		for (let i = 0; i < 9; i++) {
		  if (matrix[row][i] === num || matrix[i][col] === num) {
			return false;
		  }
		}
	  
		const startRow = Math.floor(row / 3) * 3;
		const startCol = Math.floor(col / 3) * 3;
		for (let i = startRow; i < startRow + 3; i++) {
		  for (let j = startCol; j < startCol + 3; j++) {
			if (matrix[i][j] === num) {
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
		setTime(0);
	}

	function selectValue(e) {
		const selectedDifficulty = e.target.innerText;
		setDifficulty(selectedDifficulty);
		setOpenSelect(false);
	  }

	function openOption() {
		setOpenSelect(true);
	}
	  
return (
	<div className="App">
	  <div className="App-header">
		<h1>SUDOKU</h1>
		<table>
		  <tbody>
			{
			  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) =>  {
				return <tr key={rIndex} className={(row + 1) %3 === 0 && (row + 1) !== 9 ? 'bBorder' : ''}>
				  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
					return <td key={rIndex + cIndex} className={(col + 1) %3 === 0 && (col + 1) !== 9 ? 'rBorder' : ''}>
					  <input 
					  onChange={(e) => onInputChange(e, row, col)} 
					  value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
					  className = "cellInput"
					  data-row={row}
                      data-col={col}
					  /* disabled alternative */
					  />
					</td>
				  })}
				</tr>
			  })
			}
		  </tbody>
		</table>
		<div className="buttonContainer">
			<div class="btn-group btn-group-lg" role="group" aria-label="Large button group">
				
				<div class="btn-group" role="group" aria-label="Button group with nested dropdown"> 
					<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" onClick={openOption}>
						{difficulty}
					</button>
					<ul class={`dropdown-menu ${openSelect ? 'show' : ''}`}>
						<li><a class="dropdown-item" href="#" onClick={selectValue}>easy</a></li>
						<li><a class="dropdown-item" href="#" onClick={selectValue}>medium</a></li>
						<li><a class="dropdown-item" href="#" onClick={selectValue}>hard</a></li>
					</ul>
				</div>

				<button type="button" class="btn btn-outline-warning" onClick={fillRandomMatrix}>start</button>
				<button type="button" class="btn btn-outline-success" onClick={solve}>solve</button>
				<button type="button" class="btn btn-outline-danger" onClick={reset}>reset</button>

			</div>
	
			<div id="display">
				<span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
				<span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
     		 </div>
	 	 </div>
	  </div>
	</div>
  );

}

export default App;
