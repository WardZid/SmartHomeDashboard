import * as dbAPI from "../utils/databaseAPI";

export interface Event {
    _id: string;
    device_id: string;
    datetime: Date;
    week_days: string; //1110111
    state: string;
    active: boolean;
}


export async function addEvent(
    deviceId: string,
    datetime: Date,
    weekDays: string,
    state: string,
    active: boolean) {

    return await dbAPI.insertEvent(deviceId, datetime, weekDays, state, active)
}

export async function getEvents(deviceId: string): Promise<Event[]> {
    try {

        const eventsData = await dbAPI.getEvents(deviceId);

        // Transform the response into an array of Device objects
        const events: Event[] = eventsData.map((event: any) => ({
            _id: event._id,
            device_id: event.device_id,
            datetime: event.datetime,
            week_days: event.week_days,
            state: event.state,
            active: event.active,
        }));

        return events;
    } catch (error) {
        // Handle errors
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
}

export async function updateDaysOfWeek(eventId: string, daysOfWeek: string) {
    return await dbAPI.updateDaysOfWeek(eventId, daysOfWeek);
}

export async function deleteEvent(eventId: string) {
    return await dbAPI.deleteEvent(eventId);
}
