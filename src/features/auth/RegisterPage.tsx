import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: displayName,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            toast.success('Cuenta creada exitosamente');
            navigate('/onboarding');
        } catch (error: any) {
            console.error(error);
            toast.error('Error al registrarse: ' + error.message);
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
                    <CardTitle className="text-2xl text-center font-bold text-slate-900">Crear cuenta</CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        Únete a Flowbit para organizar tu trabajo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="name">Nombre completo</label>
                            <Input
                                id="name"
                                placeholder="Juan Pérez"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </div>
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
                        <Button type="submit" className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-slate-500">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/auth/login" className="text-emerald-600 font-semibold hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
