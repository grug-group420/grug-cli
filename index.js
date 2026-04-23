#!/usr/bin/env node
/**
 * grug-cli - Simple CLI tools the grug way
 * Zero dependencies. Just works.
 */

const fs = require('fs');
const path = require('path');

const commands = {
    init: {
        desc: 'Create minimal project structure',
        run: (name = 'grug-project') => {
            const files = {
                'index.js': `// ${name}\n// Keep it simple\n\nconsole.log('Hello from ${name}');`,
                'package.json': JSON.stringify({
                    name,
                    version: '1.0.0',
                    main: 'index.js',
                    scripts: { start: 'node index.js' },
                    license: 'MIT'
                }, null, 2),
                'README.md': `# ${name}\n\nSimple project. No complexity.\n\n## Run\n\n\`\`\`bash\nnpm start\n\`\`\`\n`,
                '.gitignore': 'node_modules/\n.env\n*.log'
            };
            
            if (!fs.existsSync(name)) fs.mkdirSync(name);
            Object.entries(files).forEach(([file, content]) => {
                fs.writeFileSync(path.join(name, file), content);
            });
            console.log(`✅ Created ${name}/`);
            console.log('   - index.js');
            console.log('   - package.json');
            console.log('   - README.md');
            console.log('   - .gitignore');
            console.log(`\n🦴 cd ${name} && npm start`);
        }
    },
    
    loc: {
        desc: 'Count lines of code',
        run: (dir = '.') => {
            let total = 0;
            const count = (d) => {
                fs.readdirSync(d).forEach(f => {
                    const p = path.join(d, f);
                    if (f.startsWith('.') || f === 'node_modules') return;
                    if (fs.statSync(p).isDirectory()) count(p);
                    else if (/\.(js|ts|py|go|rs|c|h|java|rb)$/.test(f)) {
                        total += fs.readFileSync(p, 'utf8').split('\n').length;
                    }
                });
            };
            count(dir);
            const status = total < 500 ? '🟢 GOOD' : total < 2000 ? '🟡 OK' : '🔴 TOO MUCH';
            console.log(`📊 Lines of code: ${total} ${status}`);
        }
    },
    
    deps: {
        desc: 'Check dependency count',
        run: () => {
            try {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                const deps = Object.keys(pkg.dependencies || {}).length;
                const devDeps = Object.keys(pkg.devDependencies || {}).length;
                const status = deps === 0 ? '🟢 PERFECT' : deps < 5 ? '🟡 OK' : '🔴 TOO MANY';
                console.log(`📦 Dependencies: ${deps} ${status}`);
                console.log(`🔧 Dev deps: ${devDeps}`);
            } catch {
                console.log('❌ No package.json found');
            }
        }
    },
    
    clean: {
        desc: 'Remove node_modules and lock files',
        run: () => {
            ['node_modules', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'].forEach(f => {
                if (fs.existsSync(f)) {
                    fs.rmSync(f, { recursive: true, force: true });
                    console.log(`🗑️  Removed ${f}`);
                }
            });
            console.log('✅ Clean!');
        }
    },
    
    ship: {
        desc: 'Quick commit and push',
        run: (msg = 'ship it') => {
            const { execSync } = require('child_process');
            try {
                execSync('git add -A', { stdio: 'inherit' });
                execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
                execSync('git push', { stdio: 'inherit' });
                console.log('🚀 Shipped!');
            } catch {
                console.log('❌ Ship failed. Check git status.');
            }
        }
    },
    

    todo: {
        desc: 'Scan for TODO/FIXME/HACK comments',
        run: (dir = '.') => {
            const results = [];
            const scan = (d) => {
                fs.readdirSync(d).forEach(f => {
                    const p = path.join(d, f);
                    if (f.startsWith('.') || f === 'node_modules') return;
                    if (fs.statSync(p).isDirectory()) scan(p);
                    else if (/\.(js|ts|py|go|rs|c|h|java|rb|md)$/.test(f)) {
                        const lines = fs.readFileSync(p, 'utf8').split('\n');
                        lines.forEach((line, i) => {
                            if (/TODO|FIXME|HACK|XXX/.test(line)) {
                                results.push(`  ${p}:${i+1}  ${line.trim()}`);
                            }
                        });
                    }
                });
            };
            scan(dir);
            if (results.length === 0) {
                console.log('✅ No TODOs found. Grug impressed.');
            } else {
                console.log(`📋 Found ${results.length} TODO(s):\n`);
                results.forEach(r => console.log(r));
            }
        }
    },

    size: {
        desc: 'Find largest files in project',
        run: (dir = '.', limit = 10) => {
            const files = [];
            const scan = (d) => {
                fs.readdirSync(d).forEach(f => {
                    const p = path.join(d, f);
                    if (f.startsWith('.') || f === 'node_modules') return;
                    const stat = fs.statSync(p);
                    if (stat.isDirectory()) scan(p);
                    else files.push({ path: p, size: stat.size });
                });
            };
            scan(dir);
            files.sort((a, b) => b.size - a.size);
            const fmt = (b) => b > 1024*1024 ? `${(b/1024/1024).toFixed(1)}MB` : b > 1024 ? `${(b/1024).toFixed(1)}KB` : `${b}B`;
            console.log(`📦 Largest ${Math.min(limit, files.length)} files:\n`);
            files.slice(0, parseInt(limit)).forEach(f => {
                const flag = f.size > 500*1024 ? ' ⚠️' : '';
                console.log(`  ${fmt(f.size).padEnd(8)} ${f.path}${flag}`);
            });
        }
    },

    env: {
        desc: 'List .env keys (no values shown)',
        run: (file = '.env') => {
            if (!fs.existsSync(file)) {
                console.log(`❌ ${file} not found`);
                return;
            }
            const lines = fs.readFileSync(file, 'utf8').split('\n');
            const keys = lines
                .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
                .map(l => l.split('=')[0].trim());
            if (keys.length === 0) {
                console.log('📭 No keys found');
                return;
            }
            console.log(`🔑 ${file} keys (${keys.length}):\n`);
            keys.forEach(k => console.log(`  ${k}`));
            console.log('\n🔒 Values hidden. Grug protect secrets.');
        }
    },

    help: {
        desc: 'Show this help',
        run: () => {
            console.log('🦴 grug-cli - Simple CLI tools\n');
            console.log('Commands:');
            Object.entries(commands).forEach(([name, cmd]) => {
                console.log(`  ${name.padEnd(10)} ${cmd.desc}`);
            });
            console.log('\nUsage: grug <command> [args]');
        }
    }
};

// Run
const [cmd, ...args] = process.argv.slice(2);
if (commands[cmd]) {
    commands[cmd].run(...args);
} else {
    commands.help.run();
}
