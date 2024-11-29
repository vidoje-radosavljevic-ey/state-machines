const { setup, createActor, assign } = require('xstate');

const testMachine = setup({
    actions: {
        inputEmail: assign(({ event }) => ({ emailValue: event?.value || '', emailErrorMessage: '' })),
        setValidError: assign(() => ({
            emailErrorMessage: 'Please enter a valid email address',
        })),
        setEmptyError: assign(() => ({
            emailErrorMessage: 'Please enter your email address',
        })),
        dispatchEmailNext: assign(() => ({ dispatchedContinue: true })),
    },
    guards: {
        emailEmpty: ({ event }) => event?.value?.length === 0 || false,
        emailValid: ({ event }) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/.test(event?.value || ''),
        emailInvalidError: ({ event, context }) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/.test(event?.value || '') && context.dispatchedContinue === true,
        emailNextFired: ({ context }) => context?.dispatchedContinue === true || false,
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBMBjAdAGwPZQEsA7AfTAFsBDA7TCgBwBcBPE4+gV0YGIBhAeQByAFQCSggKoBRANoAGALqJQ9XLAKMCuIspAAPRAHYArAEYANCGaIAnABZTmVAF9nltFjyFSFarQYsbEScPFIAsgCCogAyJOIAChLC8kpIIKrqmtq6BgiGDpbWCKamABylmMYAzDW1dTWu7hg4+MRkVDR05Eys7Fzc4VGxCUkypqkqahpaOmm5JaZ2hYimcjaoTo0gHi3e7X5dPUEhA5ExcYKJyagT6VNZs6DzxnKoy8WmVYaYpQBs-wDAb9Slsdl42r5OgFWGAAE6w3CwvhCMSSWSKXQZabZOYrF5vKyIUp2b6GUHNcE+Dr+bqBOEIpGDc4jZIYtJYh45PGvd42QxyTBktzbCmtKkHaFkeGI05DC5XMa3DkzLnFUomd6lVCOOT1PVVcmeMX7TrEABulGwBAgx36AhE4mkKUx9xVuIQqF+VQqxk1dl+mH1esNuwh1Mw5st1ttoTOw0uozZk0ybqeRgKhOKVV+AuqQdqIcpJtokatNr6sblLMVLpTOLTHtQdlK71W2p+QM7QqaRr2kJLRAtZalDORDrRzvZrvr+kQnu170MqCqgfzBeFYON-Yjg6jNvpMqZ8YVSbudces7yGaK3oDNnvD8fD8LW-DpejB8Zcflo3GtexF65KgTYtpmxhmKua4Ghuop9m+u7Dp+srMgm1xKtOgFzr8C5gRBUENDBvZhgcQ7RhWY6ok6p7KjOuRVMuvy8thmyEaG4qdKR5bBP0R4-qy6Hnqq+QWJmJjGIGnZAt2IpEextCcTGyHHr+AkAaqCxLJmAKCi+cEkXuim8dWNz-py7qmPi7wkjYkH5p6hrcAASlIADKUj8aZqaXqghiMZmnyvJU+G6cRUK0r03E8IIUgAOokAAIuE-CTsmanmT54kAnYxj8nI6pyHIhituBdiYHY5VmNqdg2BZTauMKRC4BAcC6B4nm0XOqCgUUpguKxRb9u1mEIMYwHvKgNh3k+002CFcmHIEFZDaqOVyK23rSZuelhUcn7LelhjdSsBVyHNxY7gpS1ToJ7pVAVNiajVZ3bu++7SrC+0NsuVSaUU6q-M94aXZFn2XqYNilCJPW6qYIb0JQsCwAA7oiECg3RvwPZmnrGPVzhAA */
    id: 'b2c',
    context: {
        emailValue: '',
        emailErrorMessage: '',
        emailValidationMessage: '',
        dispatchedContinue: false,
        passwordValue: '',
        passwordErrorMessage: '',
        passVisible: false,
        // "Invalid username or password" | "Account is locked" (3rd time)
    },
    on: {
        RESET: {
            target: '#b2c.login_email',
            actions: "inline:b2c#RESET[-1]#transition[0]",
        },
    },
    initial: 'login_email',
    states: {
        login_email: {
            initial: 'empty_input',

            states: {
                empty_input: {
                    on: {
                        CONTINUE: [
                            {
                                target: '#b2c.login_email.empty_error',
                                actions: ["dispatchEmailNext", "setEmptyError"],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],

                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.valid_input',
                                guard: 'emailValid',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: ["inputEmail", "setValidError"],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_input',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],

                        NEW_DEMO: "valid_input"
                    },
                },
                empty_error: {
                    on: {
                        CONTINUE: {
                            target: '#b2c.login_email.empty_error',
                            description: '***** DESCRIPTION DEFINED BY BA *****',
                        },
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.valid_input',
                                guard: 'emailValid',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                actions: ["inputEmail", "setValidError"],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                    },
                },
                invalid_input: {
                    on: {
                        CONTINUE: [
                            {
                                target: '#b2c.login_email.invalid_error',
                                actions: ["dispatchEmailNext"],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.empty_input',
                                guard: 'emailEmpty',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.valid_input',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                    },
                },
                invalid_error: {
                    on: {
                        CONTINUE: {
                            target: '#b2c.login_email.invalid_error',
                            description: '***** DESCRIPTION DEFINED BY BA *****',
                        },
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.empty_input',
                                guard: 'emailEmpty',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.valid_input',
                                guard: 'emailValid',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                    },
                },
                valid_input: {
                    on: {
                        CONTINUE: { target: '#b2c.password', description: '***** DESCRIPTION DEFINED BY BA *****' },
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.empty_input',
                                guard: 'emailEmpty',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: ["inputEmail", "setValidError"],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_input',
                                actions: "inputEmail",
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                    },
                },
            },
        },

        password: {}
    },
});

const testMachineActor = createActor(testMachine).start();

module.exports = { testMachine, testMachineActor };
