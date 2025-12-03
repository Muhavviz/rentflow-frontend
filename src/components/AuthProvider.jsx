import { useReducer,useEffect } from "react";
import UserContext from "@/context/UserContext";
import axios from "@/config/axios";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

const userReducer = (state,action) => {
    switch(action.type){
        case 'LOGIN':{
            return {...state,isLoggedIn:true,user:action.payload,serverErrors:null};
        }
        case 'LOGOUT':{
            return {...state,isLoggedIn:false,user:null}
        }
        case 'SET_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        default:{
            return {...state}
        }
    }
}

export default function AuthProvider(props){
    const navigate = useNavigate();


    const [userState,userDispatch] = useReducer(userReducer,{
        user:null,
        isLoading:false,
        serverErrors:null
    })

    useEffect( () => {
        if(localStorage.getItem('token')){
            (async () => {
                try {
                    const response = await axios.get('/api/dashboard',{headers:{Authorization:localStorage.getItem('token')}});
                    userDispatch({type:'LOGIN',payload:response.data})
                } catch (err) {
                    localStorage.removeItem('token');
                    userDispatch({type:'LOGOUT'})
                }
            }

            )()
        }
    }, [] );

    const handleLogin = async(formData) => {

            const response = await axios.post('/api/users/login',formData);

            // Store token even if password change is required (needed for authentication)
            localStorage.setItem('token',response.data.token);

            if(response.data.user.needsPasswordChange){
                navigate('/change-password',{state:{email:formData.email}});
            }else{
                userDispatch({type:'LOGIN',payload:response.data.user});
                navigate('/dashboard');
            }
            

    }

    const handleRegister = async(formData) => {
        
            await axios.post('/api/users/register',formData);
            navigate('/login')
       
      
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        userDispatch({type:'LOGOUT'});
        navigate('/login');
    }

    return (
        <UserContext.Provider value={{...userState,handleLogin,handleLogout,handleRegister}}>
            {props.children}
        </UserContext.Provider>
    )
}

