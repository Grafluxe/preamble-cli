# Preamble CLI

A CLI tool that prepends text and/or file data to an output file.

## Usage

`npm i preamble-cli -D`

[![npm](https://nodei.co/npm/preamble-cli.png)](https://www.npmjs.com/package/preamble-cli)

```
preamble [<options>...] -o <file>
```

### Options
```
  --help, -h
    Displays help information about this script
    'preamble -h' or 'preamble --help'

  --print, -p
    Text to prepend to your output file.
    This content is added BEFORE the text from the --external and --more options.
    'preamble --print=<string>' or 'preamble -p <string>'

  --external, -e
    A file that has text to be used as prepend data for your output file.
    This content is added IN-BETWEEN the text from the --print and --more options.
    'preamble --external=<file-path>' or 'preamble -e <file-path>'

  --more, -m
    Additional text to prepend to your output file.
    This content is added AFTER the text from the --print and --external options.
    'preamble --more=<string>' or 'preamble -m <string>'

  --output, -o
    The file to prepend your text to. The output is encoded as UTF-8.
    'preamble --output=<file-path>' or 'preamble -o <file-path>'
```

## Prepend Order

This tool has three ways to prepend content. You can use any *one* of them, or all three. The output order is as follows:

1. --print
2. --external
3. --more

Having three options allows you do things like add contents from a file as commented text. See the LICENSE sample below.

## Samples

Prepend text to a file.

```
preamble -p "/*Released under the MIT License*/\n" -o ./dist/script.min.js
```

Prepend content **from** a file.

```
preamble -e ./prepend.txt -o ./dist/script.min.js
```

Add content from a LICENSE file as commented text.

```
preamble -p "/*" -e ./LICENSE.md -m "*/" -o ./dist/script.min.js
```

## Special Character Support

Newlines (`\n`) and tabs (`\t`) are supported. If you need to output either character-set as text, double escape them.

```
+=====================================================+
| Command                              | Output       |
|=====================================================|
| preamble -o test.txt -p "\n"         | newline      |
|--------------------------------------+--------------|
| preamble -o test.txt -p "\\n"        | newline      |
|--------------------------------------+--------------|
| preamble -o test.txt -p "\\\n"       | \n           |
|--------------------------------------+--------------|
| preamble -o test.txt -p "\\\\n"      | \n           |
|--------------------------------------+--------------|
| preamble -o test.txt -p \n           | n            |
|--------------------------------------+--------------|
| preamble -o test.txt -p \\n          | newline      |
|--------------------------------------+--------------|
| preamble -o test.txt -p \\\n         | newline      |
|--------------------------------------+--------------|
| preamble -o test.txt -p \\\\n        | \n           |
+=====================================================+
```

## Dependencies

- [argv](https://www.npmjs.com/package/argv)

## License

Copyright (c) 2017 Leandro Silva (http://grafluxe.com)

Released under the MIT License.

See LICENSE.md for entire terms.
