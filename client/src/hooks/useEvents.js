import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data;
    },
  });
}

export function useEvent(id) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const { data } = await api.post("/events", eventData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
