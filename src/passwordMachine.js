// import { setup, createActor, assign } from 'xstate';
const { setup, createMachine, createActor, assign } = require('xstate');

//TODO: Add a new state

const testMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAdGAHYAuYuA+mhjvgMQDCAMgJKMDSlAYgPIBKAcV4AVANoAGALqIU2WAEtSC7MVkgAHogCMANm0SANCACeiAMwAWAJwBfW8ZpY8hEuSpO6EJm06VhlABCAIKckjJIIMjySipqkVoI2gDs1tbGZghWdg5R6M74RGQU1PlePuxczLyClKwAcuHq0YrKquqJ2gBMAKyWGRZdlvaOZS5F7qW0LhV+1bUNYtoRcq1xHYiWEl0EABzmB4dHBwMIlrrDuZ7jbiXXDCyVlPN1jV0rUTFt8aCJ5j3aU66CSXUbTQoKYgAN1QABsFBBKABXWAUYioAC2YEoeCmBW8jz8fCEoiakRasXaCR03SMpkQui6OTB+IIkJh8MRKLRmOxuPuBN8XACITC0maX3W1KS1l2gPpCEZzLy4MI7LhCORqNw6KxOI8YweQueNVeZNWlJ+mh0+msBEsel0Tudzp6p32uhGKtZ6s5Wp5ev5hsFTxei2WErWVN+Np6yQI1kdLpdboV1mSnquwaIGOQpBMePKhK4xOE4nF5Ml0etSXMEnSCqVXoFObzBYFs2FvCCoQ45s+UatnWSu10QKZzezYFz+cLM2LJoWjQrFu+GySXXMu3tSeTTtTmQ9k9VrdnHYXYcaEcrg-X3QzCd3e4PiHTmZZXgIADM8FBsKQ5yNJ4RV7fsKTXaVrCsAg91g05smPVkf1wP8AI7eoAFEAA1yw+cCpRjBA0jHRsJyzE9kNQwDvACNgADUMLAqsh0QXYenMcdlRbSj-2o+gAgAZREXgAAUmNvaVkgkDjSK44N6H4DCBIw3DI0tO8ulOHoukQz9bgNVV6EwgB1SgMIY+oRAE8T1OlLoM3gmx7FyYhsAgOBmmDNSIMIroul2U5ul0m5igM-FvIImttEOU5Nx08ifWhDUuW1XU+TCrwIurRJ9ACtMM2CwppzbaispY2stlOZJLFBb1Px4tCvJvWzCOsHoSMyGxdkKwgoQoBQvwLABjNywDK9dkiGKqap6ggMVQdEYGobB4SGhQPOanya0sEdAu0PRZunVAFFhcbpW0fYZM66xM3sIA */
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
