import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import heroImage from '../assets/rentflowhero.png'; 

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white">  
            <section className="flex-1 container mx-auto px-4 py-6 flex flex-col-reverse md:flex-row md:items-start items-center gap-12 mt-4 md:mt-10">
                
                <div className="flex-1 text-center md:text-left space-y-8">
                    
                    <div className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-sm font-bold text-yellow-800 shadow-sm">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-600 mr-2 animate-pulse"></span>
                        v1.0 Under Development
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">
                            The Property Management Suite
                        </h2>
                        
                        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-gray-900 leading-[1.1]">
                            Manage your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Empire.
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Stop using spreadsheets. <span className="font-semibold text-gray-900">RentFlow</span> gives you the blueprint to track units, onboard tenants, and automate agreements in one dashboard.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-2 hover:bg-gray-50">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex justify-center md:justify-end">
                    <img 
                        src={heroImage} 
                        alt="RentFlow Architecture Sketch" 
                        className="w-full max-w-[550px] object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                </div>
            </section>
        </div>
    );
}