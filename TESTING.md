# FlexPrice MCP Server Testing Guide

This guide explains the testing approach for the FlexPrice MCP server, including how to run tests and create new ones.

## Testing Architecture

The project uses Jest as the testing framework with TypeScript support via ts-jest. The testing approach follows these principles:

1. **Unit Testing**: Each component is tested in isolation with dependencies mocked
2. **Integration Testing**: Key integration points are tested to ensure components work together
3. **Mock-based Testing**: External dependencies (API calls) are mocked to enable fast, reliable tests

## Directory Structure

Tests are organized to mirror the source code structure:

```
src/
├── __tests__/            # All test files
│   ├── services/         # Tests for service classes
│   ├── mcp/              # Tests for MCP components
│   │   ├── handlers/     # Tests for MCP handlers
│   │   └── tools/        # Tests for MCP tools
│   └── utils/            # Tests for utility functions
├── services/             # Service implementations
├── mcp/                  # MCP components
└── utils/                # Utility functions
```

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

### Test File Naming

- Test files should be named with `.test.ts` or `.spec.ts` suffix
- Place test files in the `__tests__` directory that mirrors the structure of the code being tested

### Example: Testing a Service

```typescript
// src/__tests__/services/myService.test.ts
import myService from "../../services/myService";
import apiClient from "../../utils/apiClient";

// Mock dependencies
jest.mock("../../utils/apiClient");
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("My Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch data correctly", async () => {
    // Arrange
    const mockData = { id: "123", name: "Test" };
    mockedApiClient.get.mockResolvedValueOnce({ data: mockData });

    // Act
    const result = await myService.getData("123");

    // Assert
    expect(mockedApiClient.get).toHaveBeenCalledWith("/endpoint/123");
    expect(result).toEqual(mockData);
  });

  test("should handle errors", async () => {
    // Arrange
    mockedApiClient.get.mockRejectedValueOnce(new Error("API Error"));

    // Act & Assert
    await expect(myService.getData("123")).rejects.toThrow("API Error");
  });
});
```

### Testing Utilities

The project includes testing utilities in `src/__tests__/testUtils.ts` to make creating tests easier:

```typescript
import {
  createMockCustomer,
  mockApiResponse,
  mockApiError,
} from "../testUtils";

// Create mock data
const customer = createMockCustomer({ name: "Custom Name" });

// Mock a successful API response
mockedApiClient.get.mockImplementation(() => mockApiResponse(customer));

// Mock an API error
mockedApiClient.get.mockImplementation(() => mockApiError(404, "Not Found"));
```

## Best Practices

1. **Mock External Dependencies**: Always mock external dependencies like API calls
2. **Test Error Handling**: Ensure your tests cover error cases
3. **Clear Mocks Between Tests**: Use `beforeEach(() => jest.clearAllMocks())` to reset mocks
4. **Use Descriptive Test Names**: Name tests to describe the expected behavior
5. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
6. **Test Edge Cases**: Include tests for edge cases and boundary conditions

## Coverage Requirements

The project has the following coverage thresholds:

- Statements: 24%
- Branches: 18%
- Functions: 4%
- Lines: 24%

As test coverage improves over time, these thresholds should be gradually increased.

You can view detailed coverage information in the `coverage` directory after running tests with coverage.
