# Coding Guidelines

## Overview

This document outlines the coding style, quality principles, and best practices for the Copilot Bootcamp project. These guidelines ensure consistency, maintainability, and quality across the codebase. All contributors should follow these standards when writing code for both the frontend and backend packages.

## General Principles

### Code Quality

**DRY (Don't Repeat Yourself)**: Avoid code duplication by extracting common logic into reusable functions, components, or modules. If you find yourself writing similar code in multiple places, consider creating a shared utility or component.

**KISS (Keep It Simple, Stupid)**: Write simple, straightforward code that is easy to understand and maintain. Avoid over-engineering solutions or adding unnecessary complexity.

**Single Responsibility Principle**: Each function, component, or module should have one clear purpose. If a function is doing too many things, break it down into smaller, focused functions.

**Separation of Concerns**: Keep business logic, presentation logic, and data handling separate. In React, this means separating data fetching from rendering. In the backend, separate routing, business logic, and data access.

## Code Formatting

### Indentation and Spacing

- Use **2 spaces** for indentation (no tabs)
- Add blank lines between logical sections of code to improve readability
- Keep line length reasonable (aim for 80-100 characters, but not a hard limit)
- Add a single blank line at the end of each file

### Semicolons

- Use semicolons consistently at the end of statements
- Follow the existing patterns in the codebase

### Quotes

- Prefer **single quotes** (`'`) for strings in JavaScript
- Use double quotes for JSON and JSX attributes when necessary
- Use template literals (backticks) for string interpolation

```javascript
// Good
const message = 'Hello world';
const greeting = `Hello ${name}`;

// Avoid
const message = "Hello world";
```

### Braces and Control Structures

- Always use braces for control structures, even for single-line blocks
- Place opening braces on the same line as the control statement
- Use consistent spacing around operators and keywords

```javascript
// Good
if (condition) {
  doSomething();
}

// Avoid
if (condition) doSomething();
```

## Import Organization

Organize imports in a logical and consistent order to improve code readability:

### Frontend (React)

1. **External libraries** (React, third-party packages)
2. **Internal components** (relative imports)
3. **Styles** (CSS imports)
4. **Assets** (images, icons)

```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Internal components
import Header from './components/Header';
import TodoList from './components/TodoList';

// Styles
import './App.css';
import './theme.css';

// Assets
import logo from './images/logo.png';
```

### Backend (Node.js)

1. **Core Node.js modules** (built-in modules)
2. **External packages** (npm dependencies)
3. **Internal modules** (relative imports)

```javascript
// Core Node.js modules
const path = require('path');
const fs = require('fs');

// External packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Internal modules
const routes = require('./routes');
const database = require('./database');
```

### Grouping and Spacing

- Add blank lines between import groups for clarity
- Sort imports alphabetically within each group when practical
- Avoid wildcard imports unless necessary

## Naming Conventions

### Variables and Functions

- Use **camelCase** for variables and function names
- Use descriptive names that clearly indicate purpose
- Boolean variables should be prefixed with `is`, `has`, `should`, etc.

```javascript
// Good
const userName = 'John';
const isLoading = true;
const hasError = false;

function fetchUserData() { }
function handleSubmit() { }

// Avoid
const un = 'John';
const loading = true;
function fetch() { }
```

### React Components

- Use **PascalCase** for component names
- Name components based on their purpose or what they render
- Use descriptive names for component files matching the component name

```javascript
// Good
function TodoItem() { }
function UserProfile() { }
function NavigationBar() { }

// Avoid
function todoitem() { }
function Component1() { }
```

### Constants

- Use **UPPER_SNAKE_CASE** for true constants
- Group related constants together

```javascript
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;
```

### Files and Directories

- Use **kebab-case** for directory names: `user-profile`, `api-routes`
- Use **PascalCase** for component files: `TodoList.js`, `Header.js`
- Use **camelCase** for utility and helper files: `dateUtils.js`, `apiHelpers.js`
- Use **lowercase** for configuration files: `jest.config.js`, `package.json`

## Code Quality Practices

### Error Handling

- Always handle errors gracefully with try-catch blocks
- Provide meaningful error messages
- Log errors for debugging purposes
- Return appropriate error responses in API endpoints

```javascript
// Good
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error fetching data:', error);
  setError('Failed to load data. Please try again.');
}

// Backend
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});
```

### Async/Await

- Prefer `async/await` over promise chains for better readability
- Always handle errors in async functions
- Use proper error boundaries in React for async errors

```javascript
// Good
const fetchData = async () => {
  try {
    const response = await fetch('/api/items');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Avoid
const fetchData = () => {
  return fetch('/api/items')
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));
};
```

### Comments and Documentation

- Write self-documenting code with clear variable and function names
- Add comments only when necessary to explain **why**, not **what**
- Use JSDoc comments for public APIs and complex functions
- Keep comments up-to-date with code changes

```javascript
// Good - comment explains the "why"
// Calculate total with 15% holiday discount applied
const total = subtotal * 0.85;

// Avoid - comment restates the obvious
// Set the total variable
const total = subtotal * 0.85;

/**
 * Fetches user data from the API
 * @param {string} userId - The unique identifier for the user
 * @returns {Promise<Object>} User data object
 */
async function fetchUserData(userId) {
  // Implementation
}
```

### React-Specific Guidelines

#### Hooks

- Follow the Rules of Hooks (only call at the top level)
- Extract complex logic into custom hooks
- Keep hooks organized at the top of components

```javascript
function TodoApp() {
  // State hooks
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Effect hooks
  useEffect(() => {
    fetchItems();
  }, []);
  
  // Component logic and render
}
```

#### Props and State

- Destructure props at the function parameter level
- Use prop validation or TypeScript for type safety
- Keep state as local as possible

```javascript
// Good
function TodoItem({ title, completed, onToggle }) {
  return (
    <div onClick={() => onToggle()}>
      {title}
    </div>
  );
}

// Avoid
function TodoItem(props) {
  return (
    <div onClick={() => props.onToggle()}>
      {props.title}
    </div>
  );
}
```

### Backend-Specific Guidelines

#### Route Handlers

- Keep route handlers thin, delegate logic to service functions
- Use middleware for cross-cutting concerns
- Return consistent response formats

```javascript
// Good
app.post('/api/items', async (req, res) => {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});
```

#### Database Operations

- Use parameterized queries to prevent SQL injection
- Handle database errors appropriately
- Keep database logic separate from route handlers

```javascript
// Good - parameterized query
const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
const item = stmt.get(itemId);

// Avoid - string concatenation (SQL injection risk)
const query = `SELECT * FROM items WHERE id = ${itemId}`;
```

## Linting and Formatting

### ESLint

- Use ESLint to enforce code quality and catch common errors
- Configure ESLint rules that align with project standards
- Run linter before committing code
- Address linting errors promptly

### Prettier (Optional)

- Consider using Prettier for automatic code formatting
- Configure Prettier to match project style preferences
- Integrate with your editor for format-on-save

### Pre-commit Hooks

- Set up pre-commit hooks to run linters automatically
- Ensure all code passes linting before being committed
- Use tools like `husky` and `lint-staged` for automation

## Version Control Practices

### Commits

- Write clear, descriptive commit messages
- Use present tense: "Add feature" not "Added feature"
- Keep commits focused on a single logical change
- Reference issue numbers when applicable

```
Good commit messages:
- Add Christmas theme to header component
- Fix error handling in todo item deletion
- Update API endpoint to support filtering

Avoid:
- Fixed stuff
- WIP
- asdf
```

### Branches

- Use feature branches for new development
- Follow branch naming conventions: `feature/`, `bugfix/`, `hotfix/`
- Keep branches up-to-date with the main branch
- Delete branches after merging

## Testing

Refer to the [Testing Guidelines](./testing-guidelines.md) for comprehensive testing standards.

### Key Testing Principles

- Write tests for all new features and bug fixes
- Test behavior, not implementation details
- Keep tests simple and focused
- Use descriptive test names
- Mock external dependencies

## Performance Considerations

### Frontend

- Minimize re-renders using `React.memo`, `useMemo`, and `useCallback`
- Lazy load components when appropriate
- Optimize images and assets
- Avoid unnecessary state updates

### Backend

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache responses when appropriate
- Monitor and optimize slow queries

## Security Best Practices

- Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables for configuration
- Validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Keep dependencies up-to-date

## Continuous Improvement

These guidelines are living documents and should evolve with the project. Team members are encouraged to:

- Propose improvements to coding standards
- Share knowledge and best practices
- Review and refactor existing code to align with guidelines
- Stay updated with modern JavaScript and React patterns

## Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [React Documentation](https://react.dev/) - Official React docs
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

By following these guidelines, we maintain a clean, consistent, and high-quality codebase that is easy to understand, maintain, and extend.
