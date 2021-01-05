const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { Engine, Task, utils, vm } = require("yajsapi");
const { program } = require("commander");

dayjs.extend(duration);

const { asyncWith, logUtils } = utils;

async function main(subnetTag, configs) {
  var output = [];
  const _package = await vm.repo(
    "0b9c6291be9c3fd5887d008daed83422c99e71dfda85ecf5164be7bb",
    2.0,
    2.0
  );

  async function* worker(ctx, tasks) {
    for await (let task of tasks) {
      const values = task.data();
      const output_file = `puzzle.json`;
      ctx.send_json("/golem/work/input.json", {
        size: values.size,
        difficulty: values.difficulty,
      });
      let commands = ["-c", `node /golem/entrypoints/generator.js`];
      ctx.run("/bin/sh", commands);
      ctx.download_file(
        "/golem/output/output.json",
        path.join(__dirname, `./puzzle.json`)
      );
      yield ctx.commit();
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      output.push(
        JSON.parse(fs.readFileSync(path.join(__dirname, "./puzzle.json")))
      );
      task.accept_task(output_file);
    }
    ctx.log("Puzzles have been generated");
    return;
  }

  /*
  const configs = [
    [2, 3],
    [3, 3],
    [4, 2],
    [5, 1],
  ];
  */
  const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    await new Engine(
      _package,
      configs.length,
      timeout,
      "10.0",
      undefined,
      subnetTag,
      logUtils.logSummary()
    ),
    async (engine) => {
      for await (let task of engine.map(
        worker,
        configs.map(
          (config) =>
            new Task({
              size: config[0],
              difficulty: config[1],
            })
        )
      )) {
        console.log("result =", task.output());
      }
    }
  );
  return output;
}

//Only needs to be defined once
/*
program
  .option("--subnet-tag <subnet>", "set subnet name", "community.3")
  .option("-d, --debug", "output extra debugging");
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}
console.log(`Using subnet: ${program.subnetTag}`);
*/

function solve(configs) {
  return main(program.subnetTag, configs);
}

export default solve;
