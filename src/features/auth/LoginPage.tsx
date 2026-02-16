import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Bienvenido de nuevo');
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error('Error al iniciar sesión: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-emerald-200 shadow-lg">
                            F
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold text-slate-900">Flowbit CRM</CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        Inicia sesión para gestionar tus proyectos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="password">Contraseña</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-slate-500">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/auth/register" className="text-emerald-600 font-semibold hover:underline">
                            Regístrate gratis
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
