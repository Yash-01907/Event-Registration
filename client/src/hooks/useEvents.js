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

/** Registrations for a specific event (event detail page, coordinators view). */
export function useEventRegistrations(id) {
  return useQuery({
    queryKey: ['event-registrations', id],
    queryFn: async () => {
      const { data } = await api.get(`/registrations/event/${id}`);
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

/** Coordinated events - events assigned to the current user as coordinator. Only runs when user is logged in. */
export function useCoordinatedEvents() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['coordinated-events'],
    queryFn: async () => {
      const { data } = await api.get('/events/coordinated-events');
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
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      queryClient.invalidateQueries({ queryKey: ['coordinated-events'] });
    },
  });
}

export function useTogglePublishEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const { data } = await api.patch(`/events/${eventId}/publish`);
      return data;
    },
    onSuccess: (data, eventId) => {
      const newPublished = data?.isPublished;
      queryClient.setQueryData(['events', eventId], (old) =>
        old ? { ...old, isPublished: newPublished } : old
      );
      queryClient.setQueryData(['my-events'], (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((ev) =>
          ev.id === eventId ? { ...ev, isPublished: newPublished } : ev
        );
      });
    },
  });
}

export function useAddCoordinator(eventId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post(`/events/${eventId}/coordinator`, {
        email,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['coordinated-events'] });
    },
  });
}

export function useUploadPoster() {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
}

export function useRegisterForEvent(eventId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload = {}) => {
      const { data } = await api.post('/registrations', {
        eventId,
        ...payload,
      });
      return data;
    },
    onSuccess: (newRegistration) => {
      // Optimistically update cache so UI shows "Registered" immediately
      queryClient.setQueryData(['my-registrations'], (old) => {
        const list = old || [];
        if (list.some((r) => r.id === newRegistration?.id)) return old;
        const reg = {
          ...newRegistration,
          eventId: newRegistration?.eventId ?? eventId,
        };
        return [...list, reg];
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId) => {
      const { data } = await api.delete(`/registrations/${registrationId}`);
      return data;
    },
    onSuccess: (_, registrationId, context) => {
      // Optimistically remove from cache so UI updates immediately
      queryClient.setQueryData(['my-registrations'], (old) =>
        (old || []).filter((r) => r.id !== registrationId)
      );
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      if (context?.eventId) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({
          queryKey: ['events', context.eventId],
        });
      }
    },
  });
}

export function useAddManualRegistration(eventId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const { data: res } = await api.post('/registrations/manual', {
        eventId,
        ...data,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-registrations', eventId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
  });
}
