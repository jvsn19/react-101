import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {  
  return (
    <button 
      className="square" 
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
              value = { this.props.squares[i] }
              onClick = {() => {
                // This this.props.onClick(i) is the Game.handleClick(i) function
                this.props.onClick(i)
              }}
            />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: Array({
        squares: Array(9).fill(null),
        player: 'X',
      }),
      step_number: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.step_number + 1)
    const last_movement = history[history.length - 1]
    const squares = last_movement.squares.slice()
    const player = last_movement.player

    if(calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = player

    this.setState({
      history: history.concat({
        squares: squares,
        player: player === 'X' ? 'O' : 'X',
      }),
      step_number: history.length
    })
  }

  jumpTo(step) {
    this.setState({
      step_number: step,
    })
  }

  render() {
    const history = this.state.history
    const curr_history = history[this.state.step_number] 
    const squares = curr_history.squares
    const player = curr_history.player
    const winner = calculateWinner(squares)

    const status  = winner ? `Winner: ${winner}` : `Current Player: ${player}`

    const moves = history.slice(0, this.state.step_number + 1).map((previous_board, move) => {
      const descr = move ?  `Player ${previous_board.player}` : 'Reset Game'
      return(
        <li key = {move}>
          <button onClick = {() => this.jumpTo(move)}> { descr } </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          {/* When render Board, we call Board's render() method and add to it props.squares = squares and props.onClick = a function that receives an i and call the handleClick(i) function */}
          <Board 
            squares = {squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}