import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

class LoadSudoku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solved: false,
      size: props.size,
      grid: props.sudoku,
      gridActive: JSON.parse(JSON.stringify(props.sudoku)),
      gridSolution: props.solution,
    };
  }

  showSolution() {
    this.setState({
      solved: true,
      grid: this.state.gridSolution,
    });
  }

  handleInputChange(row, column, e) {
    let temp = this.state.gridActive;
    temp[row][column] = parseInt(e.target.value);
    if (JSON.stringify(temp) === JSON.stringify(this.state.gridSolution)) {
      this.setState({
        solved: true,
        grid: this.state.gridSolution,
      });
      alert("You have solved the sudoku!");
    } else {
      this.setState({
        gridActive: temp,
      });
    }
  }

  cell(row, column, size, n) {
    let value = this.state.grid[row][column];
    if (value === 0) {
      return (
        <td class={size}>
          <input
            type="number"
            min="1"
            max={n}
            step="1"
            onChange={(e) => {
              this.handleInputChange(row, column, e);
            }}
          ></input>
        </td>
      );
    } else {
      return (
        <td class={size} style={{ height: "44px", width: "44px" }}>
          {value}
        </td>
      );
    }
  }

  row(row, size, n) {
    const items = [];
    for (let i = 0; i < n; i++) {
      items.push(this.cell(row, i, size, n));
    }
    return <tr class={size}>{items}</tr>;
  }

  table(size) {
    let n = size * size;
    const items = [];
    for (let i = 0; i < n; i++) {
      items.push(this.row(i, size, n));
    }
    return (
      <table>
        <tbody>{items}</tbody>
      </table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Card.Body>{this.table(this.state.size)}</Card.Body>
        <Card.Body>
          <div className="text-center">
            <ButtonGroup>
              {this.state.solved ? null : (
                <Button
                  onClick={() => {
                    this.showSolution();
                  }}
                >
                  Show solution
                </Button>
              )}
              <Button onClick={this.props.showHome}>Return to main menu</Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </React.Fragment>
    );
  }
}

export default LoadSudoku;
