# Pull Request Template

Use this template for every PR in `Crowkis UI`.

Title format (required):
- `type(scope): short summary`
- Example: `feat(ui): add responsive navigation drawer`

Allowed `type`:
- `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `build`

---

## Summary

<!-- 1 short paragraph -->

## Why

<!-- 2-5 bullets -->
- 
- 

## What changed

<!-- 2-6 bullets grouped by area -->
- 

## Files changed

| Area | Change |
|------|--------|
| `path/to/file` | What changed |
| `path/to/file` | What changed |

## Test plan

<!-- Mandatory mentions for CI etiquette check -->
- [ ] `npm run typecheck`
- [ ] `npm run lint`

<!-- Add relevant checks depending on your change -->
- [ ] `npm run build`
- [ ] `npm run dev` — manual smoke test in browser (note viewports checked)

## Risk / Rollback

<!-- Risks in behavior/ops + quick rollback path -->
- **Risk:**
- **Rollback:**

---

### Optional checklist (recommended)

- [ ] Architecture-impacting change? Reviewed `.cursor/rules/architecture.mdc` (surface boundary, file placement, client/server split).
- [ ] New public route? Added to `src/app/sitemap.ts` and `navLinks` / footer where applicable.
- [ ] New `/app/*` tab? Registered in `src/components/app-shell.tsx`.
- [ ] Product copy? Lives in `src/lib/content/` with sources — not inline JSX.
- [ ] Layout, routing, or shared components changed? If yes, updated `README.md`.
- [ ] New env vars or config? Documented in `.env.example` or `README.md`.
- [ ] Accessibility or responsive behavior changed? Noted viewports and a11y checks in test plan.
- [ ] No secrets included (`.env`, API keys, tokens).
