import './App.css';

function App() {
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
                      <input className = "cellInput"/>
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
