import { useState } from 'react';
import { ArrowRight, Lock, Mail, User, Building, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    // Company name is not in backend yet, ignoring or handling if extended
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                console.log('Signup successful', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // FORCE REDIRECT to verify if useNavigate is the issue
                console.log('Navigating to dashboard...');
                window.location.href = '/painel/overview';
                // navigate('/painel/overview'); 
            } else {
                console.error('Signup error', data);
                alert(data.error || 'Erro ao criar conta');
            }
        } catch (error) {
            console.error("Signup failed", error);
            alert('Erro de conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#050314] z-0" />
                <div className="absolute w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full top-0 right-0 pointer-events-none" />

                <div className="relative z-10 w-full max-w-lg p-6 my-10">
                    <div className="bg-[#131022]/80 backdrop-blur-xl border border-[#292348] rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Crie sua Agência IA</h1>
                            <p className="text-gray-400">Comece a escalar sua produção de conteúdo hoje.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        className="w-full bg-[#0B0915] border border-[#292348] text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Seu nome"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Empresa</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        className="w-full bg-[#0B0915] border border-[#292348] text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Nome do seu negócio"
                                        required
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Corporativo</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        className="w-full bg-[#0B0915] border border-[#292348] text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="voce@empresa.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="password"
                                        className="w-full bg-[#0B0915] border border-[#292348] text-white rounded-lg pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Criar Conta Grátis
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Já tem uma conta?{' '}
                            <a href="/login" className="text-primary hover:text-white transition-colors">
                                Fazer Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
