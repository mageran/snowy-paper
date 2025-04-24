import { createSlice, Draft, PayloadAction, Slice } from "@reduxjs/toolkit";
import { camelCaseToLabel, formatAmount } from "../../../lib/utils"; // Import the utility function

/**
 * MonetaryEntity represents a generic type that represent entites that have an
 * id, a status, and a monetary value attached to it.
 * For instance, invoices, payments, etc.
 */
export interface MonetaryEntity<StatusType = string> {
    id: string;
    value: number;
    currency?: string;
    status?: StatusType;
}


/**
 * A Field represents the meta-data of a field in the monetary-entity object.
 * This information is used for rendering UI elements; the field ids must correspond
 * to the properties defined for the type that represents the extension of the
 * MonetaryElement interface.
 */
export interface Field {
    id: string,
    displayDatatype: 'string' | 'number' | 'date' | 'moneyAmount' | 'enum',
    enumValues?: string[],
    header?: string,
    display?: (object: MonetaryEntity) => string
}

/**
 * A generic container class for managing monetary entities.
 * 
 * This class provides methods to manage a collection of entities that have an ID, 
 * a monetary value, a currency, and a status. It also supports integration with Redux 
 * by providing a method to create a Redux slice with predefined reducers.
 * 
 * @template T - The type of the monetary entities managed by the container.
 * @template StatusType - The type of the status field in the monetary entities.
 */
export abstract class MonetaryEntityList<
    T extends MonetaryEntity<StatusType>,
    StatusType = string
> {
    /**
     * The list of monetary entities managed by the container.
     */
    public entities: T[] = [];
    public sliceName: string;
    public slice: Slice;

    /**
     * Initializes the container with an optional list of entities.
     * 
     * @param initialEntities - The initial list of entities to populate the container.
     */
    constructor(reduxSliceName: string, initialEntities: T[] = []) {
        this.entities = initialEntities;
        this.sliceName = reduxSliceName;
        this.slice = this.createSlice();
    }

    /**
     * Returns the preset fields for monetary entities, such as ID, value, and status.
     * These fields are used for rendering UI elements.
     * 
     * @returns An array of `Field` objects representing the preset fields.
     */
    private getPresetFields(): Field[] {
        return [{
            id: 'id',
            header: this.getIdHeader(),
            displayDatatype: 'string'
        }, {
            id: 'value',
            displayDatatype: 'moneyAmount',
            header: this.getAmountHeader(),
            display: (entity: MonetaryEntity) => formatAmount(entity.value, entity.currency)
        }, {
            id: 'status',
            displayDatatype: 'enum',
            enumValues: this.getStatusTypeValues(),
            header: this.getStatusHeader(),
            display: (entity: MonetaryEntity) => this.getStatusLabel(entity)
        }];
    }

    /**
     * Returns the extension fields for monetary entities.
     * These fields are defined by subclasses to extend the functionality of the container.
     * 
     * @returns An array of `Field` objects representing the extension fields.
     */
    abstract getExtensionFields(): Field[];

    /**
     * In order to create proper value dropdowns, the list of status type values are
     * expected to be returned here.
     */
    abstract getStatusTypeValues(): string[];

    /**
     * Combines the preset fields and extension fields into a single array.
     * 
     * @returns An array of `Field` objects representing all fields.
     */
    getAllFields(): Field[] {
        return [...this.getPresetFields(), ...this.getExtensionFields()];
    }

    getIdHeader(): string {
        return 'Id';
    }

    /**
     * Returns the header for the "Amount" field.
     * 
     * @returns A string representing the header for the "Amount" field.
     */
    getAmountHeader(): string {
        return 'Amount';
    }

    /**
     * Returns the header for the "Status" field.
     * 
     * @returns A string representing the header for the "Status" field.
     */
    getStatusHeader(): string {
        return 'Status';
    }

    /**
     * Adds a new entity to the container.
     * 
     * @param entity - The entity to add.
     */
    add(entity: T): void {
        this.entities.push(entity);
    }

    /**
     * Removes an entity from the container by its ID.
     * 
     * @param id - The ID of the entity to remove.
     */
    remove(id: string): void {
        this.entities = this.entities.filter(e => e.id !== id);
    }

    /**
     * Retrieves an entity from the container by its ID.
     * 
     * @param id - The ID of the entity to retrieve.
     * @returns The entity with the specified ID, or `undefined` if not found.
     */
    getById(id: string): T | undefined {
        return this.entities.find(e => e.id === id);
    }

    /**
     * Retrieves all entities with a specific status.
     * 
     * @param status - The status to filter entities by.
     * @returns An array of entities with the specified status.
     */
    getByStatus(status: StatusType): T[] {
        return this.entities.filter(entity => entity.status === status);
    }

    /**
     * Calculates the total monetary value of all entities in the container.
     * 
     * @returns The total value of all entities.
     */
    totalValue(): number {
        return this.entities.reduce((sum, item) => sum + item.value, 0);
    }

    /**
     * Calculates the total monetary value of all entities with a specific status.
     * 
     * @param status - The status to filter entities by.
     * @returns The total value of entities with the specified status.
     */
    totalValueByStatus(status: StatusType): number {
        return this.entities
            .filter(entity => entity.status === status)
            .reduce((sum, entity) => sum + entity.value, 0);
    }

    /**
     * Modifies an existing entity in the container by its ID.
     * 
     * @param id - The ID of the entity to modify.
     * @param changes - The changes to apply to the entity.
     */
    modify(id: string, changes: Partial<T>): void {
        const entity = this.getById(id);
        if (entity) {
            Object.assign(entity, changes);
        }
    }

    /**
     * Returns the string representation of a given status using camelCaseToLabel.
     * 
     * @param entity - The entity whose status needs to be converted to a label.
     * @returns The formatted status label.
     */
    getStatusLabel(entity: MonetaryEntity): string {
        return camelCaseToLabel(String(entity.status));
    }

    /**
     * Creates a Redux slice for managing the state of the monetary entities.
     * 
     * @param sliceName - The name of the slice.
     * @returns A Redux slice with `add`, `remove`, and `modify` reducers for managing entities.
     * 
     * The `add` reducer adds a new entity to the container.
     * The `remove` reducer removes an entity from the container by its ID.
     * The `modify` reducer updates an existing entity in the container by its ID.
     */
    private createSlice() {
        const initialState = {
            entities: this.entities
        }
        return createSlice({
            name: this.sliceName,
            initialState: initialState,
            reducers: {
                add: (state, action: PayloadAction<T>) => {
                    state.entities.push(action.payload as Draft<T>);
                },
                remove: (state, action: PayloadAction<string>) => {
                    //state.entities.remove(action.payload as Draft<T>);
                },
                modify: (state, action: PayloadAction<{ id: string; changes: Partial<T> }>) => {
                    const entity = state.entities.find(e => e.id === action.payload.id);
                    if (entity) {
                        Object.assign(entity, action.payload.changes)
                    }
                },
            },
        });
    }
}