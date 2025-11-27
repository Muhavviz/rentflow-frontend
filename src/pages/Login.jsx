import { useState,useContext } from "react";
import { useForm } from "react-hook-form";
import UserContext from "@/context/UserContext";
import {Button} from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login(){
    const {handleLogin,serverErrors} = useContext(UserContext);
    const {register,handleSubmit,formState:{errors}} = useForm()
    const [isLoading,setIsLoading] = useState(false);
    
    const onSubmit = async(data) => {
        setIsLoading(true);
        await handleLogin(data);
        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>RentFlow Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    {serverErrors && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">{serverErrors}</div>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="owner@example.com" {...register("email", { required: "Email is required" })} />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password", { required: "Password is required" })} />
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}