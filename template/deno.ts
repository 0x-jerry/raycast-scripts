#!/usr/bin/env deno run
// 
// Raycast Script Command Template
//
// Dependency: This script requires Deno.
// Install Deno: https://deno.land/#installation
//
// Duplicate this file and rename the filename to get started.
// See full documentation here: https://github.com/raycast/script-commands
//
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title My Script
// @raycast.mode fullOutput
// @raycast.packageName Raycast Scripts
//
// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "query" }
//
// Documentation:
// @raycast.author Jerry Wang
// @raycast.authorURL https://github.com/0x-jerry
// @raycast.description 

const [input = ""] = Deno.args;

console.log(input);
