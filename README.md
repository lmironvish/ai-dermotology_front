# AI Dermatology Frontend

Frontend-приложение для анализа дерматологических изображений с поддержкой режимов:
- `mock` для локальной разработки интерфейса
- `real + cases` для реального backend-сценария
- `real + simple` для упрощённого placeholder-сценария

## Локальный запуск

1. Установите зависимости:
   `npm install`
2. Скопируйте `.env.example` в `.env`
3. Запустите dev-сервер:
   `npm run dev`

## Переменные окружения

Заданы в `.env.example`:

```env
VITE_ANALYSIS_API_MODE=mock
VITE_ANALYSIS_API_BACKEND=cases
VITE_API_BASE_URL=http://localhost:8000
VITE_ANALYSIS_POLL_INTERVAL_MS=2000
VITE_ANALYSIS_POLL_TIMEOUT_MS=120000
```

## Режимы backend

### 1. Mock-режим

Используется для frontend-разработки без backend.

```env
VITE_ANALYSIS_API_MODE=mock
```

В этом режиме приложение генерирует demo PDF локально и не обращается к backend.

### 2. Real-режим с API `cases`

Используется для основного backend-сценария на базе:
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

### 3. Real-режим с placeholder API `simple`

Используется для упрощённого интеграционного сценария:
- `POST /api/analysis`
- `GET /api/analysis/{id}/status`
- `GET /api/analysis/{id}/report`

```env
VITE_ANALYSIS_API_MODE=real
VITE_ANALYSIS_API_BACKEND=simple
VITE_API_BASE_URL=http://localhost:8000
```

## Примечания

- `VITE_ANALYSIS_POLL_INTERVAL_MS` задаёт интервал опроса статуса backend.
- `VITE_ANALYSIS_POLL_TIMEOUT_MS` задаёт максимальное время ожидания анализа и генерации отчёта.
- Если `VITE_ANALYSIS_API_BACKEND` не указан, приложение по умолчанию использует `cases`.
