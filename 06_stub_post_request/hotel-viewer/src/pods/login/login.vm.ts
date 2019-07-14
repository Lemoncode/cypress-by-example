import { FieldValidationResult } from 'lc-form-validation';

export interface LoginEntityVm {
    login: string;
    password: string;
}

export const createEmptyLogin = (): LoginEntityVm => ({
    login: '',
    password: '',
});

export interface LoginFormErrors {
    login: FieldValidationResult;
    password: FieldValidationResult;
}

export const createDefaultLoginFormErrors = (): LoginFormErrors => ({
    login: new FieldValidationResult(),
    password: new FieldValidationResult(),
})