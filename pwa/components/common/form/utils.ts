import {upperFirst} from "lodash";

export type Option = {
    id: string,
    value: any,
    label: string,
}

export function formatToSelectOption(
    apiResult: Record<string, any>[],
    idField: string,
    labelField: string
): Option[] {
    return apiResult.map((item) => ({
        id: item[idField],
        value: item[idField],
        label: upperFirst(item[labelField]),
    }));
}

export const daysOfWeek = [
    { label: 'Tous les jours', value: '' },
    { label: 'Lundi', value: 1 },
    { label: 'Mardi', value: 2 },
    { label: 'Mercredi', value: 3 },
    { label: 'Jeudi', value: 4 },
    { label: 'Vendredi', value: 5 },
    { label: 'Samedi', value: 6 },
    { label: 'Dimanche', value: 0 },
];