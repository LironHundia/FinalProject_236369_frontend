import { APIStatus, BackendServer } from "../types";
import axios, {AxiosError} from "axios";


interface Credentials {
    username: string;
    password: string;
}

export const AuthApi = {
    login: async ({ username, password }: Credentials): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to login
            await axios.post(BackendServer.concat('api/login'), 
            { username, password },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    signUp: async ({ username, password }: Credentials): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to sign up
            await axios.post(BackendServer.concat('api/signup'), 
            { username, password },{ withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    logout: async (): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to logout
            await axios.post(BackendServer.concat('api/logout'), 
            null, { withCredentials: true});
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    getUserName: async (): Promise<string | APIStatus> => {
        try {
            const response = await axios.get(BackendServer.concat('api/username'), 
            { withCredentials: true});
            return response.data.username;
        } catch (e) {
            throw handleError(e);
        }
    },
};

const handleError = async (e: unknown): Promise<APIStatus> => {
    // TODO: handle errors here, check status code and return the appropriate APIStatus
    const error = e as AxiosError;
    console.log(error);
    if (error.response && error.response.status) {
      if (error.response.status === 400)
        return APIStatus.BadRequest;
      if (error.response.status === 401)
        return APIStatus.Unauthorized;
    }
    return APIStatus.ServerError;
};