import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "https://maison-tr08.onrender.com/api/auth" || "http://localhost:8000/api/auth",
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

export async function login(email, password) {
    const res = await authApiInstance.post("/login", {
        email,
        password
    })

    return res.data
}

export async function getMe(){
    const res = await authApiInstance.get("/get-me")
    return res.data
}