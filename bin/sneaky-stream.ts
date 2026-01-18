#!/usr/bin/env bun

import { main } from '../src/index';

const args = process.argv.slice(2);
const url = args.find((arg) => !arg.startsWith('-'));
const flags = args.filter((arg) => arg.startsWith('-'));

if (!url && !flags.includes('--help') && !flags.includes('-h')) {
  console.log(`
Usage: sneaky-stream <url> [options]

Arguments:
  url                     Website URL to open

Options:
  -p, --port <number>     Stream server port (default: 3000)
  -s, --selector <css>    Initial CSS selector to highlight
  -h, --help              Show this help message

Examples:
  sneaky-stream stripe.com
  sneaky-stream https://vercel.com --port 8080
  sneaky-stream example.com -s ".hero"
`);
  process.exit(0);
}

// Parse options
const port = parseInt(
  args[args.indexOf('--port') + 1] || args[args.indexOf('-p') + 1] || '3000'
);
const selector =
  args[args.indexOf('--selector') + 1] || args[args.indexOf('-s') + 1] || null;

main({
  url: url || '',
  port,
  selector,
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
