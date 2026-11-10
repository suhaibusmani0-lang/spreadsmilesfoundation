import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please enter both username/email and password!");
            return;
        }

        setLoading(true);

        const cleanInput = email.toLowerCase().trim();
        const isMasterAdmin = (cleanInput === 'admin' || cleanInput === 'admin@spreadsmiles.org') && (password === 'Spread786@@' || password === 'admin123');

        if (isMasterAdmin) {
            localStorage.setItem('admin_token', 'master_admin_session');
            localStorage.setItem('admin_user', JSON.stringify({ email: 'Admin', role: 'superadmin' }));
            toast.success("Login Successful!");
            navigate('/admin');
            setLoading(false);
            return;
        }

        try {
            // Supabase backend se login check kar rahe hain
            const formattedEmail = email.includes('@') ? email : `${email}@spreadsmiles.org`;
            const { error } = await supabase.auth.signInWithPassword({
                email: formattedEmail,
                password: password,
            });

            if (error) throw error;

            toast.success("Login Successful!");
            navigate('/admin'); // Login hote hi dashboard par bhej dega

        } catch (error) {
            console.error("Login Error:", error.message);
            toast.error("Invalid Username or Password!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Lock className="w-8 h-8 text-[#2081e2]" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Panel</h1>
                <p className="text-center text-gray-500 mb-8">Login to manage your NGO website</p>

                {/* Form mein onSubmit laga hai */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username / Email</label>
                        <input 
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username or Email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2081e2] bg-gray-50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2081e2] bg-gray-50 text-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#2081e2] text-white font-bold py-3 rounded-lg hover:bg-blue-600 flex justify-center items-center gap-2 text-sm"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
