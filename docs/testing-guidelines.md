# Testing Guidelines

## Overview

This document outlines the testing standards and best practices for the application.

## Testing Framework

- **Framework**: Jest
- **Frontend Testing**: Jest with React Test Utils
- **Backend Testing**: Jest with Node.js

## Test Coverage Requirements

- Write tests for critical business logic
- Test both happy paths and error scenarios
- Focus on quality over quantity

## Frontend Testing

### Unit Tests
- Test individual React components in isolation
- Mock external dependencies and API calls
- Use React Testing Library for component testing
- Test user interactions and state changes

### Test Location
- Place tests in `__tests__/` directories adjacent to the code being tested
- Use `.test.js` file extension for test files

### Example Test Structure
```javascript
describe('Component Name', () => {
  test('should render correctly', () => {
    // Test implementation
  });

  test('should handle user interaction', () => {
    // Test implementation
  });
});
```

## Backend Testing

### Unit Tests
- Test individual functions and routes
- Mock database calls and external services
- Verify error handling and edge cases

### Test Location
- Place tests in `__tests__/` directories
- Use `.test.js` file extension for test files

### Example Test Structure
```javascript
describe('API Endpoint', () => {
  test('should return expected data', () => {
    // Test implementation
  });

  test('should handle errors gracefully', () => {
    // Test implementation
  });
});
```

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run tests with coverage: `npm test -- --coverage`
- Run tests for a specific package: `cd packages/frontend && npm test`

## Best Practices

1. **Write tests as you code**: Test-driven development (TDD) is encouraged
2. **Keep tests simple**: Each test should verify one behavior
3. **Use descriptive names**: Test names should clearly describe what is being tested
4. **Avoid testing implementation details**: Focus on testing behavior and user interactions
5. **Mock external dependencies**: Isolate the code being tested from external services
6. **Clean up after tests**: Reset state and clean up resources after each test
7. **Use fixtures**: Create reusable test data for consistency

## Continuous Integration

- Tests run automatically on pull requests
- All tests must pass before merging to main branch
- Coverage reports should be reviewed for regressions
