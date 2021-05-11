import simpleGit, { SimpleGit } from 'simple-git';
import dns from 'dns';
import ora from 'ora';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import { argv } from 'process';
import got from 'got';
import logUpdate from 'log-update';

updateNotifier({ pkg }).notify();

const git: SimpleGit = simpleGit();
const spinner = ora();
const url = `http://whatthecommit.com/index.txt`;
const arg = argv[2];

if (arg) {
  if (arg === '-h' || arg === '--help') {
    console.log(`
      usage: wtc
    `);
  } else {
    console.log(`Unknown option ${arg}`);
    process.exit(0);
  }
}

// if (process.argv.length <= 2) {
//   console.log(`Unknown agrument`);
//   process.exit(0);
// }

dns.lookup('whatthecommit.com', (err) => {
  if (err) {
    logUpdate(`\Connect device to internet mofos!\n`);
    process.exit(1);
  } else {
    logUpdate();
    spinner.text = 'Loading..\n';
    spinner.start();
  }
});

function handleAdd() {
  spinner.color = 'yellow';
  spinner.text = 'staging files.\n';
}

function handleCommit() {
  spinner.text = 'committing files.\n';
}




export async function gitAddCommit() {
  try {
    const { body }: { body: string } = await got(url);
    await git.add(['.'], handleAdd);
    spinner.succeed();
    await git.commit(body, handleCommit);
    logUpdate(`\ncommit msg : ${body}\n`);
    spinner.stop();
  } catch (error) {
    logUpdate(error);
    process.exit(1);
  }
}

gitAddCommit();
