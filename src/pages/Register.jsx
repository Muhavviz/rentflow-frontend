import { useState,useContext } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import UserContext from '../context/UserContext';
import {Button} from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Loader2,AlertCircle } from "lucide-react";
import { Alert,AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { email } from "zod";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

const registerSchema = Yup.object({
    name: Yup.string()
    .min(3,'Name must be atleast 3 characters')
    .max(35,'Name is too long')
    .required('Name is required'),
    email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
    password: Yup.string()
    .min(8,'Password must be atleast 8 characters')
    .max(128,'Password must be less than 128 characters')
    .matches(passwordRules,{message:'Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character'})
    .required('Password is required')
})

export default function Register(){
    const {handleRegister,serverErrors} = useContext(UserContext);
    const [isLoading,setIsLoading] = useState(false);
    const [globalError,setGlobalError] = useState(null);

    const formik = useFormik({
        initialValues:{
            name:'',
            password:'',
            email:''
        },
        validationSchema:registerSchema,
        validateOnBlur:true,
        validateOnChange:true,

        onSubmit:   async(values) => {
            setIsLoading(true);
            setGlobalError(null);
            try {
                await handleRegister(values);
                
            } catch (err) {
                if (err.response && err.response.data) {
                    if (err.response.data.error && typeof err.response.data.error === 'string') {
                        setGlobalError(err.response.data.error);
                    } else if (Array.isArray(err.response.data.error)) {
                        err.response.data.error.forEach((errorObj) => {
                            formik.setFieldError(errorObj.path[0], errorObj.message);
                        });
                    }
                } else {
                    setGlobalError("Something went wrong. Please check your connection.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    })


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[400px] shadow-lg">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Start managing your properties today.</CardDescription>
                </CardHeader>
                <CardContent>

                    {globalError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{globalError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name='name' placeholder="John Doe" 
                            value={formik.values.name} onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.name && formik.errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.name && formik.errors.name && (
                            <span className="text-xs text-red-500 font-medium">{formik.errors.name}</span>)}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name='email' type="email" placeholder="owner@example.com" 
                            value={formik.values.email} onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} className={formik.touched.email && formik.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                             />
                            {formik.touched.email && formik.errors.email && (
                                <span className="text-xs text-red-500 font-medium">{formik.errors.email}</span>)}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password"  name='password'
                                value={formik.values.password} onChange={formik.handleChange} onBlur = {formik.handleBlur}
                                className={formik.touched.password && formik.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                             />

                            {formik.touched.password && formik.errors.password &&(
                                 <span className="text-xs text-red-500 font-medium">{formik.errors.password}</span>)}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register"}
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    ); 
}