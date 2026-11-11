import type { IncomingMessage, ServerResponse } from "node:http";
import { createZynxServer } from "../../server/zynxService.ts";

const server = createZynxServer();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  server.emit("request", req, res);
}
