import { useState,useContext } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import UserContext from "@/context/UserContext";
import {Button} from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Loader2,AlertCircle } from "lucide-react";

const loginSchema = Yup.object({
    email: Yup.string().required().email("Invalid email address"),
    password: Yup.string().required().min(8,'Password must be atleast 8 characters')
})

export default function Login(){
    const {handleLogin} = useContext(UserContext);
    const [isLoading,setIsLoading] = useState(false);
    const [globalError,setGlobalError] = useState(null);
    
    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema: loginSchema, 
        validateOnBlur:true,
        validateOnChange:true,
        onSubmit: async(values) => {
        setIsLoading(true);
        setGlobalError(null);
        try {
            await handleLogin(values);
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
                    console.log(err);
                    
                    setGlobalError("Something went wrong. Please check your connection.");
                }
            }
            finally{
                setIsLoading(false);
            }
                
    }
    })


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px] shadow-lg">
                <CardHeader>
                    <CardTitle>RentFlow Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
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
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="owner@example.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} 
                             className={formik.touched.email && formik.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            { formik.touched.email && formik.errors.email && (<span className="text-xs text-red-500 font-medium block mt-1">{formik.errors.email}</span>)}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                            <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" 
                            name="password"
                            type="password" 
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.password && formik.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.password && formik.errors.password && <span className="text-xs text-red-500 font-medium block mt-1">{formik.errors.password}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}