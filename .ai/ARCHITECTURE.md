# src-wcinyp Architecture

## Overview

Medical administrative tool built with clean architecture principles, modular design, and maintainability as the foundation for success.

## Core Principles

1. **Clean Architecture** - Domain logic independent of frameworks
2. **Modular Design** - Feature modules with clear boundaries
3. **Type Safety** - TypeScript throughout with strict mode
4. **Test Coverage** - Unit and integration tests for confidence
5. **Framework Agnostic Domain** - Business logic doesn't know about React

## Directory Structure

```
src-wcinyp/
├── app/                    # React Router application shell
│   ├── routes/            # Route components (thin presentation layer)
│   ├── components/        # Shared UI components
│   ├── lib/              # Utilities
│   └── root.tsx          # App root with navigation
├── modules/               # Feature modules (DDD bounded contexts)
│   ├── documents/
│   │   ├── domain/       # Business entities, value objects
│   │   ├── application/  # Use cases, application services
│   │   ├── infrastructure/ # External services, repositories
│   │   └── presentation/ # UI components, view models
│   ├── providers/
│   ├── forms/
│   └── reports/
├── shared/               # Cross-cutting concerns
│   ├── ui/              # shadcn/ui components
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Pure utility functions
└── public/              # Static assets
```

## Layer Dependencies

```
┌─────────────────┐
│  Presentation   │ ← Routes, Components, UI
├─────────────────┤
│  Application    │ ← Use Cases, Orchestration
├─────────────────┤
│     Domain      │ ← Business Logic, Entities
├─────────────────┤
│ Infrastructure  │ ← External Services, APIs
└─────────────────┘
        ↑
    [ Shared ]
```

### Dependency Rules
- **Domain** has zero dependencies (pure business logic)
- **Application** depends only on Domain
- **Infrastructure** implements Domain interfaces
- **Presentation** depends on Application (never directly on Domain)
- **Shared** can be used by all layers

## Module Structure

Each module follows this structure:

```typescript
// modules/documents/domain/entities/Document.ts
export class Document {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    private _status: DocumentStatus
  ) {}
  
  // Business logic here
  canBeDownloaded(): boolean {
    return this._status === DocumentStatus.APPROVED;
  }
}

// modules/documents/application/usecases/DownloadDocument.ts
export class DownloadDocumentUseCase {
  constructor(
    private documentRepo: DocumentRepository,
    private storageService: StorageService
  ) {}
  
  async execute(documentId: string): Promise<DownloadUrl> {
    const document = await this.documentRepo.findById(documentId);
    if (!document.canBeDownloaded()) {
      throw new DocumentNotAvailableError();
    }
    return this.storageService.generateDownloadUrl(document);
  }
}

// modules/documents/infrastructure/NetlifyStorageService.ts
export class NetlifyStorageService implements StorageService {
  async generateDownloadUrl(document: Document): Promise<DownloadUrl> {
    // Netlify-specific implementation
  }
}

// modules/documents/presentation/DocumentList.tsx
export function DocumentList() {
  const downloadDocument = useDownloadDocument(); // Uses use case
  // Thin UI layer
}
```

## Tech Stack

- **Framework**: React Router v7 (with SSR)
- **UI Library**: shadcn/ui + Tailwind CSS v3.4
- **Language**: TypeScript (strict mode)
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Netlify (serverless functions)

## Route Structure

Routes are thin presentation layers that:
1. Load data via React Router loaders
2. Delegate to use cases for business logic
3. Render UI components

```typescript
// app/routes/documents.tsx
export async function loader({ request }: LoaderArgs) {
  const useCase = container.get(GetDocumentsUseCase);
  const documents = await useCase.execute();
  return { documents };
}

export default function DocumentsRoute({ loaderData }) {
  // Thin UI that uses loaded data
}
```

## Testing Strategy

### Unit Tests
- Domain entities and value objects
- Use cases in isolation
- Pure utility functions

### Integration Tests
- Module boundaries
- Use cases with real infrastructure
- Route components with loaders

### E2E Tests
- Critical user workflows
- Full stack testing

## Development Workflow

1. **Start with Domain** - Define entities and business rules
2. **Create Use Cases** - Orchestrate domain logic
3. **Write Tests** - Verify behavior before implementation
4. **Build Infrastructure** - Implement external services
5. **Add Presentation** - Thin UI layer
6. **Integrate** - Wire into routes

## Benefits

- **Maintainable** - Changes are localized to modules
- **Testable** - Each layer can be tested independently
- **Scalable** - Add modules without increasing complexity
- **Flexible** - Swap implementations easily
- **Clear** - Obvious where code belongs

## Current State

- ✅ Routes properly registered and accessible
- ✅ Navigation using React Router components
- ✅ TypeScript configured correctly
- ✅ Module structure created
- ✅ Integration tests for all routes
- 🚧 Migrating features to modules
- 🚧 Implementing domain logic

## Next Steps

1. Move route logic to modules
2. Create domain entities for each module
3. Implement use cases
4. Add comprehensive tests
5. Document module APIs