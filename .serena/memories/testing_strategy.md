# Testing Strategy

## Testing Approach
The portfolio project implements a multi-layered testing strategy to ensure quality and stability:

1. **Unit Testing**: Testing individual components and functions
2. **Integration Testing**: Testing interactions between components
3. **End-to-End Testing**: Testing complete user flows
4. **Manual Testing**: Human verification of features and UI

## Frontend Testing

### Unit Tests
- **Framework**: React Testing Library and Jest
- **Location**: Adjacent to component files (`*.test.tsx`)
- **Coverage Targets**: 
  - Core UI components
  - Custom hooks
  - Utility functions
- **Example Test**:
  ```tsx
  // SkillBar.test.tsx
  import { render, screen } from '@testing-library/react';
  import SkillBar from './SkillBar';
  
  test('renders skill bar with correct percentage', () => {
    render(<SkillBar name="React" percentage={75} color="blue" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });
  ```

### Integration Tests
- **Scope**: Component interactions and page compositions
- **Key Scenarios**:
  - Form submissions
  - Navigation between pages
  - Data loading and display

## Backend Testing

### Unit Tests
- **Framework**: Go's built-in testing package
- **Location**: `server/tests` and adjacent to source files (`*_test.go`)
- **Coverage Targets**:
  - Service functions
  - Data validation
  - Utility functions
- **Example Test**:
  ```go
  // message_service_test.go
  package services

  import (
    "testing"
    "github.com/stretchr/testify/assert"
  )

  func TestValidateMessage(t *testing.T) {
    tests := []struct {
      name    string
      message Message
      wantErr bool
    }{
      {"Valid message", Message{Name: "Test", Email: "test@example.com", Content: "Hello"}, false},
      {"Missing name", Message{Email: "test@example.com", Content: "Hello"}, true},
      {"Invalid email", Message{Name: "Test", Email: "invalid", Content: "Hello"}, true},
    }
    
    for _, tt := range tests {
      t.Run(tt.name, func(t *testing.T) {
        err := ValidateMessage(tt.message)
        if tt.wantErr {
          assert.Error(t, err)
        } else {
          assert.NoError(t, err)
        }
      })
    }
  }
  ```

### API Tests
- **Framework**: Go's httptest package
- **Scope**: HTTP handlers and middleware
- **Key Tests**:
  - Request validation
  - Response formatting
  - Error handling
  - Middleware functionality

## End-to-End Tests
- **Tool**: PowerShell and Bash scripts for integration testing
- **Location**: `server/integration_test.ps1` and `server/integration_test.sh`
- **Coverage**: Critical user flows

## Running Tests

### Frontend Tests
```bash
# Run all frontend tests
cd client
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- SkillBar
```

### Backend Tests
```bash
# Run all tests
cd server
go test ./...

# Run tests with coverage
go test ./... -cover

# Run specific package tests
go test ./services

# Run specific test
go test ./services -run TestValidateMessage
```

### Integration Tests
```bash
# Windows
cd server
.\integration_test.ps1

# Unix/Linux
cd server
./integration_test.sh
```

## Continuous Integration
- Tests run automatically on commit
- Test coverage reports generated
- Build fails if tests fail

## Testing Guidelines
1. Always write tests for new features
2. Maintain minimum 80% code coverage
3. Focus on testing behavior, not implementation
4. Use meaningful test descriptions
5. Keep tests fast and independent

## Test Data
- Use fixtures for consistent test data
- Reset test database between test runs
- Mock external services