// import { setup, createActor, assign } from 'xstate';
const { setup, createMachine, createActor, assign } = require('xstate');

//TODO: Add a new state

const testMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAdGAHYAuYuA+mhjvgMQDCAMgJKMDSlAYgPIBKAcV4AVANoAGALqIU2WAEtSC7MVkgAHogCsAFgCMBAMwnTZ0wBoQAT0RHdATgC+TqzSx5CJclXd0ITGyclMKUAEIAgpySMkggyPJKKmpxWgj6Etr6VrYI9s6u8ege+ERkFNTF-oHsXMy8gpSsAHIx6gmKyqrqafoATADsfQQGAGzjE5PaOXZ9ui5uVZ5lPpW0njXB9Y0tYvqxcp3JPYj6RpkEfdM2iLqj84V+y94VTwwstZTbTa19B-GJLopUC9AbaBwjfSTaGja65UYSB6LdalF6+JYMZoAUQA6pQsQA1LHNEQAZTacQ6SW6qVOozmkJhUxmeUcCyKKMICmIADdUAAbBQQSgAV1gFGIqAAtmBKHg1iUAh9gnwhKIKYdqcDNIhxgAOFn0grIxUEbl8wXCsUS6Wy+VvJVBLihSLRaTtQHHWnpPrjAjaPXmIOGvrGjmm80CoWi8W4SUyuXozmbOoNH4agFHGkg04SK4ECSBoNmFmB0bsh1m3lRq2x+N2pOKlNfNO7fYerPatIOemXRwOAeDocshx68uPDFeKXIUjWBXVZVcVXCcTuyme7M6hB67TDIf74c3BBGiuTojT2fzjaLkK8cJRDgZqlAk7pCRGA1Hk8Tznnmdzh1m2+XY101F9vV0PojH9UsjHHE1-D-S9AJvYDWnbddO1fOCJAIJloQGXQRzHU9fwAMzwKBsFIK93idW97zdf5ny9HM8m0XDi3MX0WXyUjTQo3AqJowDsQADVXZiNy7HRdE-eFQ34xDBOE2iAlCNgiSfaTX10CQHBDMNKxU6i1PoUJSREXgAAVtKw71fSMQylI2fgsVJLFJI7LVX36FldxcQpiGwCA4HaSdvPAti+j6eTTj6FzUXKRt-Ei1itwyXQBhZKCEp-CNq0tGMbQTe0IswnzvX0XdRmI+Dw0QsALwA8qwPS3oJAGJyj0IpEGuWEyRNazNKrYjjaqPRw9USwgeQoBQyLnABjEKwDSzc0kcbKet0PrKylVBJRgahsEFJaFDCiqooyvVOpZfR+nqysmtQBR+XWmS30DFlHHHFwgA */
        id: 'password',
        context: {
            passwordValue: '',
            passwordErrorMessage: '',
            passVisible: false,
            passInvisible: false,
            passwordUntouched: true,
            // "Invalid username or password" | "Account is locked" (3rd time)
        },
        on: {
            RESET: {
                target: '#password',
                actions: "inline:password#RESET[-1]#transition[0]",
            },
        },
        initial: 'enter_password',
        states: {
            enter_password: {
                on: {
                    CLICK_FORGOT: '#password.forgot_password',
                    CLICK_GO_BACK: '#password.email',

                    CLICK_LOG_IN: [
                        { target: '#password.empty_password', guard: 'passwordEmpty', actions: "inputEmptyPassword" },
                        {
                            target: '#password.invalid_username_or_password',
                            guard: 'passwordInvalid',
                            actions: "inputWrongPassword",
                        },
                        { target: '#password.manage_policies', guard: 'passwordValid', actions: "inputValidPassword" },
                    ],

                    NEW_EVENTS: {
                        target: "invalid_username_or_password",
                        cond: "New guard"
                    }
                },
            },
            invalid_username_or_password: {
                on: {
                    CLICK_FORGOT: '#password.forgot_password',
                    CLICK_GO_BACK: '#password.email',
                    CLICK_LOG_IN: [
                        { target: '#password.empty_password', guard: 'passwordEmpty', actions: "inputEmptyPassword" },
                        { target: '#password.manage_policies', guard: 'passwordValid', actions: "inputValidPassword" },
                    ],
                },
            },
            empty_password: {
                on: {
                    CLICK_FORGOT: '#password.forgot_password',
                    CLICK_GO_BACK: '#password.email',
                    CLICK_LOG_IN: [
                        {
                            target: '#password.invalid_username_or_password',
                            guard: 'passwordInvalid',
                            actions: "inputValidPassword",
                        },
                        { target: '#password.manage_policies', guard: 'passwordValid', actions: "inputValidPassword" },
                    ],
                },
            },
            forgot_password: {
                on: {
                    CLICK_GO_BACK: '#password.enter_password',
                    NEXT: '#password.verify_code',
                    GO_LIVE: '#password.verify_code',
                    GO_STOP: '#password.verify_code',
                },
            },
            verify_code: {},
            manage_policies: {},
            email: {},
        },
    },
    {
        actions: {
            inputValidationWrongPassword: assign(({ event }) => ({
                passwordValue: event.value,
                passwordErrorMessage: '',
            })),
            inputValidPassword: assign(({ event }) => ({ passwordValue: event.value, passwordErrorMessage: '' })),
            inputWrongPassword: assign(({ event }) => {
                const result = {
                    passwordValue: event.value,
                    passwordErrorMessage: 'Invalid username or password',
                };
                console.log('inputWrongMessage', result);
                return result;
            }),
            inputEmptyPassword: assign(({ event, context }) => {
                const result = {
                    passwordValue: event.value,
                    passwordErrorMessage: 'Please enter your password',
                };
                return result;
            }),
        },
        guards: {
            passwordEmpty: ({ event, context }) => {
                const result = event.value === '';
                console.log('GUARD FOR EMPTY PASSWORD_CHECK', result);
                return result;
            },
            passwordValid: ({ event, context }) => {
                const result = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(event.value);
                console.log('GUARD FOR VALID PASSWORD_CHECK:', result);
                return result;
            },
            passwordInvalid: ({ event, context }) => {
                const reg = !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(event.value);
                const result = reg && event.value !== '';
                console.log('GUARD FOR INVALID PASSWORD_CHECK:', result);
                return result;
            },
        },
    }
);
const testMachineActor = createActor(testMachine).start();

module.exports = { testMachine, testMachineActor };
