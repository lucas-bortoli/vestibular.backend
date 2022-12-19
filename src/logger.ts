import chalk from "chalk";

const date = () => {
  return chalk.blue(new Date().toLocaleTimeString("pt-BR"));
};

const logger = {
  log: (...args: unknown[]) => console.log(date(), chalk.gray("log   "), ...args),
  info: (...args: unknown[]) => console.info(date(), chalk.green("info  "), ...args),
  error: (...args: unknown[]) => console.error(date(), chalk.red("error"), ...args),
};

export default logger;
