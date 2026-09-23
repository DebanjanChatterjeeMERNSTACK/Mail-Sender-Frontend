const BASE_URL = import.meta.env.VITE_API_URL

const AUTH={
    Register:`${BASE_URL}/api/v1/register`,
    Login:`${BASE_URL}/api/v1/login`,
    ForgetPassword: `${BASE_URL}/api/v1/forget-password`,
    ResetPassword: `${BASE_URL}/api/v1/reset-password`,
}


export {AUTH}