import React from 'react'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ular: [],
      tikus: [],
      status: 0,
      direction: 39,
      notif: ""
    };

  }

  moveTikus() {
    const x = parseInt(Math.random() * this.numCells);
    const y = parseInt(Math.random() * this.numCells);
    this.setState({ tikus: [x, y] });
  }

  setDirection(keyCode) {
    let changeDirection = true;
    [[38, 40], [37, 39]].forEach(dir => {
      if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
        changeDirection = false;
      }
    });

    if (changeDirection) this.setState({ direction: keyCode });
  }

  moveUlar() {
    const newUlar = [];
    if(this.state.direction == 40 || this.state.direction == 83){
      newUlar[0] = [this.state.ular[0][0], this.state.ular[0][1] + 1];
    }else if(this.state.direction == 39 || this.state.direction == 68){
      newUlar[0] = [this.state.ular[0][0] + 1, this.state.ular[0][1]];
    }else if(this.state.direction == 38 || this.state.direction == 87){
      newUlar[0] = [this.state.ular[0][0], this.state.ular[0][1] - 1];
    }else if(this.state.direction == 37 || this.state.direction == 65 ){
      newUlar[0] = [this.state.ular[0][0] - 1, this.state.ular[0][1]];
    }else {
      console.log("")
    }

    newUlar.push.apply(
      newUlar,
      this.state.ular.slice(1).map((s, i) => {
        return this.state.ular[i];
      })
    );

    this.setState({ ular: newUlar });

    this.makanTikus(newUlar);
    if (!this.isValid(newUlar[0])){
      this.setState({
        notif: "Tabrak tembok cuy 🤣🤣🤣"
      })
      this.endGame()
    } else if (!this.doesntOverlap(newUlar)) {
      this.setState({
        notif: "Badan sendiri kok dimakan 🤣🤣🤣"
      })
      this.endGame()
    } 
  }

  makanTikus(newUlar) {
    if (!this.shallowEquals(newUlar[0], this.state.tikus)) return
      let newUlarSegment;
      const lastSegment = newUlar[newUlar.length - 1];

      let lastPositionOptions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
      
      if ( newUlar.length > 1 ) {
        lastPositionOptions[0] = this.arrayDiff(lastSegment, newUlar[newUlar.length - 2]);
      }

      for (var i = 0; i < lastPositionOptions.length; i++) {
        newUlarSegment = [
          lastSegment[0] + lastPositionOptions[i][0],
          lastSegment[1] + lastPositionOptions[i][1]
        ];
        if (this.isValid(newUlarSegment)) {
          break;
        }
      }

      this.setState({
        ular: newUlar.concat([newUlarSegment]),
        tikus: []
      });
    this.moveTikus();
  }
  
  isValid(cell) {
    return (
      cell[0] > -1 &&
      cell[1] > -1 &&
      cell[0] < this.numCells &&
      cell[1] < this.numCells
    );
  }

  doesntOverlap(ular) {
    return (
      ular.slice(1).filter(data => {
        return this.shallowEquals(ular[0], data);
      }).length === 0
    );
  }

  startGame(mode) {
    this.moveSnakeInterval = setInterval( () => this.moveUlar(), mode);
    this.moveTikus();

    this.setState({
      status: 1,
      ular: [[10, 20]],
      tikus: [25, 20]
    });
    this.el.focus();
  }
  
  endGame(){
    this.removeTimers();
    this.setState({
      status : 2,
      direction: 39
    })
  }

  GridCell(tikusCell,ularCell,size,key) {
    const classes = `grid-cell 
  ${tikusCell ? "grid-cell--tikus" : ""} 
  ${ularCell ? "grid-cell--ular" : ""}
  `;
    return (
      <div
        className={classes}
        style={{ height: size + "px", width: size + "px" }}
        />
    );
  }

  arrayDiff(arr1, arr2){
    return arr1.map((a, i)=>{ 
      return a - arr2[i]
    })
  }

  shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    let equals = true;
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) equals = false;
    }
    return equals;
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
  }

  render() {
    this.numCells = Math.floor( 500 / 10);
    const cellSize = 500 / this.numCells;
    const cellIndexes = Array.from(Array(this.numCells).keys());
    const cells = cellIndexes.map(y => {
      return cellIndexes.map(x => {
        const foodCell = this.state.tikus[0] === x && this.state.tikus[1] === y;
        let snakeCell = this.state.ular.filter(c => c[0] === x && c[1] === y);
        snakeCell = snakeCell.length && snakeCell[0];
        return (
          <>{this.GridCell(foodCell,snakeCell,cellSize,x + " " + y)}</>
        );
      });
    });

    let overlay;
    if (this.state.status === 0) {
      overlay = (
        <div className="ular-app__overlay">
          <button onClick={ () => this.startGame(200)}>Mode Noob</button>
          <button onClick={ () => this.startGame(150)}>Mode Normal</button>
          <button onClick={ () => this.startGame(120)}>Mode Hard</button>
          <button onClick={ () => this.startGame(80)}>Mode Pro</button>
          <button onClick={ () => this.startGame(25)}>Mode God</button>
        </div>
      );
    } else if (this.state.status === 2) {
      overlay = (
        <div className="ular-app__overlay">
          <div className="mb-1"><b>{ this.state.notif }</b></div>
          <div className="mb-1">Your score: {this.state.ular.length} </div>
          <button onClick={ () => this.startGame(200)}>Mode Noob</button>
          <button onClick={ () => this.startGame(150)}>Mode Normal</button>
          <button onClick={ () => this.startGame(120)}>Mode Hard</button>
          <button onClick={ () => this.startGame(80)}>Mode Pro</button>
          <button onClick={ () => this.startGame(25)}>Mode God</button>
        </div>
      );
    }
    return (
      <div>
        <h1>Ular-ularan</h1>
        <h3>Score: { this.state.ular.length }</h3>
        <div
          className="ular-app"
          onKeyDown={ (e) => e.keyCode == 40 || e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 83 || e.keyCode == 68 || e.keyCode == 87 || e.keyCode == 65 ? this.setDirection(e.keyCode) : null }
          style={{
            width: "500px",
            height: "500px"
          }}
          ref={el => (this.el = el)}
          tabIndex={-1}
          >
          {overlay}
          <div
            className="grid"
            style={{
              width: "500px",
              height: "500px"
            }}
            >
            {cells}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
