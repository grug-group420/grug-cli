# ⌨️ grug-cli

> Simple CLI tools the grug way

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

## Install

```bash
npm install -g grug-cli
```

## Commands

| Command | Description |
|---------|-------------|
| `grug init [name]` | Create minimal project |
| `grug loc [dir]` | Count lines of code |
| `grug deps` | Check dependency count |
| `grug clean` | Remove node_modules |
| `grug ship [msg]` | Quick commit & push |
| `grug help` | Show help |

## Usage

```bash
# Create new project
grug init my-project

# Check code size
grug loc

# Check dependencies
grug deps

# Ship it
grug ship "fix bug"
```

## Philosophy

- Zero dependencies
- One file
- Simple commands
- No magic

---

Built with 🦴 by [grug-group420](https://github.com/grug-group420)
