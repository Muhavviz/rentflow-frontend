import { useState,useContext } from "react";
import { useForm } from "react-hook-form";
import UserContext from '../context/UserContext';
import {Button} from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register(){
    const {handleRegister,serverErrors} = useContext(UserContext)
    const {register,handleSubmit,formState:{errors}} = useForm();
    const [isLoading,setIsLoading] = useState(false);

    const onSubmit = async(data) => {
        setIsLoading(true);
        await handleRegister(data);
        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Start managing your properties today.</CardDescription>
                </CardHeader>
                <CardContent>
                    {serverErrors && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">{serverErrors}</div>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" {...register("name", { required: "Name is required" })} />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="owner@example.com" {...register("email", { required: "Email is required" })} />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })} />
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register"}
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    ); 
}