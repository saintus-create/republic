import { localDev } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

import { accessCookieAuth } from "../lib/access.js";

export default eveChannel({
  auth: [localDev(), accessCookieAuth()],
});
