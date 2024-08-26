import { Session } from "@supabase/supabase-js";
import { logout } from "@/service/supabase/auth/logout";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar: React.FC<{ session: Session | null }> = ({ session }) => {
    const router = useRouter();
    
    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        const isSucess=await logout();
        if(isSucess){
            router.push("/login");
        }
    };

    return (
        <nav className="bg-gray-200 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            href="/home"
                            className="flex-shrink-0 flex items-center"
                        >
                            <span className="text-lg font-semibold text-gray-800">
                                ホーム
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {session ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                            >
                                ログアウト
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                ログイン
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
