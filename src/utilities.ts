import * as constants from './consts';
import { PaymentFormError, APIStatus, NextEvent, Event } from './types';
import { EventApi } from './api/eventApi';
import { Axios } from 'axios';

export function dateToString(date: Date): string {
    return `${String(date.getUTCDate()).padStart(2, '0')}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${date.getUTCFullYear()}`;
}

export function timeToString(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function dateAndTimeToString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function timeToLocalString(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

export function dateAndTimeToLocalString(date: Date): string {
    return `${String(date.getUTCDate()).padStart(2, '0')}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${date.getUTCFullYear()} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
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
        const error = await e;
        if(error as APIStatus === APIStatus.NotFound) {
            //'No next event found for user'
            return null;
        }
        console.error('Error fetching next event:', e);
        return null;
    }
}

export function canAccessBO(userPermission:string)
{
    return (userPermission === constants.ADMIN || userPermission === constants.MANAGER)
}