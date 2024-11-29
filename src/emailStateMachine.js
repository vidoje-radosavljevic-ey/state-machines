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
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBMBjAdAGwPZQEsA7AfTAFsBDA7TCgBwBcBPE4+gV0YGIBhAeQByAFQCSggKoBRANoAGALqJQ9XLAKMCuIspAAPRAHYArAGYANCGaIAbABYAnAF8nltFjyFSFarQYs2Ik4eKQBZAEFRABkScQAFCWF5JSQQVXVNbV0DBEM7CytEAEY5GyLMU0qq6qqXNwwcfGIyKho6ciZWdi5uMMiY+MSZIpSVNQ0tHVScotmbS2sEEptUTBt1jc314zqQd0avFt92zsDg3ojo2MEEpNRRtPHMqdAZ4zk7BeKSgA4KmoBpl2+08zR8bX8XSCPUEUgA6iQACJhfjJXTpCZZaaIH52QxfJaoSr-QHVYENUHeVp+DoBbo8ABC4V4AGkSMJ+CQAMrCcLCKRRACaaNSGOe2RxqE+hQQxmMzlcewpTSpx0hZAAThrcBq+EIxJJZIp0U9JhKlu9pYsbA5DGstg6bOSPCqjhDaawwFqdRd+tdbiKxhkzdiLR8CcZUMZ7Y7Ns6DmDqScAl7tbq+ldBkkRibg1jXsUfoZ8TK7D8bCTSaZUE7FSDXeDaMQAG6UbAECBnHoCETiaSBx55l76RA196YYwEww2O2xzaGeOUt1Noit9ud+m+zM3IbG0Wm-Mj3L5AlFaumStVxcNpMttsdrshS4DHfZh5ikMFhCoGtyU9yIo7SBOtlUORtMDvddNTTPVe0NAcP0PHIa0qAl7DsGM5wXECXTA29V3vTtUx9DMXwDPcg0xYccjyApFlMItrzw45IIfYj02ff0hhzfch3NH8bD-GUGOw+pcMTFiCKg9itzIoZ7lzKj+JsVDhMYnCE1VNo1wfTcewNfsKMHJTQ2rMsCQcYxZyrWoNKXcCdI3aEnz9LMEIPaijBPGUfh+BxL1JJiJO0wjH1kri30U8VQ1mIp5hlQwHGAsTNOXTBHLC0iIpkBTeJMr8iktAkfgYzDY1EpV0G4AAlKQuSkJIjMQzzvxnU9UEMP4bNslL7KTdVNykZswCIRgAAJDHcvjQ2MewJ3a3ygq0mlTk3ZFQgASiRFEpvyo8ijsVA-h+YwigcPFfLLWjT0cDDqkjBx7HLFxFSIXAIDgXR3Ciz8j1QM72qW5cfqQxAiplVBbSB8CBuckGWrlVBT1MMtof6j1oJ1eHzSKKUS0WQwALRySMvpbHTLkf7TwOuxibaViiO9DVya-Ik7Higmobsm9jlJuG8uigrHp+f8a3jehKFgWAAHcdQgFmj1MU6CTHOnaEEMBpbG2BGEoRgwDGooFZyRH5plXG4pepwgA */
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

                        NEW_DEMO: 'valid_input',
                        BACK_TO_STATELY: 'empty_error',
                        "Event 7": "New state 1",
                        "DEM)_DEMO": "valid_input"
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

                "New state 1": {}
            },
        },

        password: {},
    },
});

const testMachineActor = createActor(testMachine).start();

module.exports = { testMachine, testMachineActor };
