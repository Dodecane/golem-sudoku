import React, { Component } from "react";
import LoadSudoku from "./LoadSudoku";
import SolveSudoku from "./SolveSudoku";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Logo from "./golem_sudoku_logo.svg";
import "./App.css";
const axios = require("axios").default;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHome: true,
      showSolveOptions: false,
      showPuzzleOptions: false,
      showSolve: false,
      showPuzzle: false,
      size: 3,
      difficulty: 1,
    };
  }

  showHome = () => {
    this.setState({
      showHome: true,
      showSolveOptions: false,
      showPuzzleOptions: false,
      showSolve: false,
      showPuzzle: false,
    });
  };

  showSolve() {
    this.setState({
      showHome: false,
      showSolveOptions: false,
      showPuzzleOptions: false,
      showSolve: true,
      showPuzzle: false,
    });
  }

  showPuzzle() {
    var self = this;
    axios
      .post("/fetch", {
        size: this.state.size,
        difficulty: this.state.difficulty,
      })
      .then(function (res) {
        if (!res.data.loaded) {
          alert(
            "Sudokus are still being generated, please try again in a while"
          );
        } else {
          console.log("Puzzle received");
          console.log(res.data);
          self.setState({
            showHome: false,
            showSolveOptions: false,
            showPuzzleOptions: false,
            showSolve: false,
            showPuzzle: true,
            sudoku: res.data.puzzle.sudoku,
            solution: res.data.puzzle.solution,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  showSolveOptions() {
    this.setState({
      showHome: true,
      showSolveOptions: true,
      showPuzzleOptions: false,
      showSolve: false,
      showPuzzle: false,
      size: 3,
    });
  }

  showPuzzleOptions() {
    this.setState({
      showHome: true,
      showSolveOptions: false,
      showPuzzleOptions: true,
      showSolve: false,
      showPuzzle: false,
      size: 3,
      difficulty: 1,
    });
  }

  setSize(e) {
    this.setState({
      size: parseInt(e.target.value),
      difficulty: 1,
    });
  }

  setDifficulty(e) {
    this.setState({
      difficulty: parseInt(e.target.value),
    });
  }

  getDifficultyOptions() {
    if (this.state.size === 2 || this.state.size === 3) {
      return (
        <Form.Control
          as="select"
          custom
          onChange={(e) => {
            this.setDifficulty(e);
          }}
          value={this.state.difficulty}
        >
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </Form.Control>
      );
    } else if (this.state.size === 4) {
      return (
        <Form.Control
          as="select"
          custom
          onChange={(e) => {
            this.setDifficulty(e);
          }}
          value={this.state.difficulty}
        >
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </Form.Control>
      );
    } else if (this.state.size === 5) {
      return (
        <Form.Control
          as="select"
          custom
          onChange={(e) => {
            this.setDifficulty(e);
          }}
          value={this.state.difficulty}
        >
          <option value="1">Hard</option>
        </Form.Control>
      );
    }
  }

  render() {
    return (
      <Container fluid>
        <h1
          style={{ lineHeight: "9.2rem", color: "white", textAlign: "center" }}
        >
          <img
            src={Logo}
            alt="Golem Sudoku Logo"
            style={{ height: "4.6rem" }}
          />{" "}
          Golem Sudoku
        </h1>
        <Card
          style={{ width: "fit-content" }}
          className="centered align-items-center"
        >
          {this.state.showHome ? (
            <Card.Body>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    this.showPuzzleOptions();
                  }}
                >
                  Play
                </Button>
                <Button
                  onClick={() => {
                    this.showSolveOptions();
                  }}
                >
                  Solve
                </Button>
              </ButtonGroup>
            </Card.Body>
          ) : null}
          {this.state.showPuzzleOptions ? (
            <Card.Body style={{ width: "24rem" }}>
              <Form>
                <Form.Group>
                  <Form.Row>
                    <Form.Label>Select sudoku size</Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        custom
                        onChange={(e) => {
                          this.setSize(e);
                        }}
                        value={this.state.size}
                      >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Form.Control>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label>Select sudoku difficulty</Form.Label>
                    <Col>{this.getDifficultyOptions()}</Col>
                  </Form.Row>
                </Form.Group>
                <div className="text-center">
                  <Button
                    onClick={() => {
                      this.showPuzzle();
                    }}
                  >
                    Ok
                  </Button>
                </div>
              </Form>
            </Card.Body>
          ) : null}
          {this.state.showSolveOptions ? (
            <Card.Body style={{ width: "24rem" }}>
              <Form>
                <Form.Group>
                  <Form.Row>
                    <Form.Label>Select sudoku size</Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        custom
                        onChange={(e) => {
                          this.setSize(e);
                        }}
                        value={this.state.size}
                      >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Form.Control>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <div className="text-center">
                  <Button
                    onClick={() => {
                      this.showSolve();
                    }}
                  >
                    Ok
                  </Button>
                </div>
              </Form>
            </Card.Body>
          ) : null}
          {this.state.showSolve ? (
            <Card.Body>
              <SolveSudoku size={this.state.size} showHome={this.showHome} />
            </Card.Body>
          ) : null}
          {this.state.showPuzzle ? (
            <Card.Body>
              <LoadSudoku
                size={this.state.size}
                sudoku={this.state.sudoku}
                solution={this.state.solution}
                showHome={this.showHome}
              />
            </Card.Body>
          ) : null}
        </Card>
      </Container>
    );
  }
}

export default App;
