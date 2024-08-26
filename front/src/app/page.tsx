import Link from "next/link";
import type { NextPage } from "next";
import BottomNavbar from "@/components/BottomNavbar";

const Home: NextPage = () => {
    const features = [
        "チームを組んで参加（最大5人）",
        "各チーム・個人のランキングはトップ10まで表示",
        "ランキングは1時間ごとに更新",
        "各月ごとに開催（開始日は1日、終了日は月末）",
        "チーム内でのチャットコミュニケーションが可能",
        "毎日コントリビュートを継続したユーザーのみ、最終日にお互いのXとGitHubアカウントが分かる",
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold text-center text-blue-600 mb-8 animate-fade-in-down">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                            GitHub Battle
                        </span>
                    </h1>

                    <div className="bg-white shadow-md rounded-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl animate-fade-in">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            ITエンジニアのためのコミュニティ
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            開発者が競争を楽しみながらスキルを向上させるプラットフォームです。
                            <br />
                            ここでは、GitHubユーザーが集まってチームを組み、チーム・個人ごとにコントリビューション数を競います！
                        </p>

                        <ul className="list-disc list-inside text-gray-600 mb-6 leading-relaxed pl-4">
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="transition-all duration-300 hover:translate-x-2 hover:text-blue-500"
                                >
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center space-x-6">
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            はじめる
                        </Link>
                    </div>
                </div>
            </div>

            <BottomNavbar />
        </>
    );
};

export default Home;
