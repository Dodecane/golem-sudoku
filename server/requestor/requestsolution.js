const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { Engine, Task, utils, vm } = require("yajsapi");
const { program } = require("commander");

dayjs.extend(duration);

const { asyncWith, logUtils } = utils;

const grid2 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const grid2filled = [
  [2, 3, 0, 4],
  [1, 4, 0, 0],
  [4, 0, 0, 0],
  [0, 0, 0, 0],
];

/*
var grid = [];
for (let i = 0; i < 25; i++) {
  let row = [];
  for (let j = 0; j < 25; j++) {
    row.push(0);
  }
  grid.push(row);
}
*/

const grid5 = [
  [0, 0, 0, 0, 0, 0, 1, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 3, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 9, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 6, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 4, 8, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 3, 4, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 9, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

async function main(subnetTag, grid) {
  const size = Math.sqrt(grid.length);
  const _package = await vm.repo(
    "0b9c6291be9c3fd5887d008daed83422c99e71dfda85ecf5164be7bb",
    2.0,
    2.0
  );

  async function* worker(ctx, tasks) {
    for await (let task of tasks) {
      const output_file = "solution.json";
      ctx.send_json("/golem/work/input.json", {
        size: size,
        grid: grid,
      });
      let commands = ["-c", `node /golem/entrypoints/solver.js`];
      ctx.run("/bin/sh", commands);
      ctx.download_file(
        "/golem/output/output.json",
        path.join(__dirname, "./solution.json")
      );
      yield ctx.commit();
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      task.accept_task(output_file);
    }
    ctx.log("Solution has been obtained");
    return;
  }

  const combinations = [1];
  const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    await new Engine(
      _package,
      1,
      timeout,
      "10.0",
      undefined,
      subnetTag,
      logUtils.logSummary()
    ),
    async (engine) => {
      for await (let task of engine.map(
        worker,
        combinations.map((combi) => new Task(combi))
      )) {
        console.log("result =", task.output());
      }
    }
  );
  const output = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./solution.json"))
  );
  return output;
}

program
  .option("--subnet-tag <subnet>", "set subnet name", "community.3")
  .option("-d, --debug", "output extra debugging");
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}
console.log(`Using subnet: ${program.subnetTag}`);

function solve(grid) {
  return main(program.subnetTag, grid);
}

export default solve;
