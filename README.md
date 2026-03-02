# Flowbit CRM

A Projects-first CRM built with React + Firebase, focused on workspace clearity and productive focus.

## Tech Stack
- **Frontend:** React (TypeScript), Vite, Tailwind CSS 4.
- **UI:** Custom components inspired by Shadcn/UI (Inter font, emerald/indigo palette).
- **Backend:** Firebase Auth & Firestore.
- **State Management:** TanStack Query (React Query).
- **Icons:** Lucide React.
- **Validation:** Zod + React Hook Form.

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Firebase:**
   Copy `.env.example` to `.env` and fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   `.env` is ignored by Git and must never be committed.
4. **Deploy Security Rules:**
   Copy the content of `firestore.rules` to your Firebase Console or deploy via Firebase CLI.

## Required Firestore Indexes

To ensure all queries work correctly, deploy the following composite indexes:

| Collection | Fields | Sort Order |
| :--- | :--- | :--- |
| `tasks` | `workspaceId` (ASC), `scheduledDate` (ASC), `status` (ASC) | Composite |
| `projects` | `workspaceId` (ASC), `status` (ASC), `createdAt` (DESC) | Composite |
| `clients` | `workspaceId` (ASC), `stage` (ASC), `name` (ASC) | Composite |
| `activities` | `workspaceId` (ASC), `clientId` (ASC), `date` (DESC) | Composite |
| `activities` | `workspaceId` (ASC), `projectId` (ASC), `date` (DESC) | Composite |

## Project Structure
- `src/features`: Modular feature-based structure (Auth, Clients, Projects, Tasks).
- `src/components/ui`: Custom UI primitives.
- `src/hooks/useFirestore.ts`: Generic hooks for CRUD operations using TanStack Query.
- `src/lib/converters.ts`: Typed Firestore converters for consistent data models.

## Development
```bash
npm run dev
```

## Quality Gates

Run the local validation suite before opening a PR:

```bash
npm run lint
npm run test:run
npm run build
```

For browser-level keyboard and focus regression coverage:

```bash
npx playwright install chromium
npm run test:e2e
```

## Testing Notes

- `npm run test:run` executes the Vitest suite for semantic HTML, accessibility, and keyboard behavior.
- `npm run test:e2e` executes Playwright coverage against controlled testing routes.
- Generated testing artifacts such as `playwright-report/`, `test-results/`, and `blob-report/` are intentionally ignored from Git.

### Testing Routes

Playwright enables internal testing routes with `VITE_ENABLE_TEST_ROUTES=1`. These routes are not exposed in the normal app runtime.

Useful local example on PowerShell:

```powershell
$env:VITE_ENABLE_TEST_ROUTES='1'
npm run dev -- --host 127.0.0.1 --port 4173
```

Available testing routes:

- `/__testing__/clients`
- `/__testing__/settings`
- `/__testing__/dashboard`

## CI and Branch Protection

The repository now includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on pushes to `main` / `master` and on every pull request.

Recommended required status checks for branch protection:

- `lint`
- `test-unit-a11y`
- `build`
- `test-e2e`

Branch protection itself must still be configured in GitHub repository settings:

1. Go to `Settings -> Branches`.
2. Add or edit the protection rule for `main`.
3. Enable `Require status checks to pass before merging`.
4. Select `lint`, `test-unit-a11y`, `build`, and `test-e2e`.

## Security Note

If a secret or token is ever committed:

1. Rotate or revoke it immediately at the provider.
2. Remove the file from Git tracking.
3. Replace it locally through `.env`.
4. Decide whether the repository history also needs a coordinated cleanup.
