import { version as platformVersion } from "zapier-platform-core";

import resources from "./lib/resources";
import { createApp } from "./types/app";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

export default createApp({
  version,
  platformVersion,

  resources,
});
