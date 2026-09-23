const BASE_URL = import.meta.env.VITE_API_URL

const AUTH={
    Register:`${BASE_URL}/api/v1/register`,
    Login:`${BASE_URL}/api/v1/login`,
    ForgetPassword: `${BASE_URL}/api/v1/forget-password`,
    ResetPassword: `${BASE_URL}/api/v1/reset-password`,
}

const MAIL={
    createTemplete:`${BASE_URL}/api/v1/createtemplete`,
    ReadTemplete:`${BASE_URL}/api/v1/gettemplete`,
    UpdateTemplete:`${BASE_URL}/api/v1/updatetemplete`,
    DeleteTemplete:`${BASE_URL}/api/v1/deletetemplete`,
    MailSend:`${BASE_URL}/api/v1/sendmail`
}


export {AUTH,MAIL}