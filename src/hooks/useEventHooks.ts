import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import eventService, { Event, EventsResponse, CreateEventRequest, EventRegistration } from "@/api/services/eventService";
import { toast } from "sonner";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: Record<string, any>) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  myEvents: () => [...eventKeys.all, "myEvents"] as const,
  myRegistrations: () => [...eventKeys.all, "myRegistrations"] as const,
  registrations: (eventId: string, params?: Record<string, any>) => [...eventKeys.all, "registrations", eventId, params] as const,
  registration: (id: string) => [...eventKeys.all, "registration", id] as const,
};

// Get all events
export const useGetEvents = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventService.getAllEvents(params),
  });
};

// Get single event by id
export const useGetEventById = (eventId?: string): UseQueryResult<Event> => {
  return useQuery({
    queryKey: eventKeys.detail(eventId || ""),
    queryFn: () => eventService.getEventById(eventId || ""),
    enabled: !!eventId,
  });
};

// Create event
export const useCreateEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => eventService.createEvent(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.all });
      qc.invalidateQueries({ queryKey: eventKeys.myEvents() });
      toast.success("Event created successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create event";
      toast.error(msg);
      console.error("Create event error:", error);
    },
  });
};

// Update event
export const useUpdateEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, formData }: { eventId: string; formData: FormData }) =>
      eventService.updateEvent(eventId, formData),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.myEvents() });
      toast.success("Event updated successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update event";
      toast.error(msg);
      console.error("Update event error:", error);
    },
  });
};

// Delete event
export const useDeleteEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.all });
      qc.invalidateQueries({ queryKey: eventKeys.myEvents() });
      toast.success("Event deleted successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to delete event";
      toast.error(msg);
      console.error("Delete event error:", error);
    },
  });
};

// Register for event
export const useRegisterForEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Record<string, any> }) => eventService.registerForEvent(eventId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.all });
      qc.invalidateQueries({ queryKey: eventKeys.myRegistrations() });
      toast.success("Registered successfully for event!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to register";
      toast.error(msg);
      console.error("Register event error:", error);
    },
  });
};

// Get my events
export const useGetMyEvents = () => {
  return useQuery({
    queryKey: eventKeys.myEvents(),
    queryFn: () => eventService.getMyEvents(),
  });
};

// Get registrations for an event (owner only)
export const useGetEventRegistrations = (eventId?: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: eventKeys.registrations(eventId || "", params),
    queryFn: () => eventService.getEventRegistrations(eventId || "", params),
    enabled: !!eventId,
  });
};

// Get single registration
export const useGetRegistrationById = (registrationId?: string) => {
  return useQuery({
    queryKey: eventKeys.registration(registrationId || ""),
    queryFn: () => eventService.getRegistrationById(registrationId || ""),
    enabled: !!registrationId,
  });
};

// Accept or reject registration
export const useAcceptRegistration = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationId, data }: { registrationId: string; data?: Record<string, any> }) => eventService.acceptRegistration(registrationId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: eventKeys.registrations(variables.registrationId) });
      qc.invalidateQueries({ queryKey: eventKeys.registration(variables.registrationId) });
      toast.success("Registration accepted!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to accept registration";
      toast.error(msg);
      console.error("Accept registration error:", error);
    },
  });
};

export const useRejectRegistration = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationId, data }: { registrationId: string; data?: Record<string, any> }) => eventService.rejectRegistration(registrationId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: eventKeys.registrations(variables.registrationId) });
      qc.invalidateQueries({ queryKey: eventKeys.registration(variables.registrationId) });
      toast.success("Registration rejected!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to reject registration";
      toast.error(msg);
      console.error("Reject registration error:", error);
    },
  });
};
