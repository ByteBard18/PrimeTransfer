import { Navigate, Outlet } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { userState } from "../recoil/atoms"

export const PrivateRoutes = () => {
    let auth = useRecoilValue(userState)
    console.log(auth)
    return (
        auth.token ? <Outlet /> : <Navigate to="/login" />
    )
}

