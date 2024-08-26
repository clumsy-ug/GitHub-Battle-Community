import Link from "next/link";


const BottomNavbar = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className=" bg-white shadow-inner py-4 w-full">
            <div className="px-4">
                <div className="flex flex-col items-center space-y-2">
                    <Link
                        href="/privacy-policy"
                        className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    >
                        プライバシーポリシー
                    </Link>
                    <span className="text-sm text-gray-600">© {currentYear} GitHub-Battle-Community</span>
                </div>
            </div>
        </div>
    );
};
export default BottomNavbar;
