import { useDispatch } from "react-redux"
import { setError, setLoading, setUser } from "../states/auth.slice"
import { getMe, login, register } from "../services/auth.api"

export const useAuth = () => {

    const dispatch = useDispatch()

    const handleRegister = async (fullname, email, contact, password, isSeller) => {
        dispatch(setLoading(true))

        try {
            const res = await register(fullname, email, contact, password, isSeller)
            dispatch(setUser(res.user))
            dispatch(setLoading(false))
            return res.user
        } catch (err) {
            dispatch(setError(err.message))
            return err.message
        } finally{
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async (email, password) => {
        dispatch(setLoading(true))

        try {
            const res = await login(email, password)
            dispatch(setUser(res.user))
            dispatch(setLoading(false))
            return res.user
        } catch (err) {
            dispatch(setError(err.message))
            return err.message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async () => {
        dispatch(setLoading(true))

       try {
            const res = await getMe()
            dispatch(setUser(res.user))
            return res.user
       } catch (err) {
            dispatch(setError(err.message))        
       } finally {
            dispatch(setLoading(false))
       }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }
}
