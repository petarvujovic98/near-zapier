import { Bundle as ZBundle } from "zapier-platform-core";

import { AuthData } from "../lib/auth";

export interface Bundle<InputData = { [key: string]: string }>
  extends ZBundle<InputData> {
  authData: ZBundle["authData"] & AuthData;
}
