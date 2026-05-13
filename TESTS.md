# Automated Tests

This project uses **Vitest** for unit testing the core deterministic audit engine.

## Audit Engine Tests
**File**: `src/lib/audit-engine/__tests__/engine.test.ts`

1. **Team Plan Right-Sizing**: Verifies that a tool on a "Team" plan with only 2 seats is flagged for a downgrade to "Pro/Plus" accounts to save capital.
2. **Consolidation Logic**: Ensures that overlapping tools (e.g., Cursor Business and Windsurf Pro) trigger a consolidation recommendation.
3. **Savings Invariants**: Validates that the total projected savings never exceeds the total current monthly spend.
4. **Already Optimal State**: Confirms that a perfectly optimized stack (e.g., solo developer on Cursor Pro) results in zero manufactured savings and the `isAlreadyOptimal` flag set to true.
5. **High Savings Threshold**: Verifies that the `isHighSavings` flag is correctly triggered when total monthly savings exceed the $500/mo threshold.
6. **Annual Projection**: Ensures the mathematical invariant that annual savings is always exactly 12x the monthly savings projection.

## How to Run Tests

### Local Execution
```bash
npm test
```

### CI/CD
Tests are automatically executed on every push to the `main` branch via GitHub Actions.
**Workflow**: `.github/workflows/ci.yml`
