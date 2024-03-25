#!/usr/bin/env deno run --allow-net
//
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Cambridge Dictionary
// @raycast.mode fullOutput
//
// Optional parameters:
// @raycast.icon 📖
// @raycast.packageName utils
// @raycast.argument1 { "type": "text", "placeholder": "Word to look up" }
//
// Documentation:
// @raycast.author Jerry Wang
// @raycast.authorURL https://github.com/0x-jerry

import { load, type Element } from "https://esm.sh/cheerio@1.0.0-rc.12";
import * as colors from "https://deno.land/std@0.220.1/fmt/colors.ts";

const [input = ''] = Deno.args;

const result = await search(input);

formatPrint(result);

function formatPrint(json: SearchResult[]) {
  const str = json
    .map((item) => {
      const ex = item.examples.map((item) => {
        const indent = " ".repeat(2);

        return [
          indent + "- " + colors.black(item.sentence),
          indent + "  " + colors.blue(item.translation),
        ].join("\n");
      });

      const s = [
        colors.black(colors.bold(item.sentence)),
        colors.blue(item.translation),
        ...ex,
      ];

      return s.join("\n");
    })
    .join("\n\n");

  console.log(str);
}

// ---------
interface Translation {
  sentence: string;
  translation: string;
}

interface SearchResult extends Translation {
  examples: Translation[];
}

async function search(word: string) {
  const url = "https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/";
  const totalUrl = `${url}${encodeURIComponent(word)}`;

  const _url = encodeURI(totalUrl);

  const resp = await fetch(_url, {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });

  const html = await resp.text();

  const translations = extractTranslation(html);

  return translations;
}

function extractTranslation(html: string) {
  const $ = load(html);

  const defBlocks = $(".def-block").map((_, item) => {
    const sentence = getTextByQuery(".ddef_h .def", item);
    const translation = getTextByQuery(".def-body > .trans", item);

    const examples = $(item)
      .find(".def-body .examp")
      .map((_, item) => {
        const example = getTextByQuery(".eg", item);
        const translation = getTextByQuery(".trans", item);

        const t: Translation = {
          sentence: example,
          translation,
        };
        return t;
      });

    const t: SearchResult = {
      sentence,
      translation,
      examples: examples.toArray(),
    };

    return t;
  });

  return defBlocks.toArray();

  function getTextByQuery(selector: string, item: Element) {
    const el = $(item);

    return el.find(selector)?.text().trim();
  }
}
