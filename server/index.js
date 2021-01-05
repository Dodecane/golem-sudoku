import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import solve from "./requestor/requestsolution";
import generate from "./requestor/requestpuzzle";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.resolve("./build/index.html"));
});

app.post("/solve", function (req, res) {
  var grid = req.body.grid;
  solve(grid).then(function (result) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  });
});

app.post("/fetch", function (req, res) {
  var size = req.body.size;
  var difficulty = req.body.difficulty;
  var puzzleArray = JSON.parse(
    fs.readFileSync(
      `./puzzles/${size.toString()}_${difficulty.toString()}.json`
    )
  );
  var result = {
    loaded: false,
  };
  if (puzzleArray.length !== 0) {
    result.loaded = true;
    result.puzzle = puzzleArray.shift();
    fs.writeFileSync(
      `./puzzles/${size.toString()}_${difficulty.toString()}.json`,
      JSON.stringify(puzzleArray)
    );
    generate([[size, difficulty]]).then(function (result) {
      puzzleArray.push(result[0]);
      fs.writeFileSync(
        `./puzzles/${size.toString()}_${difficulty.toString()}.json`,
        JSON.stringify(puzzleArray)
      );
    });
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});

app.use(express.static("./build"));

app.listen(PORT, () => {
  pregeneratePuzzles();
  console.log(`Server is listening on port ${PORT}`);
});

function pregeneratePuzzles() {
  if (JSON.parse(fs.readFileSync("./puzzles/2_1.json")).length === 0) {
    generate([
      [2, 1],
      [2, 1],
      [2, 1],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/2_1.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/2_2.json")).length === 0) {
    generate([
      [2, 2],
      [2, 2],
      [2, 2],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/2_2.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/2_3.json")).length === 0) {
    generate([
      [2, 3],
      [2, 3],
      [2, 3],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/2_3.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/3_1.json")).length === 0) {
    generate([
      [3, 1],
      [3, 1],
      [3, 1],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/3_1.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/3_2.json")).length === 0) {
    generate([
      [3, 2],
      [3, 2],
      [3, 2],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/3_2.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/3_3.json")).length === 0) {
    generate([
      [3, 3],
      [3, 3],
      [3, 3],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/3_3.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/4_1.json")).length === 0) {
    generate([
      [4, 1],
      [4, 1],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/4_1.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/4_2.json")).length === 0) {
    generate([
      [4, 2],
      [4, 2],
    ]).then(function (result) {
      fs.writeFileSync("./puzzles/4_2.json", JSON.stringify(result));
    });
  }
  if (JSON.parse(fs.readFileSync("./puzzles/5_1.json")).length === 0) {
    generate([[5, 1]]).then(function (result) {
      fs.writeFileSync("./puzzles/5_1.json", JSON.stringify(result));
    });
  }
}
