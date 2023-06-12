import chalk from "chalk";
import moment from "moment";

const lessThanTen = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

class LoggerService {
  private getDate(): string {
    const now: Date = new Date();
    const datetime = moment(now).format("DD-MM-YYYY HH:mm:ss.SSS");

    return chalk.green(datetime);
  }

  private logger(...args: unknown[]): void {
    console.log(this.getDate(), ...args);
  }

  public log(...args: unknown[]): void {
    this.logger(chalk.bgBlue(" INFO "), ...args);
  }

  public error(...args: unknown[]): void {
    this.logger(chalk.bgRed(" ERROR "), ...args);
  }

  public warn(...args: unknown[]): void {
    this.logger(chalk.bgYellow(" WARN "), ...args);
  }
}

export default new LoggerService();
