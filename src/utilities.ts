import * as constants from './consts';
import { CreatedEvent, TicketStruct, PaymentFormError, NextEvent, Event } from './types';
import { EventApi } from './api/eventApi';

export function dateToString(date: Date): string {
    return `${String(date.getUTCDate()).padStart(2, '0')}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${date.getUTCFullYear()}`;
}

export function timeToString(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function dateAndTimeToString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function hasPermission(permission: string, requiredPermission: string): boolean {
    if (requiredPermission === constants.WORKER) {
        return true;
    } else if (permission === constants.ADMIN) {
        return true;
    } else if (permission === constants.MANAGER && requiredPermission === constants.MANAGER) {
        return true;
    }
    return false;
}

export function formatDate(date: Date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return day + "." + month + "." + year;
}

export function validatePaymentForm(cardHolder: string, cardNumber: string, expDate: string, cvv: string): PaymentFormError {
    const newErrors: PaymentFormError = {
        cardHolder: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    };

    // Validate card holder name (letters only)
    if (!/^[a-zA-Z\s]+$/.test(cardHolder)) {
        newErrors.cardHolder = 'Card holder name must contain letters only';
    }

    // Validate card number (exactly 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }

    // Validate expiration date (format MM/YY and later than today)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) {
        newErrors.expDate = 'Expiration date must be in the format MM/YY, with valid MM';
    }
    else {
        const currentDate = new Date();
        const [month, year] = expDate.split('/');
        const expDateObj = new Date(+`20${year}`, parseInt(month) - 1); // Subtract 1 from month (zero-based)
        if (expDateObj <= currentDate) {
            newErrors.expDate = 'Expiration date must be later than today';
        }
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
    }

    return newErrors;
}



const requiredCheck = (event: CreatedEvent): boolean => {
    const requiredFields = ['name', 'category', 'description', 'organizer', 'location', 'startDate', 'endDate'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
        if (event[field as keyof CreatedEvent] === '') {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }

    return true;
};


const dateCheck = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    alert('End date must be after start date');
    return end > start;
}

const ticketsValidation = (tickets: TicketStruct[]): boolean => {
    const illegalTickets = tickets
        .map((ticket, index) => ({ ...ticket, index }))
        .filter(ticket => ticket.type === '' || ticket.price <= 0 || ticket.initialQuantity <= 0);

    if (illegalTickets.length > 0) {
        const illegalIndexes = illegalTickets.map(ticket => ticket.index);
        alert(`Illegal tickets found at indexes: ${illegalIndexes.join(', ')}`);
        return false;
    }
    return true;
};

const sameType = (tickets: TicketStruct[]): boolean => {
    const duplicateIndexes: number[] = [];

    tickets.forEach((ticket, index) => {
        if (tickets.slice(index + 1).some(t => t.type === ticket.type)) {
            duplicateIndexes.push(index);
        }
    });

    if (duplicateIndexes.length > 0) {
        alert(`Duplicate types found at indexes: ${duplicateIndexes.join(', ')}`);
        return false;
    }
    return true;
};


const ticketsCheck = (tickets: TicketStruct[]): boolean => {
    if (!ticketsValidation(tickets)) {
        return false;
    }
    if (!sameType(tickets)) {
        return false;
    }
    return true;
};


export function createValidation(event: CreatedEvent): boolean {
    let check = true;
    if (!requiredCheck(event))
        check = false;
    if (!dateCheck(event.startDate, event.endDate))
        check = false;
    if (!ticketsCheck(event.tickets))
        check = false;

    return true;
}

export async function getUserNextEvent(username: string): Promise<NextEvent | null> {
    try {
        const nextOrder = await EventApi.getNextEvent(username)
        if (!nextOrder) {
            console.log('No next event found for user');
            return null;
        }
        const date = dateToString(new Date(nextOrder.startDate));
        return { eventId: nextOrder.eventId, eventName: nextOrder.eventName, startDate: date };
    } catch (e) {
        console.error("Found error in getUserNextEvent: ", e);
        return null;
    }
}