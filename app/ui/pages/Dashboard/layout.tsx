'use client';
import homepage from '@/app/ui/pages/Dashboard/Admin/page'
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return(
        <div className="flex h-screen bg-[#0A0A0A]">
            {children}
        </div>
    )
}