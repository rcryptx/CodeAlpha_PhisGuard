import { createZynxServer } from "./zynxService.js";

function getPort(value: string | undefined) {
  if (value === undefined || value.trim() === "") return 4174;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
  return port;
}

const server = createZynxServer();
const port = getPort(process.env.PORT);
const host = process.env.HOST?.trim() || "127.0.0.1";

server.listen(port, host, () => {
  process.stdout.write(`ZYNX API listening on http://${host}:${port}\n`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close((error) => {
      if (error) {
        process.stderr.write("ZYNX API failed to shut down cleanly.\n");
        process.exitCode = 1;
      }
    });
  });
}
