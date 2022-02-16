import { version as platformVersion } from "zapier-platform-core";

import authentication from "./lib/auth";
import searches from "./lib/searches";
import triggers from "./lib/triggers";
import creates from "./lib/creates";
import { createApp } from "./types/app";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

export default createApp({
  version,
  platformVersion,

  authentication,

  searches,

  triggers,

  creates,
});
