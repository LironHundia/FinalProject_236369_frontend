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
    initialQuantity: number;
    availableQuantity: number;
}

export interface TicketToPurchase {
    type: string;
    totalPrice: number;
    quantity: number;
    eventId: string;
}

export interface Event {
    _id: string;
    name: string;
    category: string;
    description: string;
    startDate: string;
    endDate: string;
    totalAvailableTickets: number;
    tickets: TicketStruct[];
    imageUrl?: string;
    location?: string;
    lowestPrice?: number;
}


export const categories = ['Charity Event', 'Concert', 'Conference', 'Convention', 'Exhibition', 'Festival', 'Product Launch', 'Sport Event'];
