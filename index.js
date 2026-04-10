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
