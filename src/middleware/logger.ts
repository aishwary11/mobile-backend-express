import type { NextFunction, Request, Response } from 'express';
import pc from 'picocolors';

export default function logger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const latency = Number(end - start) / 1_000_000;
    const formattedTime = new Date().toLocaleString('hi-IN', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    console.log(
      [
        `Time: ${pc.green(formattedTime)}`,
        `Method: ${pc.yellow(req.method)}`,
        `URL: ${pc.blue(req.originalUrl)}`,
        `Params: ${pc.cyan(JSON.stringify(req.params))}`,
        `Body: ${pc.cyan(JSON.stringify(req.body))}`,
        `Latency: ${pc.red(latency.toFixed(2))} ms`,
      ].join(', '),
    );
  });
  next();
}
