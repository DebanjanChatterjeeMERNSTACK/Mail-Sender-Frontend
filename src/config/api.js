const BASE_URL = import.meta.env.VITE_API_URL

const AUTH={
    Register:`${BASE_URL}/register`,
    Login:`${BASE_URL}/login`,
    ForgetPassword: `${BASE_URL}/forget-password`,
    ResetPassword: `${BASE_URL}/reset-password`,
}


export {AUTH}