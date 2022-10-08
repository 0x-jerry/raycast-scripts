#!/usr/bin/env deno run --unstable
// 
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title sum
// @raycast.mode compact
// 
// Optional parameters:
// @raycast.icon 🔢
// @raycast.packageName utils
// @raycast.argument1 { "type": "text", "placeholder": "input" }
// 
// Documentation:
// @raycast.author Jerry Wang
// @raycast.authorURL https://github.com/0x-jerry

const [input = ''] = Deno.args;

const numbers = [...input.matchAll(/[\d.]+/g)].map((n) => +n).filter(Boolean);

const sum = numbers.reduce((pre, cur) => pre + cur, 0);

console.log(sum);
