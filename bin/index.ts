import simpleGit, { SimpleGit } from 'simple-git';
import dns from 'dns';
import ora from 'ora';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import { argv } from 'process';
import got from 'got';

updateNotifier({ pkg }).notify();

const git: SimpleGit = simpleGit();
const spinner = ora();
const url = `http://whatthecommit.com/index.txt`;

if (argv[2] === '-h' || argv[2] === '--help') {
  console.log(`
    usage: wtc
  `);
} else {
  console.log(`Unknown option ${argv[2]}`);
}

dns.lookup('whatthecommit.com', (err) => {
  if (err) {
    console.log(`\nCheck internet connection!\n`);
    process.exit(1);
  } else {
    spinner.text = 'What the actual fuck?';
    spinner.start();
  }
});

setTimeout(() => {
  spinner.text = 'Loading rainbows';
}, 1000);

function handleAdd() {
  spinner.color = 'yellow';
  spinner.text = 'staging the files.';
}

function handleCommit(body: string) {
  spinner.text = `commit msg : ${body}`;
}

export async function gitAddCommit() {
  try {
    const { body }: { body: string } = await got(url);
    await git.add(['.'], handleAdd);
    await git.commit(body, () => handleCommit(body));
    spinner.stop();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


gitAddCommit()