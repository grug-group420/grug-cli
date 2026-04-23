# 🪨 grug-cli

[![CI](https://github.com/grug-group420/grug-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/grug-group420/grug-cli/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Zero-dependency developer toolkit following grug-brained principles.

## Install

```bash
bunx grug-cli
```

## Philosophy

- **Zero dependencies** - No node_modules
- **Simple commands** - Do one thing well
- **Fast** - Bun.js powered

## Commands

| Command | What it does |
|---|---|
| `grug init [name]` | Create minimal project structure |
| `grug loc [dir]` | Count lines of code |
| `grug deps` | Check dependency count |
| `grug clean` | Remove `node_modules` + lock files |
| `grug ship "msg"` | `git add -A && commit && push` |
| `grug todo [dir]` | Scan for `TODO`/`FIXME`/`HACK` comments |
| `grug size [dir] [n]` | List largest files in project |
| `grug env [file]` | List `.env` keys (values hidden) |
| `grug bench [dir] [iters]` | **Benchmark project scans** (loc + size + todo) |
| `grug help` | Show this list |

### `grug bench` example

```text
$ grug bench . 5
⏱️  Benchmarking project scans on . (5 iters each)

  loc      avg=0.07ms med=0.06ms min=0.05ms max=0.10ms   (296 loc, 1 files)
  size     avg=0.03ms med=0.03ms min=0.02ms max=0.04ms   (13.7 KB, 6 files)
  todo     avg=0.07ms med=0.06ms min=0.05ms max=0.11ms   (13 todo hits)

  total avg = 0.17ms  🟢 fast
🦴 grug benchmark complete.
```

Verdict ladder: 🟢 < 50 ms · 🟡 < 250 ms · 🔴 ≥ 250 ms.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

grug say: "complexity very very bad" 🪨
