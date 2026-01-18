---
name: update-app
description: Update dependencies, fix deprecations and warnings
---

# Dependency Update & Deprecation Fix

## Step 1: Check for Updates

```bash
cd /mnt/e/Projects/sneaky-stream
bun outdated
```

Review which packages have updates available.

## Step 2: Update Dependencies

```bash
bun update
```

This updates all dependencies to their latest compatible versions.

## Step 3: Check for Deprecations & Warnings

Run a clean install and capture ALL output:

```bash
rm -rf node_modules bun.lock
bun install 2>&1
```

Read ALL output carefully. Look for:
- Deprecation warnings
- Security vulnerabilities
- Peer dependency warnings
- Breaking changes

## Step 4: Fix Issues

For each warning/deprecation found:
1. Research the recommended replacement or fix
2. Update code/dependencies accordingly
3. Re-run `bun install`
4. Verify no warnings remain

Common fixes:
- Replace deprecated packages with maintained alternatives
- Update import statements for renamed exports
- Fix peer dependency mismatches by installing correct versions

## Step 5: Run Quality Checks

```bash
bun run lint
bun run typecheck
bun run test
```

Fix ALL errors before completing.

## Step 6: Verify Clean Install

Ensure a fresh install works with zero warnings:

```bash
rm -rf node_modules bun.lock
bun install
```

Confirm:
- ✅ Zero warnings/errors in output
- ✅ All dependencies resolve correctly
- ✅ Lint passes
- ✅ Typecheck passes
- ✅ Tests pass
