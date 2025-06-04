# Contributing to KiraTakip

Thank you for your interest in contributing to KiraTakip! This document provides guidelines and information for contributors.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/kiratakip.git
   cd kiratakip
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Configure your local database and settings
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
kiratakip/
├── client/src/           # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared types and schemas
├── docs/                # Documentation
└── tests/               # Test files
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Frontend Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility best practices
- Use shadcn/ui components when possible
- Maintain responsive design principles

### Backend Guidelines

- Follow RESTful API conventions
- Implement proper error handling
- Use middleware for common functionality
- Validate all input data with Zod schemas
- Follow security best practices

### Database Guidelines

- Use Drizzle ORM for database operations
- Create proper migrations for schema changes
- Add indexes for performance optimization
- Follow normalized database design

## Contribution Types

### Bug Fixes

1. Create an issue describing the bug
2. Include steps to reproduce
3. Provide expected vs actual behavior
4. Submit a pull request with the fix

### New Features

1. Discuss the feature in an issue first
2. Get approval from maintainers
3. Implement the feature following guidelines
4. Add appropriate tests
5. Update documentation

### Documentation

- Fix typos and improve clarity
- Add examples and use cases
- Update API documentation
- Improve setup instructions

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Documentation is updated
- [ ] Changes are tested locally

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information
```

### Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Address feedback and comments
4. Final approval and merge

## Coding Standards

### TypeScript

```typescript
// Use proper typing
interface PropertyData {
  id: number;
  address: string;
  monthlyRent: string;
}

// Use descriptive function names
const calculateTotalRevenue = (payments: Payment[]): number => {
  return payments
    .filter(payment => payment.status === 'paid')
    .reduce((total, payment) => total + parseFloat(payment.amount), 0);
};

// Add JSDoc for complex functions
/**
 * Calculates overdue payments with penalties
 * @param payments - Array of payment records
 * @param penaltyRate - Daily penalty rate (default: 0.001)
 * @returns Array of payments with calculated penalties
 */
const calculateOverduePayments = (
  payments: Payment[], 
  penaltyRate: number = 0.001
): PaymentWithPenalty[] => {
  // Implementation
};
```

### React Components

```tsx
// Use proper prop types
interface PropertyCardProps {
  property: PropertyWithDetails;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}

// Use descriptive component names
export default function PropertyManagementCard({ 
  property, 
  onEdit, 
  onDelete 
}: PropertyCardProps) {
  // Component logic
}

// Use custom hooks for complex logic
const usePropertyFilter = (properties: Property[]) => {
  const [filteredProperties, setFilteredProperties] = useState(properties);
  
  // Hook logic
  
  return { filteredProperties, applyFilter };
};
```

### CSS/Styling

```css
/* Use consistent class naming */
.property-card {
  @apply border rounded-lg p-4 hover:shadow-md transition-shadow;
}

.property-card__header {
  @apply flex items-center justify-between mb-4;
}

.property-card__title {
  @apply text-lg font-semibold text-gray-800;
}
```

## Testing Guidelines

### Unit Tests

```typescript
// Test individual functions
describe('calculateTotalRevenue', () => {
  it('should calculate total revenue from paid payments', () => {
    const payments = [
      { status: 'paid', amount: '1000' },
      { status: 'pending', amount: '500' },
      { status: 'paid', amount: '750' }
    ];
    
    expect(calculateTotalRevenue(payments)).toBe(1750);
  });
});
```

### Integration Tests

```typescript
// Test API endpoints
describe('POST /api/properties', () => {
  it('should create a new property', async () => {
    const propertyData = {
      type: 'Daire',
      address: 'Test Address',
      monthlyRent: '2000'
    };
    
    const response = await request(app)
      .post('/api/properties')
      .send(propertyData)
      .expect(201);
      
    expect(response.body.address).toBe('Test Address');
  });
});
```

## Security Guidelines

### Input Validation

```typescript
// Always validate input data
const createPropertySchema = z.object({
  type: z.string().min(1).max(50),
  address: z.string().min(5).max(200),
  monthlyRent: z.string().regex(/^\d+$/)
});

app.post('/api/properties', (req, res) => {
  const validatedData = createPropertySchema.parse(req.body);
  // Use validatedData instead of req.body
});
```

### Authentication

```typescript
// Use proper authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.get('/api/protected-route', requireAuth, (req, res) => {
  // Protected route logic
});
```

## Performance Guidelines

### Database Queries

```typescript
// Use proper indexing and efficient queries
const getPropertiesWithDetails = async () => {
  return await db
    .select()
    .from(properties)
    .leftJoin(landlords, eq(properties.landlordId, landlords.id))
    .leftJoin(tenants, eq(properties.tenantId, tenants.id))
    .limit(100); // Always limit large queries
};
```

### Frontend Optimization

```tsx
// Use React.memo for expensive components
const PropertyCard = React.memo(({ property }: PropertyCardProps) => {
  return <div>{/* Component content */}</div>;
});

// Use useMemo for expensive calculations
const totalRevenue = useMemo(() => {
  return payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
}, [payments]);
```

## Documentation

### API Documentation

- Document all endpoints with examples
- Include request/response schemas
- Add error response examples
- Update OpenAPI specifications

### Code Documentation

```typescript
/**
 * Manages property rental operations
 * 
 * @example
 * ```typescript
 * const manager = new PropertyManager();
 * const property = await manager.createProperty({
 *   type: 'Daire',
 *   address: 'Sample Address'
 * });
 * ```
 */
class PropertyManager {
  /**
   * Creates a new property listing
   * @param data - Property creation data
   * @returns Promise resolving to created property
   * @throws {ValidationError} When data is invalid
   */
  async createProperty(data: CreatePropertyData): Promise<Property> {
    // Implementation
  }
}
```

## Release Process

### Version Numbering

- Follow Semantic Versioning (SemVer)
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Changelog

- Update CHANGELOG.md with each release
- Group changes by type (Added, Changed, Fixed, Removed)
- Include migration notes for breaking changes

## Getting Help

- Create an issue for bugs or questions
- Join discussions in existing issues
- Contact maintainers for complex questions
- Check documentation first

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to KiraTakip!