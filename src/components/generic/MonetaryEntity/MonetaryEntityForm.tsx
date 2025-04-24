import {
    Button,
    Dropdown,
    FlexLayout,
    FlowLayout,
    FormField,
    FormFieldLabel,
    Input,
    Option,
    StackLayout,
} from "@salt-ds/core";

import { Field, MonetaryEntity, MonetaryEntityList } from "./monetary-entity";
import { NumberInput } from "@salt-ds/lab";
import { useRef } from "react";

interface MonetaryEntityFormProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
    entity?: T,
    onSave: (data: Record<string, any>) => void
    onCloseDialog?: () => void
}

type FieldWithRef = Field & { ref: any | null, value?: any }

const MonetaryEntityForm = <T extends MonetaryEntity<StatusType>, StatusType>({
    onSave,
    onCloseDialog,
    entities,
    entity, }: MonetaryEntityFormProps<T, StatusType>) => {
    const fields = entities?.getAllFields() ?? [];
    const fieldsWithRef: FieldWithRef[] = fields.map(fld => ({ ...fld, ...{ ref: null } }))
    const data: T = entity ?? {} as T

    const saveHook = () => {
        const valueObj: Record<string, any> = {};
        fieldsWithRef.forEach(fld => {
            const { ref } = fld;
            if (ref && ref.current && ref.current.value !== null) {
                //console.log(`${fld.id}: ref.current: %o`, ref.current);
                fld.value = ref.current.value;
            }
            valueObj[fld.id] = fld.value;
        })
        console.log('valueObj: %o', valueObj);
        onSave(valueObj);
        closeHook();
     }

    const closeHook = () => {
        if (typeof onCloseDialog === 'function') {
            onCloseDialog();
        }
    }

    return (
        <>
            <StackLayout direction="column" align="start">
                <FlowLayout style={{ marginBottom: '25px', width: "256px" }}>
                    {fieldsWithRef.map((field: FieldWithRef, index: number) => {
                        const { displayDatatype, header, enumValues } = field;
                        const ref = useRef(null);
                        field.ref = ref;
                        const val = data[field.id as keyof T];
                        if (val !== null) {
                            field.value = val;
                        }
                        return (
                            <FormField key={index}>
                                <FormFieldLabel>{header}</FormFieldLabel>
                                {(() => {
                                    switch (displayDatatype) {
                                        case "number":
                                            return <NumberInput inputRef={ref} defaultValue={0} />;
                                        case "moneyAmount":
                                            return <NumberInput inputRef={ref} defaultValue={0} decimalPlaces={2} />;
                                        case "enum":
                                            if (Array.isArray(enumValues) && enumValues.length > 0) {
                                                return (
                                                    <Dropdown onSelectionChange={(_event, newSelected) => {
                                                        const newValue = newSelected[0]
                                                        console.log(`new value for ${field.id}: ${newValue}`);
                                                        field.value = newValue;
                                                    }}>
                                                        {enumValues.map((value, index) => {
                                                            return (
                                                                <Option key={index} value={value} />
                                                            )
                                                        })}
                                                    </Dropdown>
                                                )
                                            } else {
                                                return <Input inputRef={ref} />
                                            }
                                        default:
                                            return <Input inputRef={ref} />
                                    }
                                })()}
                            </FormField>
                        )
                    })}
                </FlowLayout>
                <FlexLayout 
                    direction="row"
                    align="end"
                    justify="end"
                    style={{
                        border: '0px solid green',
                        position: 'absolute',
                        bottom: '40px',
                        right: '50px'
                    }}>
                    <Button sentiment="accented" onClick={saveHook}>Save</Button>
                    <Button sentiment="accented" appearance="bordered" onClick={closeHook}>Cancel</Button>
                </FlexLayout>
            </StackLayout>
        </>
    )
}

export default MonetaryEntityForm;