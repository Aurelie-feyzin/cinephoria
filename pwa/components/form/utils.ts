export const REQUIRED = {required: 'Ce champ est obligatoire'}
export const customMaxLength = (maxValue = 255)=> (
    { maxLength: { value: maxValue, message: `Maximum ${maxValue} caractères.` } });