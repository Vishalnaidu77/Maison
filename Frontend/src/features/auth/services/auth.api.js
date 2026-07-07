import axios from 'axios'

const authApiInstance = axios.create({
    baseURL: "http://localhost:8000/api/auth",
    withCredentials: true
})

export async function register(fullname, email, contact, password, isSeller) {
    const res = await authApiInstance.post("/register", {
        fullname,
        email,
        contact,
        password,
        isSeller
    })

    return res.data
}