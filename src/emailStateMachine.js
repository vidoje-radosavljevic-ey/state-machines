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
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBMBjAdAGwPZQEsA7AfTAFsBDA7TCgBwBcBPE4+gV0YGIBhAeQByAFQCSggKoBRANoAGALqJQ9XLAKMCuIspAAPRAHYArAEYANCGaIAnABZTAX0eW0WPIVIVqtBizZEnDxSALIAgqIAMiTiAAoSwvJKSCCq6praugYIhg6W1gimpgAcNs6uGDj4xGRUNHTkTKzsXNyhEdFxCTKmySpqGlo6KdlFpnb5iKZyNqjlIG5VnrU+DU0BQW3hUTGC8YmofakDGcOgo8ZyqJOFpgDMxfOLHjXe9X6sYABOX7hffEIxJJZIpdGlBpkRlNLtcrIhinZHi4FpUXl46r5Gv5vr9-u0dl1EqCUuDTlloVcbjZDE5kc9qujVh8yD8-lsOrt9j0jqShuTCsUTDdiqhaRV3AyVvViAA3SjYAgQDatAQicTSJJgk58qEIVAANjuNmFdn1T1RkretFl8sVyuC206e26xP66R15yMeThhTu+rFKIlyytmBtCqVLQdHMJ3K17shnr1qERN2mqDmdItwYxoaIcvDLNxALVwM1JO1Cf0iANopuhlQd3NQdeObDdpxbPxTq5ruO8bOVZy3oKD0MTaWLdWbaVHbxjs53V6cYhA+y6ZTPuMZnHaKl1rztpnrLn0edBx5FdX1f1tc328zzcZ9XzdsjxaBGt7vMr2TuDf1VI3julo5i+EaBK0XYLkSF79vyuQWD6JjGMB2arGB9rsgSZ6xuWcG6mMEw+vq+pjg+E5PrQGFvlBMaHMuZIETCNx2IYZQPtwABKUgAMpSDBDEeoOqCGABPr3HIjbzEQuAQHAuhuIJP7VqgxSphm4oUXuSlXggxjpjcqDUqhk7vFizQQYwOn8sYhhyKmo4mZRazYse1kESJaniXIPlOXuubUZZ7mJncPnGj6pQBvSaHSgeBazsFwl3HcREFIKZrkbuIaBUEiWjDYxSIQU0x3FFlT0JQsCwAA7n8EB5YgfrhQUBooc4jhAA */
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
                        ]
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
