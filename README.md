
# AI Dermatology Frontend

Frontend application for dermatological image analysis with support for:
- `mock` mode for local UI development
- `real + cases` backend flow
- `real + simple` placeholder backend flow

Original design source:
https://www.figma.com/design/fTclQgJ7bjyIgjjnO7OzVJ/AI-Dermatology-Landing-Page

## Run locally

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`
3. Start the dev server:
   `npm run dev`

## Environment variables

Defined in `.env.example`:

```env
VITE_ANALYSIS_API_MODE=mock
VITE_ANALYSIS_API_BACKEND=cases
VITE_API_BASE_URL=http://localhost:8000
VITE_ANALYSIS_POLL_INTERVAL_MS=2000
VITE_ANALYSIS_POLL_TIMEOUT_MS=120000
```

## Backend modes

### 1. Mock mode

Use for frontend-only development.

```env
VITE_ANALYSIS_API_MODE=mock
```

In this mode the app generates a demo PDF locally and does not call the backend.

### 2. Real mode with `cases` API

Use for the backend flow based on:
- `POST /cases`
- `POST /cases/{caseId}/image`
- `POST /cases/{caseId}/analyze`
- `GET /cases/{caseId}`
- `POST /cases/{caseId}/reports/pdf`
- `GET /cases/{caseId}/reports/pdf`

```env
VITE_ANALYSIS_API_MODE=real
VITE_ANALYSIS_API_BACKEND=cases
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Real mode with placeholder `simple` API

Use for the simplified integration flow:
- `POST /api/analysis`
- `GET /api/analysis/{id}/status`
- `GET /api/analysis/{id}/report`

```env
VITE_ANALYSIS_API_MODE=real
VITE_ANALYSIS_API_BACKEND=simple
VITE_API_BASE_URL=http://localhost:8000
```

## Notes

- `VITE_ANALYSIS_POLL_INTERVAL_MS` controls how often frontend polls backend status.
- `VITE_ANALYSIS_POLL_TIMEOUT_MS` controls the maximum waiting time for analysis/report generation.
- If `VITE_ANALYSIS_API_BACKEND` is not set, the app defaults to `cases`.
  
