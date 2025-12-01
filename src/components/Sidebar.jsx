import { Link,useLocation } from "react-router-dom";
import { LayoutDashboard,Building2,Users,FileText,LogOut } from "lucide-react";
import clsx from "clsx";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import { resetBuildings } from "@/slices/building-slice";
import { useDispatch } from "react-redux";

export default function Sidebar(){
    const location = useLocation();
    const {handleLogout,user} = useContext(UserContext);

    const dispatch = useDispatch();

    const onLogoutClick = () => {
        dispatch(resetBuildings());
        handleLogout();
    }

    const navItems = [
        {name:'Overview',icon:LayoutDashboard,path:'/dashboard'},
        {name:'Buildings',icon:Building2,path:'/dashboard/buildings'},
        {name:'Tenants',icon:Users,path:'/dashboard/tenants'},
        {name:'Agreement',icon:FileText,path:'/dashboard/agreements'},
    ];

    return (
        <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-40 shadow-sm">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    RentFlow
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 ml-8">Owner Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map( (item) => (
                    <Link 
                    key={item.path}
                    to={item.path}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon size={20}/>
                        {item.name}
                    </Link>
                ) )} 
            </nav>

            <div className="p-4 border-t bg-gray-50">
                <div className="mb-4 px-2">
                    <p className="text-sm font-semibold text-gray-900">
                        {user?.name || 'Owner'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {user?.email }
                    </p>
                </div>

                <button
                onClick={onLogoutClick} 
                className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                    <LogOut size={18}/>
                    Logout
                </button>
            </div>
        </div>
    )
}