import { APIStatus, CommentProps, Event, TicketToPurchase } from "../types";
import { BackendServer } from "../consts";
import axios, {AxiosError} from "axios";
import { dateAndTimeToString } from "../utilities";


interface QueryParams {
    eventId: string;
    page: Number;
}

export const EventApi = {
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
            await axios.post(BackendServer.concat('/api/user/secure'), 
            { reservation },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            throw handleError(e);
        }
    }
};

const handleError = async (e: unknown): Promise<APIStatus> => {
    // TODO: handle errors here, check status code and return the appropriate APIStatus
    const error = e as AxiosError;
    console.log(error);
    if (error.response && error.response.status) {
      if (error.response.status === 400)
        return APIStatus.BadRequest;
      if (error.response.status === 401 || error.response.status === 403)
        return APIStatus.Unauthorized;
    }
    return APIStatus.ServerError;
};