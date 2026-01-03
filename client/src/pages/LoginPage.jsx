import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useEffect } from 'react';

import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';

export default function LoginPage() {

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/dashboard');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSIgnIn = async () => {
        try {

            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const idToken = await user.getIdToken();

            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            });

            if(response.ok) {
                navigate('/dashboard');
            } else {
                console.error("Backend verification failed");
            }
            
        } catch (error) {
            console.error("Google sign-in failed", error);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-blue-500/10 text-blue-400 mb-4">
                        <Lock className="size-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome </h2>
                    <p className="text-zinc-400 text-sm">Sign in to access your LegalLens console</p>
                </div>

                <div className="space-y-4">
                        <button onClick={handleSIgnIn} className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 font-medium py-3 rounded-xl hover:bg-zinc-100 transition-colors">
                            <svg className="size-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                        <Lock className="size-3" />
                        <span>Secure enterprise-grade access</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
