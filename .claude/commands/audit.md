# Audit

Review the codebase for issues across these areas:

1. **Security** — Check for exposed secrets, insecure JWT fallbacks, missing auth checks on API routes, and XSS risks in the preview iframe sandbox.
2. **Performance** — Identify unnecessary re-renders, missing `useMemo`/`useCallback`, and heavy imports on the client.
3. **Error handling** — Find unhandled promise rejections, missing error boundaries, and silent failures in AI tool calls.
4. **Type safety** — Look for `any` types, unsafe casts, and missing null checks.
5. **Dead code** — Spot unused exports, unreachable branches, and stale commented-out code.

Report findings grouped by severity: **High**, **Medium**, **Low**.
