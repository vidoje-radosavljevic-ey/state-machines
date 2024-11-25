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

        // checkedEmail: () => Math.random() < 0.5,
        // notCheckedEmail: () => Math.random() < 0.5,
        // isAuthenticated: () => Math.random() < 0.5,
        // isNotAuthenticated: () => Math.random() < 0.5,
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAdGAHYAuYuA+mhjvgMQDCAMgJKMDSlAYgPIBKAcV4AVANoAGALqIU2WAEtSC7MVkgAHogCs2gMwE9R4yaMAWADQgAnoj1mAnAF8nVmljyES5Ku7oQmNk5KYUoAIQBBTkkZJBBkeSUVNTitBABGdIk9K1sEe2dXePQPfCIyCmoS-0D2LmZeQUpWADkY9QTFZVV1NPTdMwIJAA5TU21cuwAmMxc3as9ynyraT1rghqbWsXTYuS7k3sR+4YB2Am1RseMJm0QzADZZor9F70rXhhY6yk3mtqme3iiW6KVAfSeDgIZnSDzh8IRp0mCAeEme81WZQUxAAbqgADYKCCUACusAoxFQAFswJQ8CtSgFvsE+EJRO04p0kj1UjozDk7iipoUMYyCNi8YTiWSKdTafTPkyglxQpFotIOiDDryMpkHsiHsK5sVMYQJQSiaTybhKTS6b4Fl9lb9Gv8OftuWDNMcstohldrnpbnlRg9jYrxbiLdLrbb5Q7Tet6q7trtNQceeDjmj0hcA9dg4gHKcwy9HV4qchSNYGTVmVxWcJxBrOVrM96EKc9FMhhI+-2BxJ0gajWXTURK9Xa2t6yFeOEohx3cCM160g4prnB9uhyORSaxWBJzXFUmXVs2i2PaCjp2Zv7A0ZCwhQ+HyxOqyfy2e-qmgVybx1OEJDzR8g2RYtS1FfwCAAMzwKBsFIacnR+VVF2XADtSzfJLkMMDwMFAo33HeDcEQ5DTxaABRAANZt-zbNd7nSBw9xIsUyIolCAlCNgADVqMwpjbymEt2LHRl6H4aiAGVqIY9NPVvdIpmRbQphcIpiGwCA4A6cslMAnCAFozGGZETKmKYJA4mD3gTRkjOwjssmGfVBSmbs7MWc0pStWU7QVQzW1XFSzC8iCSx8soj0-HjnPbPp+mfU4zHRA8YK4pCEtC5SdQ0iRkUcKDMsWHEKAUWCawAY10sBEuY-JTjYwU0oyiMqVQSkYGobBCRqhR9Ly4zXIeBxWryTJYRiitUAUfFGpU9I9CRQUSq0pwgA */
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
