#!/usr/bin/env deno run --unstable --allow-run
//
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title kya
// @raycast.mode compact
//
// Optional parameters:
// @raycast.icon 🔢
// @raycast.packageName utils
// @raycast.argument1 { "type": "text", "placeholder": "ex. 0 or 2[m] or 10s or 12h or 1d", "optional": true }
//
// Documentation:
// @raycast.author Jerry Wang
// @raycast.authorURL https://github.com/0x-jerry
// @raycast.description Keeping you awake

/**
 * `0` means off, `''` means infinite.
 */
const [input = ""] = Deno.args;

resolve(input);

async function resolve(duration: string) {
  if (duration === "0") {
    await openKYA(false, duration);
    return;
  }

  await openKYA(true, duration);
}

/**
 *
 * open keepingyouawake://
 * open keepingyouawake:///activate    # indefinite duration
 * open keepingyouawake:///activate?seconds=5
 * open keepingyouawake:///activate?minutes=5
 * open keepingyouawake:///activate?hours=5
 * open keepingyouawake:///deactivate
 *
 * @param enable
 * @param duration
 */
async function openKYA(enable: boolean, duration: string) {
  const open = "open";
  const _enable = "keepingyouawake:///activate";
  const _disenable = "keepingyouawake:///deactivate";

  if (!enable) {
    const p = Deno.run({
      cmd: [open, _disenable],
    });
    await p.status();
    console.log("KYA closed.");
    return;
  }

  const query = parseDuration(duration);

  const p = Deno.run({
    cmd: [open, `${_enable}?${query}`],
  });

  await p.status();
  console.log(`KYA start with ${query || "infinite"}`);
  return;
}

function parseDuration(duration: string) {
  // const unit = ["s", "m", "h", "d"];
  const durationReg = /^(?<num>\d+)\s*(?<unit>[smhd])?/;

  const unitMap: Record<string, string> = {
    m: "minutes",
    s: "seconds",
    h: "hours",
  };

  const matched = duration.match(durationReg);
  if (!matched) return "";

  const { num, unit = "m" } = matched.groups!;

  if (unit == "d") {
    const hours = parseInt(num) * 24;
    return `hours=${hours}`;
  }

  return `${unitMap[unit]}=${num}`;
}
