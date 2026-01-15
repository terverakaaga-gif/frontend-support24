import { get, post, put, patch, del } from "../apiClient";

export interface EventPostedBy {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface Event {
  _id: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: null;
  };
  eventName: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventImage: string;
  eventDescr: string;
  status: "published"| "draft" | "archived" | string;
  registrationCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  pagination?: { limit: number; offset: number; hasMore: boolean };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  image?: File | null;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventRegistration {
  _id: string;
  eventId: string | Event;
  userId?: any;
  fullName?: string;
  email?: string;
  phone?: string;
  reason?: string;
  status?: "new" | "accepted" | "rejected" | string;
  createdAt?: string;
}

interface RegistrationsResponse {
  registrations: EventRegistration[];
  total: number;
  pagination?: { limit: number; offset: number; hasMore: boolean };
}

const eventService = {
  getAllEvents: async (
    params?: Record<string, any>
  ): Promise<EventsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          query.append(k, String(v));
      });
    }

    const url = query.toString() ? `/events?${query.toString()}` : "/events";
    const response = await get<EventsResponse>(url);
    return response;
  },

  createEvent: async (data: FormData): Promise<Event> => {
    const response = await post<{ event: Event }>("/events", data, {
      headers: { "Content-Type": undefined },
    });
    return (response as any).event || (response as any);
  },

  getEventById: async (eventId: string): Promise<Event> => {
    const response = await get<{ event: Event }|{ event: Event, hasRegistered: boolean }>(`/events/${eventId}`);
    return (response as any).event || (response as any);
  },

  updateEvent: async (eventId: string, data: FormData): Promise<Event> => {
    const response = await put<{ event: Event }>(`/events/${eventId}`, data, {
      headers: { "Content-Type": undefined },
    });
    return (response as any).event || (response as any);
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    await del(`/events/${eventId}`);
  },

  getMyEvents: async (): Promise<EventsResponse> => {
    const response = await get<EventsResponse>(`/events/user/my-events`);
    return response;
  },

  registerForEvent: async (
    eventId: string,
    data: Record<string, any>
  ): Promise<EventRegistration> => {
    const response = await post<{ registration: EventRegistration }>(
      `/events/${eventId}/register`,
      data
    );
    return (response as any).registration || (response as any);
  },

  getEventRegistrations: async (
    eventId: string,
    params?: Record<string, any>
  ): Promise<RegistrationsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          query.append(k, String(v));
      });
    }
    const url = query.toString()
      ? `/events/${eventId}/registrations?${query.toString()}`
      : `/events/${eventId}/registrations`;
    const response = await get<RegistrationsResponse>(url);
    return response;
  },

  getRegistrationById: async (
    registrationId: string
  ): Promise<EventRegistration> => {
    const response = await get<{ registration: EventRegistration }>(
      `/events/registrations/${registrationId}`
    );
    return (response as any).registration || (response as any);
  },

  deleteRegistration: async (registrationId: string): Promise<void> => {
    await del(`/events/registrations/${registrationId}`);
  },

  acceptRegistration: async (
    registrationId: string,
    data?: Record<string, any>
  ): Promise<EventRegistration> => {
    const response = await patch<{ registration: EventRegistration }>(
      `/events/registrations/${registrationId}/accept`,
      data || {}
    );
    return (response as any).registration || (response as any);
  },

  rejectRegistration: async (
    registrationId: string,
    data?: Record<string, any>
  ): Promise<EventRegistration> => {
    const response = await patch<{ registration: EventRegistration }>(
      `/events/registrations/${registrationId}/reject`,
      data || {}
    );
    return (response as any).registration || (response as any);
  },
};

export default eventService;
