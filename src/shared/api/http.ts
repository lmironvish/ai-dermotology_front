export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | null;
  errorMessage?: string;
}

function buildUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

async function parseErrorDetails(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

async function request(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const response = await fetch(buildUrl(baseUrl, path), options);

  if (!response.ok) {
    const details = await parseErrorDetails(response);
    throw new ApiError(
      options.errorMessage ?? `Request failed with status ${response.status}.`,
      response.status,
      details,
    );
  }

  return response;
}

export async function requestResponse(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  return request(baseUrl, path, options);
}

export async function requestJson<TResponse>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const response = await request(baseUrl, path, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function requestBlob(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<Blob> {
  const response = await request(baseUrl, path, options);
  return response.blob();
}

export async function requestVoid(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<void> {
  await request(baseUrl, path, options);
}
