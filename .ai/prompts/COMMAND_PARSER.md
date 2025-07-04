# Command Parser Logic

How to parse and execute enhanced commands with parameters.

## Parsing Rules

### 1. Basic Command
```
Input: [ship]
Parsed: {
  command: "ship",
  args: [],
  flags: {}
}
```

### 2. Command with Message
```
Input: [ship "fix: update routing"]
Parsed: {
  command: "ship",
  args: ["fix: update routing"],
  flags: {}
}
```

### 3. Command with Flags
```
Input: [test unit --coverage --watch]
Parsed: {
  command: "test",
  args: ["unit"],
  flags: {
    coverage: true,
    watch: true
  }
}
```

### 4. Bang Syntax
```
Input: [ship!]
Parsed: {
  command: "ship",
  args: [],
  flags: {
    force: true
  },
  bang: true
}
```

### 5. Shortcuts
```
Input: [s]
Resolved: [ship]
Parsed: {
  command: "ship",
  args: [],
  flags: {}
}
```

### 6. Complex Example
```
Input: [clean modules/users --fix --strict]
Parsed: {
  command: "clean", 
  args: ["modules/users"],
  flags: {
    fix: true,
    strict: true
  }
}
```

## Execution Flow

1. **Extract Command**
   - Match pattern: `\[([^\]]+)\]`
   - Extract content between brackets

2. **Resolve Shortcuts**
   ```
   shortcuts = {
     's': 'ship',
     'c': 'clean',
     't': 'test',
     // etc
   }
   ```

3. **Parse Components**
   - Split by spaces (respecting quotes)
   - First element = command
   - Elements starting with -- = flags
   - Other elements = arguments

4. **Validate**
   - Check command exists in registry
   - Validate required parameters
   - Check flag types

5. **Execute**
   - Load command definition
   - Apply defaults
   - Run workflow

## Error Handling

### Unknown Command
```
Input: [deploy]
Error: Unknown command 'deploy'. Did you mean 'ship'?
       Available commands: ship, clean, test, sync...
```

### Missing Required Parameter
```
Input: [explore]
Error: Command 'explore' requires a topic.
       Usage: [explore "topic"] [--depth shallow|normal|deep]
```

### Invalid Flag
```
Input: [test --invalid]
Error: Unknown flag '--invalid' for command 'test'.
       Available flags: --coverage, --watch
```

## Implementation Example

```typescript
// Pseudo-code for command parsing
function parseCommand(input: string) {
  // Extract command from brackets
  const match = input.match(/\[([^\]]+)\]/);
  if (!match) return null;
  
  const content = match[1];
  const bang = content.endsWith('!');
  const normalized = bang ? content.slice(0, -1) : content;
  
  // Parse components
  const parts = parseQuotedString(normalized);
  const command = resolveShortcut(parts[0]);
  
  const args: string[] = [];
  const flags: Record<string, any> = {};
  
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].startsWith('--')) {
      const flagName = parts[i].slice(2);
      // Check if next part is flag value
      if (i + 1 < parts.length && !parts[i + 1].startsWith('--')) {
        flags[flagName] = parts[++i];
      } else {
        flags[flagName] = true;
      }
    } else {
      args.push(parts[i]);
    }
  }
  
  if (bang) flags.force = true;
  
  return { command, args, flags, bang };
}
```

## Command Execution

Once parsed, execute based on registry:

```typescript
async function executeCommand(parsed: ParsedCommand) {
  const definition = COMMAND_REGISTRY[parsed.command];
  if (!definition) {
    throw new UnknownCommandError(parsed.command);
  }
  
  // Validate parameters
  validateParameters(parsed, definition);
  
  // Execute workflow
  const context = {
    args: parsed.args,
    flags: { ...definition.defaults, ...parsed.flags },
    bang: parsed.bang
  };
  
  return await definition.execute(context);
}
```

## Examples in Action

### Ship with Custom Message
```
User: [ship "feat: add user authentication"]

Parsing:
- Command: ship
- Args: ["feat: add user authentication"]
- Flags: {}

Execution:
🚀 Ship to Production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running tests... ✅
Type checking... ✅
Building project... ✅
Committing: "feat: add user authentication"... ✅
Pushing to GitHub... ✅

✅ Shipped successfully!
```

### Test with Coverage
```
User: [t unit --coverage]

Parsing:
- Command: test (resolved from 't')
- Args: ["unit"]
- Flags: { coverage: true }

Execution:
🧪 Running Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running unit tests... ✅
Generating coverage... ✅

📊 Coverage Report:
- Statements: 92%
- Branches: 87%
- Functions: 95%
- Lines: 91%

✅ All tests passed!
```