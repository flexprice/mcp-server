# FlexPrice MCP Server Testing Guide

This guide explains how to run and add tests for the FlexPrice MCP server.

## Testing Architecture

The project uses **Jest** with **ts-jest** for TypeScript. The main server is generated from the OpenAPI spec (`src/index.ts`). You can add tests for any custom logic or for helpers you introduce.

- **Unit tests**: Mock external dependencies (e.g. axios) and test behavior in isolation.
- **Naming**: Use `*.test.ts` or `*.spec.ts` and place files under `src/__tests__/` or next to the module under test.

## Directory Structure

Current layout:

```
src/
├── index.ts              # Generated MCP server (from OpenAPI)
└── __tests__/            # Optional: add test files here
    └── *.test.ts
```

Jest is configured in `jest.config.js` (preset ts-jest, ESM). The app is the generated server at repo root (`src/index.ts` → `build/index.js`).

## Running Tests

You can run tests using the following npm commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Creating New Tests

### Test file naming and location

- Use the `.test.ts` or `.spec.ts` suffix.
- Place tests in `src/__tests__/` or alongside the file under test (e.g. `src/__tests__/index.test.ts` for logic extracted from the generated server).

### Example: testing a helper with mocked axios

If you add a helper that calls the API, mock the HTTP client and assert on inputs and outputs:

```typescript
// src/__tests__/myHelper.test.ts
import { myHelper } from "../myHelper";

jest.mock("axios");
const axios = require("axios");

describe("myHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls API with correct URL and returns data", async () => {
    const mockData = { id: "123", name: "Test" };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await myHelper("123");

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/v1/"));
    expect(result).toEqual(mockData);
  });
});
```

For the **generated** `src/index.ts`, the behavior is defined by the OpenAPI spec; regeneration overwrites that file. Prefer testing any custom logic in separate modules and mocking the generated entry if needed.

## Best Practices

1. **Mock External Dependencies**: Always mock external dependencies like API calls
2. **Test Error Handling**: Ensure your tests cover error cases
3. **Clear Mocks Between Tests**: Use `beforeEach(() => jest.clearAllMocks())` to reset mocks
4. **Use Descriptive Test Names**: Name tests to describe the expected behavior
5. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
6. **Test Edge Cases**: Include tests for edge cases and boundary conditions

## Coverage

Run `npm run test:coverage` to generate a coverage report in the `coverage/` directory. You can add coverage thresholds in `jest.config.js` (e.g. `coverageThreshold`) as tests grow.
