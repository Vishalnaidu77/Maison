import { useDispatch, useSelector } from "react-redux"
import { register } from "../services/auth.api"
import { setError, setloading, setUser } from "../state/auth.slice"

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister(fullname, email, contact, password, isSeller = false) {
        dispatch(setloading(true))

        try {
            const res = await register(fullname, email, contact, password, isSeller)
            dispatch(setUser(res.user))
            dispatch(setloading(false))
        } catch (err) {
            dispatch(setError(err.messsage))
            throw new Error(err.messsage);
        } finally{
            dispatch(setloading(false))
        }
    }


}