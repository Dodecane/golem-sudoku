import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
const axios = require("axios").default;

class SolveSudoku extends Component {
  constructor(props) {
    super(props);
    let size = props.size;
    let n = size * size;
    let grid = [];
    for (let i = 0; i < n; i++) {
      let row = [];
      for (let j = 0; j < n; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    this.state = {
      loading: false,
      size: size,
      grid: grid,
    };
  }

  sendPuzzle() {
    console.log("Sending puzzle");
    console.log(this.state.grid);
    this.setState({
      loading: true,
    });
    var self = this;
    axios
      .post("/solve", {
        grid: this.state.grid,
      })
      .then(function (res) {
        console.log("Solution received");
        console.log(res.data);
        if (res.data.solved) {
          self.setState({
            loading: false,
            grid: res.data.solutions[0],
          });
        } else {
          self.setState({
            loading: false,
          });
          alert("No solutions available");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleInputChange(row, column, e) {
    let temp = this.state.grid;
    temp[row][column] = parseInt(e.target.value);
    this.setState({
      grid: temp,
    });
  }

  cell(row, column, size, n) {
    return (
      <td class={size}>
        <input
          type="number"
          min="0"
          max={n}
          step="1"
          value={this.state.grid[row][column]}
          onChange={(e) => {
            this.handleInputChange(row, column, e);
          }}
        ></input>
      </td>
    );
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
              <Button
                disabled={this.state.loading}
                onClick={() => {
                  this.sendPuzzle();
                }}
              >
                {this.state.loading
                  ? "Solving... (usually takes between 30 seconds and 5 minutes)"
                  : "Solve"}
              </Button>
              <Button onClick={this.props.showHome}>Return to main menu</Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </React.Fragment>
    );
  }
}

export default SolveSudoku;
