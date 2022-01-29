import {
  Bundle,
  HttpRequestOptions,
  ZObject,
  version as platformVersion,
} from "zapier-platform-core";

import resources from "./lib/resources";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

const addApiKeyHeader = (
  req: HttpRequestOptions,
  _z: ZObject,
  _bundle: Bundle
) => {
  // Hard-coded api key just to demo. DON'T do auth like this for your production app!
  req.headers = req.headers || {};
  req.headers["X-Api-Key"] = "secret";
  return req;
};

export default {
  version,
  platformVersion,

  beforeRequest: [addApiKeyHeader],

  resources,
};
