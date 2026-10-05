import { createHash, timingSafeEqual } from "node:crypto";

import type { LoginSuccess } from "./types.ts";

const digest = (value: string): Buffer => createHash("sha256").update(value).digest();

type DemoMember = {
  displayName: string;
  passwordDigest: Buffer;
};

const members = new Map<string, DemoMember>([
  [
    "belona",
    {
      displayName: "Belona Singh",
      passwordDigest: digest("correct-horse-battery-staple"),
    },
  ],
]);

export function authenticate(username: string, password: string): LoginSuccess | null {
  const member = members.get(username.toLocaleLowerCase());
  const suppliedDigest = digest(password);

  if (!member || !timingSafeEqual(member.passwordDigest, suppliedDigest)) {
    return null;
  }

  return {
    accessToken: `demo-token-for-${username.toLocaleLowerCase()}`,
    member: { displayName: member.displayName },
  };
}

