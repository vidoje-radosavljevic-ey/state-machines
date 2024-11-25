// import { setup, createActor, assign } from 'xstate';
const { setup, createMachine, createActor, assign } = require('xstate');

//TODO: Add a new state

const testMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAxAEoCiAyiQCoDaADALqIrawCWALq9gHZMgAeiAIy0A7AFYAdAGYAbACZx4gJxzF4+QBoQAT2HyAvge1oMOfJLDd2YXAH1TWPIQDCAGQCSLgNJ2AYgDyRADiATQMfMgsHFy8SAKI8gAs0pJCChqiSUkAHCmy0uLaeghCIsppikLy0vI5srKiyklGJuhOFlY29o7mrp4+dqF2AEIAgj50jPFRbJw8fIIIyanpivJZufmFxYlZkqIStPIF0rXiOdKtIL3Olta2Du19BO5evm4BwXYeAHJTkWi8zioCWKzSGQ22Tych2ukQshyokkSVUOREOXE0kOeWut06Dx6z2crwGHy+P3+QmmzDmsUWiRSEPWmxhBSK8IQSVkFUuEixQiOSgKeOJBO6TzMJLeg0+3z+1HkNJuQPp8TBTLWmWh2w5JSEOVoB0UtDKtGUtFRyiE4lFUosrG4ADdUAAbVgQOwAV1gtm4qAAtmA7HhJR1+u9-EFQuFlbMYgt1YgckjJLIDfUMtzlDzdggVEabQokZic-Jy3bw5JHS73Z6fX7A8HQ-iI4NhuNJhEZqrE6Dk6n0ymGops7nOdlUuJEaJZLlRNIhIuWsYbmKINXnW6Pd7fbh-UGQ0T7W3yfL-t3aQmQQkECnkUPM6OeeOSuIkkJJPI0bRF+JaJcQiVn0m61juDb7k2R5hi8MpnpS1DUoCdJ9re95phmI7vi+yh5tIzQHLQxamnO0hJKawF3GAAbIOwOgwdKZJRiEYQAj2KE3ksQhJDUkj1Bs5rpPxdR5lkFRnEuGywti76UZ0NF0Qx+CkpGHYTN4bFXsCDKlDxqT8aIgmIgoImcoZRrcimQjKIZ1RlDkckbtRtH0a2KmyhSCqXiqHE6daRqIku9QpMJeaovIKKLhsiiFN+qKiI5lgKa567ufBCpIex146dxvEGUZwk5Hmc6fsoaIGjyogph+iUAGZ4FA2DsEpp5DAEozqZpPnZUmpTiFVfH-icyjyCIKjJHmyg5BU1nSJiTRVdaS51Q1TUtQQvwkAAGrGyE9f2pQ5hU-5zpaxwpnIsh5uUyIAScayiAa1kJdc3DYBAcCROue3ab1AC0QiTaktD-rQRFEdxIg1IlXSPK2P1qgdSSiKJ5p8RaNRyHkzSqIlNbbvWe4Hs2x7hgjqFLAWkhlkoOZIumihhSNlRDem4jpNIxww8lLXk5x+jcjI6xLuaxyjajhYZJcc6yNOSS2quraSPVuCNc18NZb9B2Csz04WtOYMfsjgOcuUsgHLOZE8mRVXJIlTq2KwtX0QAxu9YB8zp8hiJ+5zVGITT9Sb+rmubhwFNmNs5HbivrpIAaoP6MAONg7ou6wn2a4jt46xFesg7IhvcY9xWc3xGYnOWWMKNzqCsK6nu9bnkj5wblrF8HCLTV+P4qMo7OTkYRhAA */
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
