import {upperFirst} from "lodash";

export type Option = {
    id: string,
    value: any,
    label: string,
}

export function formatToSelectOption<T extends Record<string, any>>(
    apiResult: T[],
    idField: keyof T,
    labelField: keyof T
): Option[] {
    return apiResult.map((item) => ({
        id: String(item[idField]),
        value: item[idField],
        label: upperFirst(String(item[labelField])),
    }));
}