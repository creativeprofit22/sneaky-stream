import chalk from 'chalk';
import type { TuiState } from './app';

export function clearScreen(): void {
  process.stdout.write('\x1B[2J\x1B[0f');
}

export function renderScreen(state: TuiState): void {
  clearScreen();

  const width = process.stdout.columns || 80;
  const divider = '─'.repeat(width);

  // Header
  console.log(chalk.blue.bold('\n  SNEAKY STREAM'));
  console.log(chalk.gray(divider));

  // URL
  console.log(chalk.white('  URL: ') + chalk.cyan(state.url || 'Not set'));

  // Current selector
  console.log(
    chalk.white('  Selector: ') +
      (state.selector ? chalk.green(state.selector) : chalk.gray('None'))
  );

  // Status
  console.log(chalk.white('  Status: ') + chalk.yellow(state.status));

  console.log(chalk.gray(divider));

  // Element list
  if (state.elements && state.elements.length > 0) {
    console.log(chalk.white.bold('  Elements:'));
    state.elements.forEach((el, i) => {
      const prefix = i === state.selectedIndex ? chalk.blue('▶ ') : '  ';
      const text = i === state.selectedIndex ? chalk.blue.bold(el) : chalk.gray(el);
      console.log(`  ${prefix}${text}`);
    });
  }

  console.log(chalk.gray(divider));

  // Logs
  if (state.logs && state.logs.length > 0) {
    console.log(chalk.white.bold('  Logs:'));
    state.logs.forEach((log) => {
      console.log(chalk.gray(`  ${log}`));
    });
  }

  console.log(chalk.gray(divider));

  // Controls
  console.log(chalk.gray('  ↑↓ Navigate  │  Enter Select  │  e Extract  │  q Quit'));
  console.log();
}
