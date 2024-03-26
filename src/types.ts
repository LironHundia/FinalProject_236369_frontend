export enum APIStatus {
    Success,
    BadRequest,
    Unauthorized,
    ServerError
}

export interface PageProps {
    navigateToMainPage(): void;
    navigateToSignUpPage(): void;
    navigateToLoginPage(): void;
    navigateToRouteUser(): void;
    navigateToRouteBackoffice(): void;
}

//export const BackendServer = 'http://localhost:3002';
export const BackendServer = 'https://finalproject-backend-userserver.onrender.com/';