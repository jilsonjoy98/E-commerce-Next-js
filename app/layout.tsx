import Navbar from "@/components/Navbar/Navbar";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900 antialiased">
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}