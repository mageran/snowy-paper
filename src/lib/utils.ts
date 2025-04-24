/**
 * Converts a camelCase string into a label with all words capitalized.
 * Example: "camelCaseId" -> "Camel Case Id"
 * 
 * @param camelCaseString - The camelCase string to convert.
 * @returns The formatted label string.
 */
export function camelCaseToLabel(camelCaseString: string): string {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space between lowercase and uppercase letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

export function formatAmount(amount: number, currency?: string): string {
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency ?? 'USD',
    }).format(amount);
    return formatted;
}

export function dateDisplay(fieldName: string) {
    return (object: Record<string, any>) => {
        const dateObject = object[fieldName];
        if (dateObject instanceof Date) {
            return dateObject.toLocaleDateString();
        }
        return dateObject + "";
    }
}

export function dateFromString(input: any, defaultDate?: Date): Date {
    if (input instanceof Date) {
        return input as Date;
    }
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) {
        return defaultDate ?? new Date();
    }
    return parsedDate;
}

export function dateInNDays(n: number): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + n);
    return currentDate;
}