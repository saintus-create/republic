import { accessCookieAuth, type AuthFn } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

// Public access auth - allows all requests
const publicAuth: AuthFn = async () => {
  return {
    authenticator: "public",
    principalType: "user",
    principal: { type: "public" },
  };
};

export default eveChannel({
  auth: [publicAuth, accessCookieAuth()],
});
