// import { setup, createActor, assign } from 'xstate';
const { setup, createActor, assign } = require('xstate');

//TODO: Add a new state

const testMachine = setup({
    actions: {
        inputValidationWrongPassword: assign(({ event }) => ({ passwordValue: event.value, passwordErrorMessage: '' })),
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
            console.log('GUARD FOR EMPTY PASSWORD', result);
            return result;
        },
        passwordValid: ({ event, context }) => {
            const result = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(event.value);
            console.log('GUARD FOR VALID PASSWORD:', result);
            return result;
        },
        passwordInvalid: ({ event, context }) => {
            const reg = !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(event.value);
            const result = reg && event.value !== '';
            console.log('GUARD FOR INVALID PASSWORD:', result);
            return result;
        },

        // checkedEmail: () => Math.random() < 0.5,
        // notCheckedEmail: () => Math.random() < 0.5,
        // isAuthenticated: () => Math.random() < 0.5,
        // isNotAuthenticated: () => Math.random() < 0.5,
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAdGAHYAuYuA+mhjvgMQDCAMgJKMDSlAYgPIBKAcV4AVANoAGALqIU2WAEtSC7MVkgAHogBMAFgDMAGhABPRAEZzEgJwBfW8ZpY8hEuSpO6EJm06VhlABCAIKckjJIIMjySipqkVoIekamOgDsAKz2jujO+ERkFNS5Xj7sXMy8gpSsAHLh6tGKyqrqicnGZggAbAAcadlRJS4F7sW0LmV+ldV1YuYRcs1xbToGnYh9Aw5DE-luRZ6TLOWUMzX12otRMS3xoO3rqT39g0f5CsQAbqgANgoQSgAV1gFGIqAAtmBKHhxnlvCc-HwhKIGpEmrFWglEL1cRsEBlrBI3sMPt8-gDgaDcOCoTCPKSEb4uAEQmFpI1bitsQhcb18bpBSS9oRPj9-oCQWDIdDYe8madznMOeiuViHji8c8MrpzML4QQxRTJdTabKGSKphUqhd5tcMXdVrytV0dXqdvKiBDkKQTHDSoiuMjhOIVUtMfdNBZdHp8WldHYPYyvT6-fKrf5eEFQhw0eHHTzzDHdHGJMSkyKU77-cdmWcbcr7WrI4lrJYBdZtPqvFW04yM0r6gtOct1VGEG3zB2uxWDQAzPBQbCkGsMQOZ7PspujlsWDJpaz46y9RM5SsL3BLlfp2oAUQAGqHtxGneZrGkJPirO-uyML1fV28AI2AANVvPMbh3J1P2ecsz3heh+FvABlW8nxHF9CwkTIvxnHZiGwCA4EaRkMILDUEAAWl0flnko7QJH0X99kKC14TI7kKN0NI4ysZjRXJCUqWlOk5VI1UoJ5Qkp2eBMZ3gnswG9at5Q4sdEnMPRulLODdnnRdl0AtTdwQcwDxSLpv22BSRi+CgFDnP0AGNCLAYynQYtIZMsmxrL0nsIVQcEYGobB-ichRiIkzCKLM6wLM2fR3Rs-ZAoUX53MLcz8T6U9-JGI0hKlGkZXpQCCCcgALMAnIAa0oC9qFwTKKO6fRD21Xo8NsIA */
    id: 'password',
    context: {
        passwordValue: '',
        passwordErrorMessage: '',
        passVisible: false,
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

            states: {
                check_for_pr: {}
            },

            initial: "check_for_pr"
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
            },
        },
        verify_code: {},
        manage_policies: {},
        email: {},

        // reset_password: {
        //     initial: 'idle',
        //     states: {
        //         idle: {
        //             on: {
        //                 NEXT: '#manage_policies'
        //             }
        //         }
        //     }
        // }
    },
    // forgot_password: {
    //     on: {
    //         NEXT: '#b2c.verify_code',
    //         'BACK2.LOGIN': '#b2c.login_password.idle',
    //     },
    // },
    // verify_code: {
    //     //validation message: "Enter your email verification code"
    //     on: {
    //         VERIFY: '#b2c.reset_password.idle',
    //         RESEND: '',
    //     },
    // },
    // reset_password: {
    //     // length 8, 1upper, 1lower, 1spec char
    //     // your new passwords don't match
    //     initial: 'idle',
    //     states: {
    //         idle: {
    //             on: {
    //                 RESET: [
    //                     // if same passwords that match validation, go on
    //                     {
    //                         target: '#b2c.manage_initial.idle',
    //                     },
    //                     // if passwords don't match - error
    //                 ],
    //             },
    //         },
    //         // "error": {

    //         // }
    //     },
    // },
    // login_password: {
    //     initial: 'idle',
    //     states: {
    //         idle: {
    //             on: {
    //                 'BACK2.EMAIL': {
    //                     target: '#b2c.login_email.idle',
    //                 },
    //                 FORGOT_PASSWORD: {
    //                     target: '#b2c.forgot_password',
    //                 },
    //                 LOG_IN: {
    //                     target: '#b2c.authenticate',
    //                 },
    //                 TOGGLE_PASSWORD_VISIBILITY: {
    //                     target: '',
    //                     action: 'togglePassVisibility',
    //                 },
    //             },
    //         },
    //         error: {},
    //     },
    // },
    // authenticate: {
    //     always: [
    //         {
    //             target: '#b2c.manage_initial',
    //             guard: 'isAuthenticated',
    //         },
    //         {
    //             target: '#b2c.login_password.error',
    //             guard: 'isNotAuthenticated',
    //         },
    //     ],
    // },
    // manage_initial: {
    //     initial: 'idle',
    //     states: {
    //         idle: {
    //             on: {
    //                 LOGOUT: '#b2c.login_email.idle',
    //             },
    //         },
    //     },
    // },
});

const testMachineActor = createActor(testMachine).start();

module.exports = { testMachine, testMachineActor };
