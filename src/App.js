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
return (
	<div className="App">
	  <header className="App-header">
		<table>
		  <tbody>
			{
			  [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) =>  {
				return <tr key={rIndex}>
				  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
					return <td key={rIndex + cIndex}>
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
	  </header>
	</div>
  );
}

export default App;
