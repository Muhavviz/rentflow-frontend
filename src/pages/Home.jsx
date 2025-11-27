import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import heroImage from '../assets/rentflowhero.png'; 

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <section className="flex-1 container mx-auto px-4 py-12 flex flex-col-reverse md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-2">
                        For Property Owners & Tenants
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-gray-900 leading-tight">
                        Manage your <br/>
                        <span className="text-primary">Empire.</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-lg mx-auto md:mx-0">
                        Stop using spreadsheets. RentFlow gives you a blueprint to manage units, tenants, and payments in one streamlined dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <Link to="/register"><Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">Get Started</Button></Link>
                        <Link to="/login"><Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-2">Login</Button></Link>
                    </div>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    <img src={heroImage} alt="RentFlow Architecture Sketch" className="w-full max-w-[500px] object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
            </section>
        </div>
    );
}