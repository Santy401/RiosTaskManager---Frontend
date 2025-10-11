// export const useLogin = () => {
//     const [isAnimating, setIsAnimating] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsAnimating(true);
//         try {
//             const user = await login(formData.email, formData.password);
//             console.log("Login exitoso:", user);
//             navigate(user.role === "admin" ? "/dashboard-admin" : "/dashboard-user", { replace: true });
//         } catch (err) {
//             console.error("Error en login:", err);
//             setError(err.message || "Error al iniciar sesión");
//             toast.error(err.message || "Error al iniciar sesión");
//         } finally {
//             setIsAnimating(false);
//         }
//     };
// }