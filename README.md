# Restriction Endonuclease

Restriction Endonuclease stream.

## Usage

### CLI demo

```shell
$ cat /dev/urandom | base64 | tr -dc 'ATGC' | npx restriction-endonuclease AAGCTT
```

### As a dependency

```shell
$ yarn add restriction-endonuclease
```

```typescript
import RestrictionEndonuclease from "restriction-endonuclease";

process.stdin.pipe(new RestrictionEndonuclease()).pipe(process.stdout);
```
