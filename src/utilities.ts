import * as constants from './consts';

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