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
   Create a `.env` file in the root with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
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
