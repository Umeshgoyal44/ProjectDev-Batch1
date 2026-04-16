import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = authTokenGetter?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message ?? "Request failed";
    throw new Error(message);
  }

  return payload;
}

function toQueryString(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getGetAdminStatsQueryKey() {
  return ["get-admin-stats"];
}

export function getGetDashboardStatsQueryKey() {
  return ["get-dashboard-stats"];
}

export function getListNotificationsQueryKey() {
  return ["list-notifications"];
}

export function getListRidesQueryKey(filters) {
  return ["list-rides", filters ?? null];
}

export function getGetUserQueryKey(userId) {
  return ["get-user", userId];
}

export function getListRatingsQueryKey(params) {
  return ["list-ratings", params.userId];
}

export function getGetRideQueryKey(rideId) {
  return ["get-ride", rideId];
}

export function getListMessagesQueryKey(params) {
  return ["list-messages", params.rideId];
}

export function useGetMe(options) {
  return useQuery({
    queryKey: ["get-me"],
    queryFn: async () => apiRequest("/auth/me"),
    ...options?.query,
  });
}

export function useGetAdminStats(options) {
  return useQuery({
    queryKey: getGetAdminStatsQueryKey(),
    queryFn: async () => apiRequest("/admin/stats"),
    ...options?.query,
  });
}

export function useGetDashboardStats(options) {
  return useQuery({
    queryKey: getGetDashboardStatsQueryKey(),
    queryFn: async () => apiRequest("/dashboard/stats"),
    ...options?.query,
  });
}

export function useGetRecentRides(options) {
  return useQuery({
    queryKey: ["get-recent-rides"],
    queryFn: async () => apiRequest("/rides/recent"),
    ...options?.query,
  });
}

export function useListNotifications(options) {
  return useQuery({
    queryKey: getListNotificationsQueryKey(),
    queryFn: async () => apiRequest("/notifications"),
    ...options?.query,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => apiRequest(`/notifications/${id}/read`, { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apiRequest("/notifications/read-all", { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useGetUser(userId, options) {
  return useQuery({
    queryKey: getGetUserQueryKey(userId),
    queryFn: async () => apiRequest(`/users/${userId}`, { auth: false }),
    enabled: options?.query?.enabled ?? true,
    retry: options?.query?.retry,
    ...options?.query,
  });
}

export function useListRatings(params, options) {
  return useQuery({
    queryKey: getListRatingsQueryKey(params),
    queryFn: async () => apiRequest(`/users/${params.userId}/ratings`, { auth: false }),
    enabled: options?.query?.enabled ?? true,
    retry: options?.query?.retry,
    ...options?.query,
  });
}

export function useCreateRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) => apiRequest("/rides", { method: "POST", body: data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: ["get-recent-rides"] });
      await queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    },
  });
}

export function useListRides(filters = {}, options) {
  return useQuery({
    queryKey: getListRidesQueryKey(filters),
    queryFn: async () => apiRequest(`/rides${toQueryString(filters)}`),
    ...options?.query,
  });
}

export function useGetRide(rideId, options) {
  return useQuery({
    queryKey: getGetRideQueryKey(rideId),
    queryFn: async () => apiRequest(`/rides/${rideId}`),
    enabled: options?.query?.enabled ?? true,
    retry: options?.query?.retry,
    ...options?.query,
  });
}

export function useListMessages(params, options) {
  return useQuery({
    queryKey: getListMessagesQueryKey(params),
    queryFn: async () => apiRequest(`/rides/${params.rideId}/messages`),
    ...options?.query,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) => apiRequest("/messages", { method: "POST", body: data }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ rideId: variables.data.rideId }) });
    },
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) =>
      apiRequest(`/rides/${data.rideId}/requests`, {
        method: "POST",
        body: { seats: data.seats, message: data.message },
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(variables.data.rideId) });
      await queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => apiRequest(`/requests/${id}/accept`, { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => apiRequest(`/requests/${id}/reject`, { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useCompleteRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => apiRequest(`/rides/${id}/complete`, { method: "POST" }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(variables.id) });
      await queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    },
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) => apiRequest("/ratings", { method: "POST", body: data }),
    onSuccess: async (_data, variables) => {
      if (variables?.data?.ratedUserId) {
        await queryClient.invalidateQueries({ queryKey: getListRatingsQueryKey({ userId: variables.data.ratedUserId }) });
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ data }) => apiRequest("/auth/login", { method: "POST", body: data, auth: false }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ data }) => apiRequest("/auth/register", { method: "POST", body: data, auth: false }),
  });
}
