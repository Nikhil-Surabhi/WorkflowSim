const { default: apiExecute } = require(".")

export const LoginApi = async (data) => {
    return apiExecute('login', 'POST', { data: data })
}

export const SendLinkToResetPassword = async (data) => {
    return apiExecute('send-reset-password-link', 'POST', { data: data })
}

export const SocialLoginApi = async (data) => {
    return apiExecute('social-login', 'POST', { data: data })
}

export const RegisterApi = async (data) => {
    return apiExecute('register', 'POST', { data: data })
}

export const ProfileApi = async () => {
    return apiExecute('profile', 'GET', { auth: true })
}

export const resetPasswordLinkApi = async (data) => {
    return apiExecute('send-reset-password-link', 'POST', { data: data })
}

export const getResetPasswordToken = async (id) => {
    return apiExecute(`reset-password/${id}`, 'GET')
}

export const changePassword = async (data) => {
    return apiExecute('reset-password', 'POST', { data: data })
}

// module.exports = {
//     LoginApi,
//     SocialLoginApi,
//     RegisterApi,
//     ProfileApi
// }
