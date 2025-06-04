# KiraTakip Project Structure

## Current File Organization

### Frontend (`client/src/`)

#### Pages
- `pages/landing.tsx` - Landing page with authentication
- `pages/dashboard-simple.tsx` - Main dashboard
- `pages/tenants.tsx` - Tenant management
- `pages/landlords.tsx` - Landlord management  
- `pages/properties.tsx` - Property management
- `pages/contracts.tsx` - Contract management
- `pages/payments.tsx` - Payment tracking
- `pages/reports.tsx` - Analytics and reports
- `pages/ai-dashboard.tsx` - AI features dashboard
- `pages/settings.tsx` - User settings
- `pages/not-found.tsx` - 404 error page

#### Components
- `components/layout/` - Layout components (sidebar, topbar)
- `components/ui/` - Base UI components (shadcn/ui)
- `components/filters/` - Search and filter components
- `components/modals/` - Modal dialogs
- `components/tables/` - Data table components

#### Utilities
- `lib/queryClient.ts` - API client configuration
- `lib/utils.ts` - Utility functions
- `hooks/` - Custom React hooks

### Backend (`server/`)
- `index.ts` - Server entry point
- `routes.ts` - API route definitions
- `storage.ts` - Data access layer
- `vite.ts` - Development server integration

### Shared (`shared/`)
- `schema.ts` - Database schema and TypeScript types

## Suggested English File Names

### Pages (Rename Suggestions)
```
Current Name                 → Suggested English Name
pages/tenants.tsx           → pages/tenant-management.tsx
pages/landlords.tsx         → pages/landlord-management.tsx
pages/properties.tsx        → pages/property-management.tsx
pages/contracts.tsx         → pages/contract-management.tsx
pages/payments.tsx          → pages/payment-tracking.tsx
pages/reports.tsx           → pages/analytics-reports.tsx
pages/ai-dashboard.tsx      → pages/smart-analytics.tsx
pages/settings.tsx          → pages/user-settings.tsx
```

### Components (Rename Suggestions)
```
components/layout/sidebar.tsx    → components/layout/navigation-sidebar.tsx
components/layout/topbar.tsx     → components/layout/header-bar.tsx
components/filters/             → components/data-filters/
components/modals/              → components/dialog-modals/
components/tables/              → components/data-tables/
```

### Utility Files
```
lib/queryClient.ts          → lib/api-client.ts
hooks/use-mobile.tsx        → hooks/use-mobile-detection.tsx
hooks/use-toast.ts          → hooks/use-notification-toast.ts
```

## Recommended Project Structure

```
kiratakip/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home-dashboard.tsx
│   │   │   ├── tenant-management.tsx
│   │   │   ├── landlord-management.tsx
│   │   │   ├── property-management.tsx
│   │   │   ├── contract-management.tsx
│   │   │   ├── payment-tracking.tsx
│   │   │   ├── analytics-reports.tsx
│   │   │   ├── smart-analytics.tsx
│   │   │   ├── user-settings.tsx
│   │   │   └── error-not-found.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── navigation-sidebar.tsx
│   │   │   │   └── header-bar.tsx
│   │   │   ├── data-filters/
│   │   │   │   ├── advanced-filter.tsx
│   │   │   │   └── quick-search.tsx
│   │   │   ├── data-tables/
│   │   │   │   ├── property-table.tsx
│   │   │   │   ├── tenant-table.tsx
│   │   │   │   └── payment-table.tsx
│   │   │   ├── dialog-modals/
│   │   │   │   ├── property-modal.tsx
│   │   │   │   ├── tenant-modal.tsx
│   │   │   │   └── payment-modal.tsx
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   ├── use-mobile-detection.tsx
│   │   │   └── use-notification-toast.ts
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── utilities.ts
│   │   └── types/
│   │       └── api-types.ts
│   └── public/
├── server/
│   ├── controllers/
│   │   ├── auth-controller.ts
│   │   ├── property-controller.ts
│   │   ├── tenant-controller.ts
│   │   └── payment-controller.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── validation-middleware.ts
│   ├── services/
│   │   ├── database-service.ts
│   │   └── notification-service.ts
│   ├── routes/
│   │   ├── api-routes.ts
│   │   └── auth-routes.ts
│   ├── config/
│   │   └── database-config.ts
│   └── server.ts
├── shared/
│   ├── types/
│   │   ├── database-schema.ts
│   │   ├── api-interfaces.ts
│   │   └── common-types.ts
│   └── constants/
│       └── application-constants.ts
├── docs/
│   ├── README.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Benefits of English File Names

1. **International Collaboration** - Easier for global developers to understand
2. **SEO and Documentation** - Better searchability and documentation
3. **Industry Standards** - Follows common naming conventions
4. **Maintainability** - Clearer code organization and structure
5. **Version Control** - Better commit messages and code reviews

## Implementation Notes

- File renaming should be done gradually to avoid breaking imports
- Update all import statements when renaming files
- Consider using IDE refactoring tools for safe renaming
- Update documentation and README files accordingly
- Maintain backward compatibility during transition period