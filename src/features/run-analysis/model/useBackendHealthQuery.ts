import { useQuery } from "@tanstack/react-query";
import { env } from "@/app/config/env";
import { getHealth } from "../api/caseApi";

const BACKEND_HEALTH_POLL_INTERVAL_MS = 30000;

export function useBackendHealthQuery() {
  const isEnabled = env.analysisApiMode === "real" && Boolean(env.apiBaseUrl);

  return useQuery({
    queryKey: ["backend", "health"],
    queryFn: getHealth,
    enabled: isEnabled,
    retry: false,
    refetchInterval: BACKEND_HEALTH_POLL_INTERVAL_MS,
    staleTime: 10000,
  });
}
