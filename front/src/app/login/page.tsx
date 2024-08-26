"use client";

import { useEffect, useState } from "react";
import { githubLogin } from "@/service/supabase/auth/githubLogin";
import { logout } from "@/service/supabase/auth/logout";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addUser } from "@/service/supabase/updates/addUser";
import BottomNavbar from "@/components/BottomNavbar";

const LoginPage: React.FC = () => {
    const [xName, setXName] = useState<string>("");
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();
            if (session && !error) {
                const storedXName = localStorage.getItem("xName");
                const isSuccess = await addUser(session.user, storedXName);
                if (isSuccess) {
                    localStorage.removeItem("xName");
                    router.push("/home");
                } else {
                    console.error("Failed to add user");
                }
            }
        };

        checkSession();
    }, []);

    const handleGithubLogin = async () => {
        localStorage.setItem("xName", xName);
        await githubLogin();
    };

    const handleLogout = async () => {
        const isSucess = await logout();
        if (isSucess) {
            router.push("/login");
        } else {
            alert("ログアウトに失敗しました");
        }
    }


    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        ログインページ
                    </h1>
                    <input
                        type="text"
                        value={xName}
                        onChange={(e) => setXName(e.target.value)}
                        placeholder="Xユーザー名（任意）"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleGithubLogin}
                        className="w-full px-4 py-2 mb-4 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        GitHubでログイン
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        ログアウトテスト
                    </button>
                </div>
            </div>
            
            <BottomNavbar />
        </>
    );
};

export default LoginPage;
