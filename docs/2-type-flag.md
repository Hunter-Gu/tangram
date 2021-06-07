# type flags

## type flag

- number: `$ref.method --number param`
- string: `$ref.method --string param`
- boolean: `$ref.method --boolean param`
- object: `$ref.method --object [key1][key11]: --number value`
- array: `$ref.method --array [0]: --number value1 [1]: --string value2`
- null: `$ref.method --null`
- undefined: `$ref.method --undefined`

### shorthand

- `-n`: `--number`
- `-s`: `--string`
- `-b`: `--boolean`
- `-o`: `--object`
- `-a`: `--array`
- `-nu`: `--null`
- `-u`: `--undefined`

## TODO

- [x] support pass parameters to call function
- [x] support call other refs' function
- [x] refactor render
- [x] add prettier and git hooks, typescirpt don't allow any type
- [ ] add unit test
- [ ] Parameters support pass other type, just support string type now
- [ ] refactor flag type parser
