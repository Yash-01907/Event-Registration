import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get('/events');
      return data;
    },
  });
}

export function useEvent(id) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

/** My registrations - used to show "Registered" on event cards. Only runs when user is logged in. */
export function useMyRegistrations() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const { data } = await api.get('/registrations/my');
      return data;
    },
    enabled: !!user,
  });
}

/** My events - faculty's own events for the dashboard. Only runs when user is logged in. */
export function useMyEvents() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const { data } = await api.get('/events/my-events');
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateEvent(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.put(`/events/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const { data } = await api.post('/events', eventData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const { data } = await api.delete(`/events/${eventId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
  });
}
