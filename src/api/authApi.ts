import { APIStatus } from "../types";
import { BackendServer } from "../consts";
import axios, { AxiosError } from "axios";


interface Credentials {
    username: string;
    password: string;
    securityQuestion?: string;
    securityAnswer?: string;
}

export const AuthApi = {
    login: async ({ username, password }: Credentials): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to login
            await axios.post(BackendServer.concat('api/login'),
                { username, password }, { withCredentials: true });
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    signUp: async ({ username, password, securityQuestion, securityAnswer }: Credentials): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to sign up
            await axios.post(BackendServer.concat('api/signup'),
                { username, password, securityQuestion, securityAnswer }, { withCredentials: true });
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    getSecurityQuestion: async (username: string): Promise<string> => {
        try {
            // TODO: make a request to the server to sign up
            const response = await axios.get(BackendServer.concat('api/security/').concat(username),
               { withCredentials: true });
            return response.data;
        } catch (e) {
            throw handleError(e);
        }
    },
    changePassword: async ({ username, securityAnswer, password }: Credentials): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to login
            await axios.put(BackendServer.concat('api/changePassword'),
                { username,securityAnswer, password }, { withCredentials: true });
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    logout: async (): Promise<APIStatus> => {
        try {
            // TODO: make a request to the server to logout
            await axios.post(BackendServer.concat('api/logout'),
                null, { withCredentials: true });
            return APIStatus.Success;
        } catch (e) {
            return handleError(e);
        }
    },
    getUserName: async (): Promise<string | APIStatus> => {
        try {
            const response = await axios.get(BackendServer.concat('api/username'),
                { withCredentials: true });
            return response.data.username;
        } catch (e) {
            throw handleError(e);
        }
    },
    getUserPermission: async (): Promise<string | APIStatus> => {
        try {
            const response = await axios.get(BackendServer.concat('api/permission'),
                { withCredentials: true });
            return response.data.permission;
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