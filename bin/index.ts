import simpleGit, { SimpleGit } from 'simple-git';
import dns from 'dns';
import ora from 'ora';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import { argv } from 'process';
import got from 'got';
import logUpdate from 'log-update';
import chalk from 'chalk';

updateNotifier({ pkg }).notify();

const git: SimpleGit = simpleGit();
const spinner = ora();
const url = `http://whatthecommit.com/index.txt`;
const arg = argv[2];

// chalk theme
const Error = chalk.bold.red;

if (arg) {
  if (arg === '-h' || arg === '--help') {
    console.log(`
      usage: wtc
    `);
  } else {
    logUpdate(Error(`Wtf are you even typing ${arg}`));
    process.exit(1);
  }
}

dns.lookup('whatthecommit.com', (err) => {
  if (err) {
    logUpdate(Error(`\Connect device to internet mofos!\n`));
    process.exit(1);
  } else {
    logUpdate();
    spinner.text = 'Fetching commit..\n';
    spinner.start();
  }
});

function handleAdd() {
  spinner.text = 'staging files.\n';
  spinner.start();
  spinner.succeed();
  spinner.stop();
}

function handleCommit() {
  spinner.text = 'committing files.\n';
  spinner.start();
  spinner.succeed();
  spinner.stop();
}

(async function gitAddCommit() {
  try {
    let { body } = await got(url);
    // replace line break at the end of body
    body = body.replace(/[\n\r]+ */g, '');

    spinner.succeed();
    spinner.stop();

    await git.add(['.'], handleAdd);
    await git.commit(body, handleCommit);

    logUpdate(chalk.yellowBright(`\ngit commit -m"${body}"\n`));
  } catch (error) {
    logUpdate(Error(`Wtf ! ${error}`));
    process.exit(1);
  }
})();
