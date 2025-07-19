# ESLint Type-Aware Rules Configuration

## Overview

This document describes the TypeScript type-aware ESLint rules that have been configured for the project. These rules use TypeScript's type information to catch more complex issues at lint time.

## Configuration Added

### Extended Configurations
```json
"extends": [
  "next/core-web-vitals",
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/recommended-type-checked",
  "prettier"
]
```

### Key Type-Aware Rules Enabled

#### 1. **@typescript-eslint/no-floating-promises** ✅
Ensures promises are properly handled with await, .then(), .catch(), or explicitly marked with void.

**Before:**
```typescript
useEffect(() => {
  fetchData() // Error: floating promise
}, [])
```

**After:**
```typescript
useEffect(() => {
  void fetchData() // Explicitly ignored
}, [])
```

#### 2. **@typescript-eslint/no-misused-promises** ✅
Prevents passing async functions where void returns are expected.

**Example:**
```typescript
// Error: onClick expects void return
<button onClick={async () => await handleClick()}>

// Fixed:
<button onClick={() => void handleClick()}>
```

#### 3. **@typescript-eslint/await-thenable** ✅
Prevents awaiting non-promise values.

#### 4. **@typescript-eslint/require-await** ✅
Ensures async functions contain await expressions.

**Before:**
```typescript
async function fetchData() {
  return data // No await!
}
```

**After:**
```typescript
function fetchData() {
  return data // Remove async
}
```

#### 5. **@typescript-eslint/no-unnecessary-type-assertion** ✅
Removes redundant type assertions.

### Rules Temporarily Disabled

These rules are valuable but produce too many warnings initially:

- `@typescript-eslint/no-unsafe-assignment` - OFF
- `@typescript-eslint/no-unsafe-call` - OFF
- `@typescript-eslint/no-unsafe-member-access` - OFF
- `@typescript-eslint/no-unsafe-return` - OFF
- `@typescript-eslint/no-unsafe-argument` - OFF
- `@typescript-eslint/no-unnecessary-condition` - OFF

These should be gradually enabled as the codebase improves.

## Common Fixes Applied

### 1. Floating Promises in useEffect
```typescript
// Before
useEffect(() => {
  checkAdminStatus()
}, [])

// After
useEffect(() => {
  void checkAdminStatus()
}, [])
```

### 2. Unnecessary Async Functions
```typescript
// Before
export async function generateStaticParams() {
  return data.map(item => ({ id: item.id }))
}

// After
export function generateStaticParams() {
  return data.map(item => ({ id: item.id }))
}
```

### 3. Optional Chaining
```typescript
// Before
if (user && user.email) { }

// After (auto-fixed)
if (user?.email) { }
```

### 4. Nullish Coalescing
```typescript
// Before
const value = data || 'default'

// After (auto-fixed)
const value = data ?? 'default'
```

## Scripts Added

```json
"lint": "next lint",
"lint:fix": "next lint --fix"
```

## Files Ignored

```json
"ignorePatterns": [
  "*.config.js",
  "*.config.ts",
  "scripts/**/*",
  "*.mjs",
  "*.cjs",
  "src/test/mocks/**/*",
  "src/test/fixtures/**/*"
]
```

## Current Status

- ✅ Type-aware rules configured
- ✅ Auto-fixable issues resolved
- ✅ Critical async/promise issues fixed
- ⚠️ Many `any` type warnings remain (non-critical)
- ⚠️ Some duplicate files need cleanup

## Next Steps

1. **Gradual Type Safety**: Replace `any` types with proper types
2. **Enable Strict Rules**: Gradually enable unsafe-* rules
3. **Clean Duplicates**: Remove duplicate files (e.g., "page 2.tsx")
4. **Type Imports**: Use type-only imports where applicable

## Benefits

1. **Catches Runtime Errors**: Unhandled promises, null reference errors
2. **Better Async Code**: Ensures proper async/await usage
3. **Type Safety**: Leverages TypeScript's type system
4. **Performance**: Removes unnecessary code
5. **Consistency**: Enforces modern JS patterns

## Running Type-Aware Lint

```bash
# Check for issues
npm run lint

# Auto-fix what's possible
npm run lint:fix

# Check specific file
npx eslint src/app/page.tsx

# Fix specific file
npx eslint src/app/page.tsx --fix
```

## Suppressing Rules

When necessary, suppress rules with comments:

```typescript
// Suppress for next line
// eslint-disable-next-line @typescript-eslint/no-floating-promises
someAsyncFunction()

// Suppress for file
/* eslint-disable @typescript-eslint/require-await */

// Suppress for specific rule violation
void someAsyncFunction() // eslint-disable-line
```

## Conclusion

Type-aware linting significantly improves code quality by catching subtle bugs that regular linting misses. While the initial setup produces many warnings, the long-term benefits include fewer runtime errors and more maintainable code.