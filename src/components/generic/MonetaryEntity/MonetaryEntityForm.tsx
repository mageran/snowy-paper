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
import { useRef, useState } from "react";

interface MonetaryEntityFormProps<T extends MonetaryEntity<StatusType>, StatusType = string> {
    entities?: MonetaryEntityList<T, StatusType>;
    entity?: T,
    onSave: (data: Record<string, any>) => void
    onCloseDialog?: () => void
    createSampleData?: () => T
}

type FieldWithRef = Field & { ref: any | null, value?: any }

const MonetaryEntityForm = <T extends MonetaryEntity<StatusType>, StatusType>({
    onSave,
    onCloseDialog,
    entities,
    entity,
    createSampleData
}: MonetaryEntityFormProps<T, StatusType>) => {

    const [data, setData] = useState<T>(entity ?? {} as T)
    const fields = entities?.getAllFields() ?? [];
    const fieldsWithRef: FieldWithRef[] = fields.map(fld => ({ ...fld, ...{ ref: null } }))
    //const data: T = entity ?? {} as T

    const useFaker = true;

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
        //closeHook();
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
                        console.log('rendering form fields...');
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
                                            return <NumberInput inputRef={ref} value={field.value} />;
                                        case "moneyAmount":
                                            return <NumberInput inputRef={ref} value={field.value} decimalPlaces={2} />;
                                        case "enum":
                                            if (Array.isArray(enumValues) && enumValues.length > 0) {
                                                return (
                                                    <Dropdown onSelectionChange={(_event, newSelected) => {
                                                        const newValue = newSelected[0]
                                                        console.log(`new value for ${field.id}: ${newValue}`);
                                                        field.value = newValue;
                                                    }}
                                                    selected={field.value ? [field.value] : []}
                                                    >
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
                                        case "date":
                                            if (field.value instanceof Date) {
                                                return <Input inputRef={ref} value={field.value.toLocaleDateString()}/>
                                            }
                                            return <Input inputRef={ref} value={field.value}/>
                                        default:
                                            return <Input inputRef={ref} value={field.value}/>
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
                    {useFaker && (
                        <Button
                            sentiment="neutral"
                            appearance="transparent"
                            onClick={() => {
                                if (typeof createSampleData === 'function') {
                                    const fakeData = createSampleData();
                                    console.log("fake invoice: %o", fakeData);
                                    setData(fakeData);
                                }
                            }}
                        >Insert Sample Data</Button>
                    )}
                    <Button sentiment="accented" onClick={saveHook}>Save</Button>
                    <Button sentiment="accented" appearance="bordered" onClick={closeHook}>Close</Button>
                </FlexLayout>
            </StackLayout>
        </>
    )
}

export default MonetaryEntityForm;