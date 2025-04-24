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
        currency: currency??'USD',
    }).format(amount);
    return formatted;
}