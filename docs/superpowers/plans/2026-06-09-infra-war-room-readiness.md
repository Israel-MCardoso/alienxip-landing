# Infra War Room Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the ALIENXIP landing repository for DEV OS compliant staging, War Room, and production promotion.

**Architecture:** This sprint adds operational documentation, CI/CD gates, environment validation, Railway readiness, Cloudflare routing instructions, and Git branch structure. Product code, design, copy, UX, and animations stay unchanged.

**Tech Stack:** Vite, React, TypeScript, Playwright, GitHub Actions, Railway, Cloudflare.

---

### Task 1: Local Git Structure

**Files:**
- Verify: `.git/`
- Verify: local branches `main` and `staging`

- [ ] **Step 1: Initialize Git if missing**

Run: `git init -b main`
Expected: repository exists with default branch `main`.

- [ ] **Step 2: Create staging branch**

Run: `git checkout -b staging`
Expected: local branch `staging` exists.

- [ ] **Step 3: Return to main**

Run: `git checkout main`
Expected: current local branch is `main`.

### Task 2: CI/CD Readiness

**Files:**
- Verify: `.github/workflows/deploy.yml`
- Verify: `.github/workflows/playwright.yml`
- Verify: `scripts/lint-production.mjs`
- Verify: `scripts/verify-env.mjs`

- [ ] **Step 1: Run local gates**

Run: `npm run lint && npm run typecheck && npm run verify:env && npm run build && npm run test:e2e`
Expected: all commands exit 0.

### Task 3: Railway Readiness

**Files:**
- Verify: `railway.json`
- Verify: `package.json`

- [ ] **Step 1: Confirm build command**

Expected Railway build command: `npm ci && npm run build`.

- [ ] **Step 2: Confirm start command**

Expected Railway start command: `npm run start:railway`.

### Task 4: Cloudflare Readiness

**Files:**
- Verify: `docs/INFRA_READINESS.md`
- Verify: `docs/WAR_ROOM_PLAN.md`
- Verify: `docs/PRODUCTION_PROMOTION_PLAN.md`

- [ ] **Step 1: Configure War Room DNS**

Expected: `warroom.alienxip.com` points to Railway staging.

- [ ] **Step 2: Configure Production DNS**

Expected: `app.alienxip.com` points to Railway production.

### Task 5: Promotion Governance

**Files:**
- Verify: `docs/DEPLOYMENT_RUNBOOK.md`
- Verify: `docs/PRODUCTION_PROMOTION_PLAN.md`

- [ ] **Step 1: Open PR feature to staging**

Expected: CI green before merge.

- [ ] **Step 2: Execute War Room**

Expected: War Room checklist signed off.

- [ ] **Step 3: Promote staging to main**

Expected: production checklist signed off before deployment.
