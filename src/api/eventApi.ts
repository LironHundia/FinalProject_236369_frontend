import { APIStatus, CommentProps, Event, CreatedEvent, TicketToPurchase, PaymentReq } from "../types";
import { BackendServer } from "../consts";
import axios, {AxiosError} from "axios";
import { dateAndTimeToString } from "../utilities";


interface QueryParams {
    eventId: string;
    page: Number;
}

export const EventApi = {
    getAvailableEvents: async (limit?: number, page?: number): Promise<Event[]> => {
        try {
            const response = await axios.get(BackendServer.concat('api/event'), 
            { params: {limit,page},
            withCredentials: true });
            return response.data;
        } catch (e) {
            throw handleError(e);
        }
    },

    getAllEvents: async (limit?: number, page?: number): Promise<Event[]> => {
        try {
            const response = await axios.get(BackendServer.concat('api/event/all'), 
            { params: {limit,page},
            withCredentials: true });
            return response.data;
        } catch (e) {
            throw handleError(e);
        }
    },
    getEventComments: async ({ eventId, page }: QueryParams): Promise<CommentProps[]> => {
        try {
            // TODO: make a request to the server to login
            const response = await axios.get(BackendServer.concat('api/comment/').concat(eventId).concat('?page=').concat(page.toString())
            ,{ withCredentials: true});
            return response.data.comments;
        } catch (e) {
            throw handleError(e);
        }
    },
    getEventCommentsCount: async (eventId : string): Promise<number> => {
        try {
            // TODO: make a request to the server to sign up
            const response = await axios.get(BackendServer.concat('api/comment/count/').concat(eventId)
            ,{ withCredentials: true});
            return response.data.count;
        } catch (e) {
            throw handleError(e);
        }
    },
    getEventById: async (eventId : string): Promise<Event> => {
        try {
            const response = await axios.get(BackendServer.concat('api/event/').concat(eventId)
            ,{ withCredentials: true});
            return response.data;
        } catch (e) {
            throw handleError(e);
        }
    },
    updateEventDate: async (eventId: string, newStartDate: Date, newEndDate: Date): Promise<APIStatus> => {
        const startDate = dateAndTimeToString(newStartDate);
        const endDate = dateAndTimeToString(newEndDate);
        console.log(startDate);
        try {
            await axios.put(BackendServer.concat('api/event/').concat(eventId)
            ,{start_date: startDate, end_date: endDate}
            ,{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            throw handleError(e);
        }
    },
    secureTickets: async (reservation: TicketToPurchase): Promise<APIStatus> => {
        try {
            await axios.post(BackendServer.concat('api/user/secure'), 
            { ...reservation },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            throw handleError(e);
        }
    },
    purchaseTickets: async (reservation: PaymentReq): Promise<string> => {
        try {
            const res = await axios.post(BackendServer.concat('api/user/buy'), 
            { ...reservation },{ withCredentials: true});
            return res.data;
        } catch (e) {
            throw handleError(e);
        }
    },
    addNewComment: async (eventId: String, comment: string): Promise<APIStatus> => {
        try {
            await axios.post(BackendServer.concat('api/comment'), 
            { eventId, comment },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            throw handleError(e);
        }
    },

    addNewEvent: async (newEvent: CreatedEvent): Promise<APIStatus> => {
        try {
            await axios.post(BackendServer.concat('api/event'), 
            { newEvent },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            throw handleError(e);
        }
    },
};

const handleError = async (e: unknown): Promise<APIStatus> => {
    // TODO: handle errors here, check status code and return the appropriate APIStatus
    const error = e as AxiosError;
    if (error.response && error.response.status) {
      if (error.response.status === 400)
        return APIStatus.BadRequest;
      if (error.response.status === 401 || error.response.status === 403)
        return APIStatus.Unauthorized;
    }
    return APIStatus.ServerError;
};