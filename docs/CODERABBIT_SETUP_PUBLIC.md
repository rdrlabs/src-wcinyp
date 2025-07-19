# CodeRabbit Code Review Setup

CodeRabbit is an AI-powered code review tool that automatically reviews pull requests to help maintain code quality.

## What is CodeRabbit?

CodeRabbit provides:
- Automated code reviews within seconds of PR creation
- Security vulnerability detection
- Best practices enforcement
- Performance optimization suggestions
- Accessibility compliance checks

## Setup Instructions

### 1. Install CodeRabbit

1. Visit the [CodeRabbit GitHub App](https://github.com/marketplace/coderabbitai)
2. Click "Install"
3. Select your organization or personal account
4. Choose which repositories to enable

### 2. Configuration

The repository includes a `.coderabbit.yaml` configuration file that:
- Enforces healthcare compliance standards
- Enables security and accessibility checks
- Configures TypeScript strict mode rules
- Sets path-specific review rules

### 3. Using CodeRabbit

#### Automatic Reviews

When you create or update a pull request:
1. CodeRabbit automatically starts reviewing
2. Comments appear within 30-60 seconds
3. Each comment includes:
   - Issue description
   - Suggested fix
   - Severity level (info, warning, error)

#### Interacting with Reviews

You can:
- Reply to comments for clarification
- Request re-review after making changes
- Mark comments as resolved
- Ask CodeRabbit to generate fixes

#### Review Commands

In PR comments, you can use:
- `@coderabbitai review` - Trigger a new review
- `@coderabbitai resolve` - Mark all comments as resolved
- `@coderabbitai help` - Get list of available commands

## Configuration Details

### Review Focus Areas

Our configuration emphasizes:
- **Security**: SQL injection, XSS, authentication issues
- **Performance**: Bundle size, rendering optimization
- **Accessibility**: WCAG compliance, ARIA attributes
- **Code Quality**: TypeScript types, unused code, best practices
- **Healthcare Compliance**: HIPAA considerations, data privacy

### File-Specific Rules

Different rules apply to:
- **Components** (`/src/components`): React best practices, accessibility
- **API Routes** (`/src/app/api`): Security, error handling
- **Utilities** (`/src/lib`): Type safety, documentation
- **Tests** (`/src/__tests__`): Coverage, test quality

## Best Practices

### Before Creating a PR

1. Run local checks:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

2. Review your changes locally
3. Write clear commit messages
4. Update relevant documentation

### After CodeRabbit Review

1. **Address Critical Issues First**: Security and accessibility
2. **Consider All Suggestions**: Even informational ones
3. **Ask for Clarification**: If a suggestion isn't clear
4. **Update and Re-review**: After making significant changes

### Working with AI Suggestions

CodeRabbit may suggest code improvements. When implementing:
1. Understand the suggestion first
2. Adapt to your codebase style
3. Test the changes thoroughly
4. Verify the fix resolves the issue

## Common Review Topics

### Security Issues

- Hardcoded credentials
- SQL injection vulnerabilities
- XSS risks
- Insecure dependencies
- Authentication flaws

### Performance Concerns

- Large bundle imports
- Unnecessary re-renders
- Missing memoization
- Inefficient algorithms
- Memory leaks

### Code Quality

- TypeScript `any` usage
- Missing error handling
- Unused imports/variables
- Complex functions needing refactoring
- Missing documentation

## Customization

To modify review behavior, update `.coderabbit.yaml`:

```yaml
reviews:
  path_instructions:
    - path: "src/components/**"
      instructions: "Focus on accessibility and React best practices"
    - path: "src/app/api/**"
      instructions: "Emphasize security and error handling"
```

## Troubleshooting

### Reviews Not Appearing

1. Check CodeRabbit is installed on the repository
2. Verify the PR is not in draft mode (unless configured)
3. Ensure `.coderabbit.yaml` is valid YAML

### Too Many Comments

Adjust review sensitivity in `.coderabbit.yaml`:
```yaml
reviews:
  review_level: "regular"  # or "chill" for fewer comments
```

### False Positives

You can:
1. Explain why the code is correct in a comment
2. Configure path-specific rules to skip certain checks
3. Use inline comments like `// coderabbit-ignore` (if supported)

## Benefits

Using CodeRabbit helps:
- **Catch issues early**: Before they reach production
- **Learn best practices**: Through consistent feedback
- **Save review time**: Automated checks free up human reviewers
- **Maintain standards**: Enforce team coding guidelines
- **Improve security**: Detect vulnerabilities automatically

## Support

- **CodeRabbit Issues**: Check their [documentation](https://docs.coderabbit.ai)
- **Configuration Help**: See the `.coderabbit.yaml` file
- **Integration Problems**: Contact your repository administrator