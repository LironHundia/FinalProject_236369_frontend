import * as constants from './consts';
import { CreatedEvent, TicketStruct } from './types';

export function dateToString(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
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
    if (!ticketsValidation(tickets)){
      return false;
    }
    if (!sameType(tickets)) {
        return false;
    }
    return true;
};



export function createValidation(event: CreatedEvent) : boolean {
    let check  =true;
    if (!requiredCheck(event)) 
        check = false;
    if (!dateCheck(event.startDate, event.endDate)) 
        check = false;
    if (!ticketsCheck(event.tickets))
        check = false;

    return check;
}