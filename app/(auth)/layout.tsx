import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
    children: React.ReactNode

}
const AuthLayout = async ({ children }: AuthLayoutProps) => {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) redirect('/');

    return (
        <div className="auth-layout">
            {children}
        </div>
    )
}

export default AuthLayout