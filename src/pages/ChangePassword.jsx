import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "@/context/UserContext";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import axios from "@/config/axios";


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

const changePasswordSchema = Yup.object({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
    oldPassword: Yup.string()
        .required("Current password is required")
        .min(8, "Password must be at least 8 characters"),
    newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            passwordRegex,
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref('newPassword')], "Passwords must match")
});

export default function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState(null);

    const email = location.state?.email || user?.email || '';


    const isForcedChange = !isLoggedIn || !user;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const formik = useFormik({
        initialValues: {
            email: email,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        enableReinitialize: true, 
        validationSchema: changePasswordSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            setIsLoading(true);
            setGlobalError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setGlobalError("Authentication required. Please log in again.");
                    setIsLoading(false);
                    return;
                }

                const payload = {
                    email: values.email,
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                };

                await axios.post('/api/users/password', payload, {
                    headers: { Authorization: token }
                });

                try {
                    const userResponse = await axios.get('/api/users/me', {
                        headers: { Authorization: token }
                    });
                    navigate('/dashboard');
                } catch (refreshErr) {
                    console.error('Failed to refresh user data:', refreshErr);
                    navigate('/login', { 
                        state: { message: 'Password changed successfully. Please log in with your new password.' }
                    });
                }
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
            } finally {
                setIsLoading(false);
            }
        }
    });

    if (!email) {
        return null; 
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px] shadow-lg">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        {isForcedChange 
                            ? "Please set a new password for your account."
                            : "Update your account password."
                        }
                    </CardDescription>
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
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Current Password</Label>
                            <Input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                placeholder="Enter current password"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.oldPassword && formik.errors.oldPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.oldPassword && formik.errors.oldPassword && (
                                <span className="text-xs text-red-500 font-medium block mt-1">
                                    {formik.errors.oldPassword}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.newPassword && formik.errors.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <span className="text-xs text-red-500 font-medium block mt-1">
                                    {formik.errors.newPassword}
                                </span>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Must include uppercase, lowercase, number, and special character
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <span className="text-xs text-red-500 font-medium block mt-1">
                                    {formik.errors.confirmPassword}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {!isForcedChange && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1" 
                                    onClick={() => navigate('/dashboard')}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button 
                                type="submit" 
                                className={isForcedChange ? "w-full" : "flex-1"} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Changing Password...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

