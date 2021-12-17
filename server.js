#!/usr/bin/env node
// const yargs = require('yargs/yargs')
// const { hideBin } = require('yargs/helpers')
// const argv = yargs(hideBin(process.argv)).argv
const { exec } = require('child_process')
let config=require('./app.json')[process.env.NODE_ENV || 'dev'];
// console.log(process.env.NODE_ENV, config)

exec(config.command, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.log('run command end', config.command)
});
