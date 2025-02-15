import {upperFirst} from "lodash";

export type Option = {
    id: string,
    value: any,
    label: string,
}

export function formatToSelectOption(apiResult: any[], idField: string, labelField: string): Option[] {
    const options: Option[] = [];
    apiResult.forEach((item: object) => {
        options.push({
            id: item[idField],
            value: item[idField],
            label: upperFirst(item[labelField]),
        });
    });
    return options;
}