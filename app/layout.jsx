import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
    weight: ["400", "600", "700", "800", "900"],
});
const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
export const metadata = {
    title: "Buddy — English Learning Chatbot for Kids",
    description: "An AI-powered English learning chatbot designed for children under 7. Learn letters, colors, numbers, and more with your friendly learning buddy!",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="antialiased selection:bg-primary-light/30">{children}</body>
    </html>);
}
