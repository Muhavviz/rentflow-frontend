import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Settings as SettingsIcon, 
    Bell, 
    Shield, 
    Database, 
    Mail, 
    Lock, 
    Globe,
    Palette,
    Save,
    Check,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const settingsSections = [
    {
        id: "notifications",
        title: "Notifications",
        icon: Bell,
        description: "Manage notification preferences",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "security",
        title: "Security",
        icon: Shield,
        description: "Security and access controls",
        gradient: "from-red-500 to-orange-500"
    },
    {
        id: "database",
        title: "Database",
        icon: Database,
        description: "Database configuration",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "email",
        title: "Email Settings",
        icon: Mail,
        description: "Email service configuration",
        gradient: "from-indigo-500 to-violet-500"
    },
    {
        id: "appearance",
        title: "Appearance",
        icon: Palette,
        description: "Theme and display settings",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        id: "general",
        title: "General",
        icon: Globe,
        description: "General platform settings",
        gradient: "from-slate-500 to-slate-700"
    }
];

export default function Settings() {
    const [activeSection, setActiveSection] = useState("notifications");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        System Settings
                    </h2>
                    <p className="text-slate-500 mt-1.5">Configure platform settings and preferences</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button 
                        onClick={handleSave}
                        className={`bg-gradient-to-r ${saved ? "from-emerald-600 to-teal-600" : "from-indigo-600 to-purple-600"} hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300`}
                    >
                        {saved ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="h-5 w-5 text-indigo-600" />
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <div className="space-y-1">
                                {settingsSections.map((section, index) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <motion.button
                                            key={section.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                isActive
                                                    ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg`
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="flex-1 text-left">{section.title}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Settings Content */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-3"
                >
                    <Card className="border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const section = settingsSections.find(s => s.id === activeSection);
                                    const Icon = section?.icon || SettingsIcon;
                                    return (
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${section?.gradient || "from-slate-500 to-slate-700"} shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    );
                                })()}
                                <div>
                                    <CardTitle className="text-2xl">
                                        {settingsSections.find(s => s.id === activeSection)?.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {settingsSections.find(s => s.id === activeSection)?.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {activeSection === "notifications" && (
                                    <div className="space-y-4">
                                        <SettingToggle label="Email Notifications" description="Receive email notifications for important events" defaultChecked={true} />
                                        <SettingToggle label="Push Notifications" description="Enable browser push notifications" defaultChecked={false} />
                                        <SettingToggle label="SMS Alerts" description="Send SMS for critical alerts" defaultChecked={false} />
                                        <SettingToggle label="Weekly Reports" description="Receive weekly platform reports" defaultChecked={true} />
                                    </div>
                                )}

                                {activeSection === "security" && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">Session Timeout</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option>15 minutes</option>
                                                <option>30 minutes</option>
                                                <option>1 hour</option>
                                                <option>2 hours</option>
                                            </select>
                                        </div>
                                        <SettingToggle label="Two-Factor Authentication" description="Require 2FA for admin accounts" defaultChecked={true} />
                                        <SettingToggle label="IP Whitelist" description="Restrict access to specific IP addresses" defaultChecked={false} />
                                        <SettingToggle label="Audit Logging" description="Log all administrative actions" defaultChecked={true} />
                                    </div>
                                )}

                                {activeSection === "database" && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">Backup Frequency</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option>Daily</option>
                                                <option>Weekly</option>
                                                <option>Monthly</option>
                                            </select>
                                        </div>
                                        <SettingToggle label="Auto Backup" description="Automatically backup database" defaultChecked={true} />
                                        <SettingToggle label="Backup Encryption" description="Encrypt database backups" defaultChecked={true} />
                                    </div>
                                )}

                                {activeSection === "email" && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">SMTP Server</label>
                                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="smtp.example.com" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">From Email</label>
                                            <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="noreply@rentflow.com" />
                                        </div>
                                    </div>
                                )}

                                {activeSection === "appearance" && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">Theme</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option>Light</option>
                                                <option>Dark</option>
                                                <option>Auto</option>
                                            </select>
                                        </div>
                                        <SettingToggle label="Compact Mode" description="Use compact spacing" defaultChecked={false} />
                                        <SettingToggle label="Animations" description="Enable UI animations" defaultChecked={true} />
                                    </div>
                                )}

                                {activeSection === "general" && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">Platform Name</label>
                                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="RentFlow" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <label className="text-sm font-semibold text-slate-900 mb-2 block">Timezone</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option>UTC</option>
                                                <option>America/New_York</option>
                                                <option>America/Los_Angeles</option>
                                                <option>Europe/London</option>
                                            </select>
                                        </div>
                                        <SettingToggle label="Maintenance Mode" description="Put platform in maintenance mode" defaultChecked={false} />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function SettingToggle({ label, description, defaultChecked = false }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors"
        >
            <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-1">{label}</label>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setChecked(!checked)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    checked ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-slate-300"
                }`}
            >
                <motion.div
                    animate={{ x: checked ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
            </motion.button>
        </motion.div>
    );
}

