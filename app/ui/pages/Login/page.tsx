"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Checkbox } from "@/app/ui/components/StyledComponents/checkbox"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, Github, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            console.log('Attempting login for:', email)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })

            console.log('Login response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al iniciar sesión')
            }

            const data = await response.json()
            console.log('Login successful:', data)

            // Check if cookie was set
            console.log('Document cookies after login:', document.cookie)

            // Small delay to ensure cookie is set before redirect
            await new Promise(resolve => setTimeout(resolve, 200))

            // Redirect after successful login
            const redirectPath = data.user.role === 'admin' ? '/ui/pages/Dashboard/Admin' : '/ui/pages/Dashboard/User'
            console.log('Redirecting to:', redirectPath)

            window.location.href = redirectPath

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
            setError(errorMessage)
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="w-full max-w-md relative">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center">
                        <span className="text-2xl font-bold text-white"> <Image
                            src="/favicon.ico"
                            alt="Logo RiosBackend"
                            width={150}
                            height={150}
                            className="transition-all scale-170 duration-300 hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                        /></span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h1>
                    <p className="text-muted-foreground">Inicia sesión en tu cuenta para continuar</p>
                </div>

                {/* Login Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-secondary/50 border-border h-11 text-white"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-secondary/50 border-border h-11 text-white"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                                    Recordarme
                                </Label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
                                onClick={(e) => isLoading && e.preventDefault()}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    Al iniciar sesión, aceptas nuestros{" "}
                    <Link
                        href="/terms"
                        className="hover:text-foreground transition-colors"
                        onClick={(e) => isLoading && e.preventDefault()}
                    >
                        Términos de Servicio
                    </Link>{" "}
                    y{" "}
                    <Link
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                        onClick={(e) => isLoading && e.preventDefault()}
                    >
                        Política de Privacidad
                    </Link>
                </p>
            </div>
        </div>
    )
}