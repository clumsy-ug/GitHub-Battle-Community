import Link from "next/link";
import BottomNavbar from "@/components/BottomNavbar";
const PrivacyPolicyPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-gray-200 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link
                                href="/"
                                className="flex-shrink-0 flex items-center"
                            >
                                <span className="text-lg font-semibold text-gray-800">
                                    トップ
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 m-4 overflow-auto max-h-[calc(100vh-8rem)]">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">プライバシーポリシー</h1>
                    <p className="text-gray-700 mb-6">
                        当アプリケーションでは、GitHub Authを使用して、ユーザーのGitHub ID、ユーザー名、およびメールアドレスを取得します。これらの情報は以下の目的で使用されます。
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">GitHub IDおよびメールアドレス:</h2>
                        <p className="text-gray-700 mt-2">
                            認証のために使用します。これにより、安全かつ個別のユーザーアクセスを提供します。また、メールアドレスは、アプリに関する重要なお知らせをユーザーにお送りするためにも使用します。
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">ユーザー名:</h2>
                        <p className="text-gray-700 mt-2">
                            GitHub APIを使用して、ユーザーのコントリビューション数を取得するために使用します。この情報は、アプリケーションの機能向上や利用者の利便性向上のために活用されます。
                        </p>
                    </div>

                    <p className="text-gray-700 mb-4">
                        当アプリケーションでは、取得した個人情報を上記の目的以外で使用することはありません。また、法令に基づく場合を除き、第三者に提供することもありません。
                    </p>

                    <p className="text-gray-700">
                        プライバシーポリシーは予告なしに変更される場合があります。最新のプライバシーポリシーは、当ページにて随時ご確認いただけます。
                    </p>
                </div>
            </div>

            <BottomNavbar />
        </div>
    );
};

export default PrivacyPolicyPage;
