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

export interface UserPageProps {
    navigateToCatalogPage(): void;
    navigateToEventPage(): void;
    navigateToPaymentPage(): void;
    navigateToUserSpace(): void;
}

export interface BackofficePageProps {
    navigateToBOCatalogPage(): void;
    navigateToBOEventPage(): void;
    navigateToBOCreateEventPage(): void;
}

//TODO
export interface UserPageProps {
    navigateToCatalogPage(): void;
    navigateToEventPage(): void;
    navigateToPaymentPage(): void;
    navigateToUserSpace(): void;
}

export interface CommentProps {
    eventId: string;
    author: string;
    comment: string;
    date: string;
    className?: string;
  }

export interface TicketStruct {
    type: string;
    price: number;
    initial_quantity: number;
    available_quantity: number;
}

export interface TicketToPurchase {
    type: string;
    total_price: number;
    quantity: number;
    eventId: string;
}

export interface Event {
    _id: string;
    name: string;
    category: string;
    description: string;
    organizer: String,
    start_date: string;
    end_date: string;
    total_available_tickets: number;
    tickets: TicketStruct[];
    image_url?: string;
    location?: string;
}