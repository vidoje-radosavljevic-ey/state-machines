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
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBMBjAxAJQKIGVcAVAbQAYBdRUABwHtYBLAF0boDtqQAPRAFlQAaEAE9EARgDM4gBwA6AKwA2Scr5TZATgWaAvruFp0cgDZ0ojdgH0wAWwCGjE3Ls1mIq5ZoBXZpgDCAPIAckQAksEAqrjkVEgg9EysHFy8CKpkigDsfJqaWeKomjJKOsJiCDKSmTLiSkp8SvkqkpJ6BiBGpuaWNg5OLrZuHl6+mLgAsgCCYQAyVhEACpGklFyJLGyc8WkZ2bn5hcWlmuUSCuJykgcyqFWoCllkMnz6hhjdFtZ2js6u7p52D4-JMZvMlisSOI4rQGJsUjtEHtHgcCkUSmVRBJxFlJFdVHwyGR6tUVK8Ol0zF8+r9BsNAcDxtM5gtgstSKgYQk4cltqBdgpMii8mjjpiKnwnnJNEoyJIZDK+NciS83p0PlTej8Bv8PGAAE76uj6gIhcJRGJreIbXmpRBPS7iOWFVDXLKoOpnSqqOSoD0yGQ5HIPEpqyk9b79P5DAEGo0m0EsiGrLk2rZ2yqNOSyHKaJW5SR3SRegryPOSAqlCsVgNhjURmk6mN6w3Gplg1nsqGpnnpxGZpTZwO5fOaQtVL0vPhySW5JTiJ1qGR14yayO0ywAN3sJkYEAZYyCoQi0Vi617CP5iBeg5zI+uY6LXp0ePUqEl4hlmidMpXny1UZyFuO57geILMuCbKQlasJJH2V7pFkg58MOSh3GOBatF61wKDORTiHwgpZBc0hKH+a6Ns4wG7vuozgR2ybduecGXjw15Zne5YFk+WIII0WRyAGLo5CqhKoORDbalR7DbjRNitiaR7mqeMHcixfJsQghS1DOjR5hcshkAoFZeguDTSuIChWVZhSNKgZEUvW1JSUBMkgfucZtomkFdqpaasWkN5Drmo7jsWvFOpZcjEvkWRVHFmh3MujmrpJgHUaBnkJhBnaQtCzHwhpaSWbIgkPHU8rEa6E4RWQkqCXVFUlHUc4Sc56VuXJWXtkmUEcj26kZguWSaIogrEhcKh1QqplyqN8oCK0qDEQ0hRtQBtKyaBdGmseFpntaF5FYgqDPJc9QKgZDTKEIEU1tKeYrXkiV1O07ype1m3uWBPU+dBA2FUNCh8NOuJIUUKgBicpmqAJCgBpNxmfih4kpf+64DFttFAmM3m5aQ+WHYN-YlfItyTZVCjVeFFTDXirTA88Ah5J+60Y84WM-XjjGcgVtok8DoMVu6dzqNp2FkKN87KEZZlPFZ+gdOwdAQHAXBGHz8GaQAtEoXra++0VEsbJtEuIbOUZrAUSK00oVrk7qXfOXoqHISi5t+6hoTIxnJe96OUXSAJ0Vbx1aTpY65o72jO7xAbTq0Ps4u7KEjebaMUS5uryfGocZk08gEXkCoPGQDyTgq0UvKo1RLsoFsuRl2PAnn-ZNNOPtEq0TzulIpy8YKr6S9UkpGYGY4Nx1nNZa3CGFFkAkEZVSo1iUt20-6cgLzIkup8UUgOf7meAZzIdE4DJPfniTpl0ShEhqUMNxW7CNysS9koYf6rGDQ9iwLAAB3Y0EBZ6aUeKZd004FzNAXESD0BRFa6CAA */
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
            actions: assign((context) => {
                return {
                    emailValue: '',
                    emailErrorMessage: '',
                    emailValidationMessage: '',
                    dispatchedContinue: false,
                    passwordValue: '',
                    passwordErrorMessage: '',
                    passVisible: false,
                    // "Invalid username or password" | "Account is locked" (3rd time)
                };
            }),
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
                                actions: ['dispatchEmailNext', 'setEmptyError'],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.valid_input',
                                guard: 'emailValid',
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: ['inputEmail', 'setValidError'],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_input',
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
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
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                actions: ['inputEmail', 'setValidError'],
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
                                actions: ['dispatchEmailNext'],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                        EMAIL_INPUT: [
                            {
                                target: '#b2c.login_email.empty_input',
                                guard: 'emailEmpty',
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.valid_input',
                                actions: 'inputEmail',
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
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.valid_input',
                                guard: 'emailValid',
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: 'inputEmail',
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
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_error',
                                guard: 'emailInvalidError',
                                actions: ['inputEmail', 'setValidError'],
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                            {
                                target: '#b2c.login_email.invalid_input',
                                actions: 'inputEmail',
                                description: '***** DESCRIPTION DEFINED BY BA *****',
                            },
                        ],
                    },
                },
            },
        },
        password: {},
    },
});

const testMachineActor = createActor(testMachine).start();

module.exports = { testMachine, testMachineActor };
