import { Navigate } from "react-router-dom"
import { useUserContext } from "../../shared/context/UserContext";
import type { ReactNode } from "react";


export const RequireAuth =({children}:{children:ReactNode})=>{
    const {user,loading} = useUserContext();

    if(loading){
        return <div>loading...</div>
    }
    if(!user){
        return <Navigate to="/" replace/>

    }
    
    return children;
}