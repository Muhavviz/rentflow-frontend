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
                    const response = await axios.get('/api/users/dashboard',{headers:{Authorization:localStorage.getItem('token')}});
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
        try {
            const response = await axios.post('/api/users/login',formData);

            if(response.data.user.needsPasswordChange){
                navigate('/change-password',{state:{email:formData.email}});
            }else{
                localStorage.setItem('token',response.data.token);
                userDispatch({type:'LOGIN',payload:response.data.user});
                navigate('/dashboard');
            }
            
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Something went wrong';
            userDispatch({type:'SET_ERRORS',payload : errorMsg});
        }
    }

    const handleRegister = async(formData) => {
        try {
            const response = axios.post('/api/users/register',formData);
            navigate('/login')
        } catch (err) {
            console.log(err);
            
            if(err.response && err.response.data ){
                if(Array.isArray(err.response.data.error)){
                    const messages = err.response.data.error.map( ele => ele.message ).join(', ');
                    userDispatch({type:'SET_ERRORS',payload:messages});
                }
                else if (typeof err.response.data.error === 'string') {
                    userDispatch({ type: 'SET_ERRORS', payload: err.response.data.error });
                }
                else {
                    userDispatch({ type: 'SET_ERRORS', payload: 'Registration failed' });
                }
            }
            else{
                userDispatch({ type: 'SET_ERRORS', payload: 'Something went wrong. Is backend running?' });
            }
        }
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

