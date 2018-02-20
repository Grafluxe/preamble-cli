#!/usr/bin/env node

/**
 * @author Leandro Silva
 * @copyright 2017-2018 Leandro Silva (http://grafluxe.com)
 * @license MIT
 *
 * @classdesc A CLI tool that prepends text and/or file data to an output file.
 *
 * @example
 *   preamble -p "/*Released under the MIT License&#42;/\n" -o ./dist/script.min.js
 *   preamble -e ./prepend.txt -o ./dist/script.min.js
 *   preamble -p "/*" -e ./LICENSE.md -m "&#42;/" -o ./dist/script.min.js
 */

let argv = require("argv"),
    fs = require("fs"),
    opts,
    out = "";

argv.option({
  name: "print",
  short: "p",
  type: "string",
  description: "Text to prepend to your output file.\n\t\tThis content is added BEFORE the text from the --external and --more options.",
  example: "'preamble --print=<string>' or 'preamble -p <string>'"
});

argv.option({
  name: "external",
  short: "e",
  type: "path",
  description: "A file that has text to be used as prepend data for your output file.\n\t\tThis content is added IN-BETWEEN the text from the --print and --more options.",
  example: "'preamble --external=<file-path>' or 'preamble -e <file-path>'"
});

argv.option({
  name: "more",
  short: "m",
  type: "string",
  description: "Additional text to prepend to your output file.\n\t\tThis content is added AFTER the text from the --print and --external options.",
  example: "'preamble --more=<string>' or 'preamble -m <string>'"
});

argv.option({
  name: "output",
  short: "o",
  type: "path",
  description: "The file to prepend your text to. The output is encoded as UTF-8.",
  example: "'preamble --output=<file-path>' or 'preamble -o <file-path>'"
});

opts = argv.run().options;

function createPreamble() {
  out += opts.print || "";

  if (opts.external) {
    fs.readFile(opts.external, (err, data) => {
      if (err) {
        return onReadError(err, "external");
      }

      out += data + (opts.more || "");
      prependFile();
    });
  } else {
    out += opts.more || "";
    prependFile();
  }
}

function prependFile() {
  if (fs.existsSync(opts.output)) {
    fs.readFile(opts.output, "utf8", (err, data) => {
      if (err) {
        return onReadError(err, "output");
      }

      fs.writeFile(opts.output, supportSpecialChars(out) + data, err => {
        if (err) {
          console.error("\x1b[31m%s\x1b[0m\n", `There was an error writing your file:\n${err.path}`);
          process.exit(1);
        }
      });
    });
  } else {
    console.error("\x1b[31m%s\x1b[0m\n", "Your output file does not exist.\nUse 'preamble -h' for more details.");
    process.exit(1);
  }
}

function onReadError(err, fileType) {
  if (err.code === "EISDIR") {
    console.error("\x1b[31m%s\x1b[0m\n", `Expecting a file and not a directory:\n${err.path}`);
  } else {
    console.error("\x1b[31m%s\x1b[0m\n", `There was an error reading your ${fileType} file:\n${err.path}`);
  }

  process.exit(1);
}

function supportSpecialChars(str) {
  // ES2015 does not support look-behind expressions.
  // The below adds support for escape characters while allowing for the output of double escaped ones.
  // '\n' = newline, but '\\n' should not be converted to a newline
  return str
    .replace(/\\\\([nt])/g, "%x%$1")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/%x%([nt])/g, "\\$1");
}

//init
if (opts.output) {
  createPreamble();
} else {
  console.error("\x1b[31m%s\x1b[0m\n", "The --output (-o) option is required.\nUse 'preamble -h' for more details.");
  process.exit(1);
}
