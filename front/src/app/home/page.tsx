/*
左  :ランキングtop10
中央:自分のコミット情報
右  :コミュニティの検索・作成
*/

"use client";

import { FaPlusCircle, FaSearch } from "react-icons/fa";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { CommunityType } from "@/constants/communityType";
import { UsersCommunityType } from "@/constants/usersCommunityType";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";
import { getTopUserContributors } from "@/service/supabase/get/getTopUserContributors";
import { getUserContribution } from "@/service/supabase/get/getUserContribution"; // 追加
import { RankingItem } from "@/constants/rankingItem";
import { userContributionRankingType } from "@/constants/userContributionRankingType";

import { getOnlyCommunity } from "@/service/supabase/get/getOnlyCommunity";
// コミュニティ用のランキングを取得する関数をインポート
import { communityContributionRnakingType } from "@/constants/communityContributionRnakingType";
import { getCommunityContribution } from "@/service/supabase/get/getCommunityContribution";

import { getTopCommunityContribution } from "@/service/supabase/get/getTopCommunityContribution";

import RankingList from "@/components/Ranking";
import { RankingType } from "@/constants/rankings";
import UserRank from "@/components/RankingItem";
import { deleteUserCommunity } from "@/service/supabase/delete/deleteUserCommunity";
import { Session } from "inspector";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import BottomNavbar from "@/components/BottomNavbar";


const Ranking: React.FC = () => {
    const [view, setView] = useState<"user" | "community">("user");
    const [userId, setUserId] = useState<string>("");
    const [displayCurrentCommunityId, setDisplayCurrentCommunityId] =
        useState<string>("");
    const [community_members, setCommunityMembers] = useState<
        UsersCommunityType[]
    >([]);
    const [topContributors, setTopContributors] = useState<RankingItem[]>([]);

    const [currentCommunity, setCurrentCommunity] = useState<string>("");
    const [userRanking, setUserRanking] =
        useState<userContributionRankingType | null>(null); // 追加
    // コミュニティに関する部分
    const [communityInfo, setCommunityInfo] = useState<CommunityType | null>();
    const [topCommunityContribution, setTopCommunityContribution] = useState<
        communityContributionRnakingType[]
    >([]);
    const [userCommunityRanking, setUserCommunityRanking] =
        useState<communityContributionRnakingType | null>(null);

    const [userIdRanking,setUserIdRanking]=useState<string>('');

    useEffect(() => {
        const initializeData = async () => {
            const session = await getUserSession();
            if (session?.user) {
                const userReg = await getUsersCommunityRegistration(
                    session.user.id
                );
                // console.log(userReg);
                setCurrentCommunity(
                    userReg.UsersCommunityType.nickname || "所属していません"
                );

                setUserIdRanking(session.user.id);

                // ユーザーのランキングを取得する
                const userRank = await getUserContribution(session.user.id);
                setUserRanking(userRank);
                // ユーザーIDをセットするとセッターかと思わせてニックネームをセットしている
                setUserId(userReg.UsersCommunityType.nickname || "Unknown");

                setDisplayCurrentCommunityId(
                    userReg.UsersCommunityType.community_id || ""
                );

                const communityMembers = await getCommunityMembers(
                    userReg.UsersCommunityType.community_id || ""
                );
                setCommunityMembers(communityMembers);

                const onlyCommunity = await getOnlyCommunity(
                    userReg.UsersCommunityType.community_id!
                );
                if (onlyCommunity) {
                    setCommunityInfo(onlyCommunity);
                } else {
                    console.log("属しているコミュニティの情報が取得できません");
                }

                const topContributors = await getTopUserContributors();
                setTopContributors(
                    topContributors.map((c) => ({
                        id: c.user_id,
                        name: c.user_name,
                        commits: parseInt(c.total_contributions, 10),
                    }))
                );

                const topCommunityContribute =
                    await getTopCommunityContribution();
                console.log(topCommunityContribute);
                setTopCommunityContribution(topCommunityContribute);
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        const fetchCommunityContribution = async () => {
            if (displayCurrentCommunityId) {
                console.log(displayCurrentCommunityId);
                const newCommunityRanking = await getCommunityContribution(
                    displayCurrentCommunityId
                );
                console.log(newCommunityRanking);
                setUserCommunityRanking(newCommunityRanking);
            }
        };
        fetchCommunityContribution();
    }, [displayCurrentCommunityId]);

    const ContributersRanking = topContributors.map((ranking) => {
        return {
            id: ranking.id,
            name: ranking.name,
            contribution: ranking.commits,
            rank: ranking.rank,
        };
    });

    // コミュニティランキングのデータを作成
    const CommunityRanking = topCommunityContribution.map((ranking) => {
        return {
            id: ranking.community_id,
            name: ranking.community_name,
            contribution: ranking.total_contributions,
            rank: ranking.rank,
        };
    });
    const allUserRank: RankingType[] = ContributersRanking as RankingType[];
    const allCommunityRank: RankingType[] = CommunityRanking as RankingType[];

    const handleCommunityDropOut = async () => {
        const supabase = createClientComponentClient();
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();
        if (session) {
            const isSucess = await deleteUserCommunity(session.user.id);
            if (isSucess) {
                setCommunityInfo(null);
                setCommunityMembers([]);
                setUserCommunityRanking(null);
                alert("コミュニティを脱退しました");
            }
        }
    };

    return (
        <>
        <div className="md:flex-col">
            <div className="flex flex-col md:flex-row h-screen bg-gray-100">
                {/* 左側: ランキング */}
                {/* ユーザーとコミュニティの問題 */}
                <div className="w-full md:w-1/3 p-6 bg-white shadow-lg">
                    <div className="flex space-x-4 mb-6">
                        {["user", "community"].map((v) => (
                            <button
                                key={v}
                                onClick={() =>
                                    setView(v as "user" | "community")
                                }
                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                    view === v
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300"
                                } hover:bg-blue-700 hover:text-white transition duration-200`}
                            >
                                {v === "user" ? "ユーザー" : "コミュニティ"}
                            </button>
                        ))}
                    </div>

                    <h1 className="mb-4 text-2xl font-bold text-gray-800">
                        {view === "user"
                            ? "月間コントリビュートランキング"
                            : "コミュニティランキング"}
                    </h1>

                    <ol className="space-y-2">
                        {view === "user" ? (
                            <RankingList
                                rankings={allUserRank}
                                userId={userIdRanking}
                            />
                        ) : (
                            <RankingList
                                rankings={allCommunityRank}
                                userId={displayCurrentCommunityId}
                            />
                        )}
                        {/* 自分が何位かを取得する もし自分の順位が決まっていなかったら登録されていませんになる */}
                        {view === "user" ? (
                            <UserRank
                                name={
                                    userRanking?.user_name ||
                                    "登録されていません"
                                }
                                contribution={
                                    userRanking?.total_contributions || 0
                                }
                                rank={userRanking?.rank||0}
                                identify={true}
                            />
                        ) : (
                            <UserRank
                                name={
                                    userCommunityRanking?.community_name ||
                                    "コミュニティ活動が開始されていません"
                                }
                                contribution={
                                    userCommunityRanking?.total_contributions ||
                                    0
                                }
                                rank={userCommunityRanking?.rank||0}
                                identify={true}
                            />
                        )}
                    </ol>
                </div>

                {/* 中央: 自分のコミット情報 */}
                <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center bg-white shadow-lg">
                    <div className="text-center mb-8">
                        <p className="text-gray-600">
                            あなたの月間コントリビューション数
                        </p>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {userRanking?.total_contributions || 0}
                        </h2>
                    </div>

                    <div className="w-full bg-gray-100 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            所属コミュニティ: {communityInfo?.name}
                        </h2>

                        {
                           userCommunityRanking ? (
                            // コミュニティが連続記録を更新している場合
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                                {/* 更新している場合 */}
                                <p className="font-bold">
                                    このコミュニティは連続でコミットをしています！継続していきましょう！
                                </p>
                            </div>
                        ) : (
                            // コミュニティが連続記録を更新していない場合
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                {/* 更新していない場合 */}
                                <p className="font-bold">
                                    このコミュニティは連続でコミットをしていません。VSCodeを開いてコミットしましょう！
                                </p>
                            </div>
                        )

                        }

                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            メンバー
                        </h3>
                        {community_members.length === 0 ? (
                            <p className="text-gray-600">メンバーはいません</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-1">
                                {community_members.map((member) => (
                                    <li
                                        key={member.user_id || ""}
                                        className="text-gray-600"
                                    >
                                        {member.nickname || "Unknown"} さん
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Link
                        href={`community/${displayCurrentCommunityId}/chat`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        コミュニティのチャットへ
                    </Link>
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleCommunityDropOut}
                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                            コミュニティ脱退
                        </button>
                    </div>
                </div>

                {/* 右側: 操作ボタン */}
                <div className="w-full md:w-1/3 p-6 bg-white shadow-lg rounded-lg flex flex-col justify-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        アクション
                    </h2>

                    <div className="flex-col">
                    <Link
                        href="/community-create"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <FaPlusCircle className="text-xl" />
                        <span className="font-medium">コミュニティを作成</span>
                    </Link>

                    <Link
                        href="/communities"
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <FaSearch className="text-xl" />
                        <span className="font-medium">コミュニティを探す</span>
                    </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-2">
                            新しい仲間を見つけよう！
                        </p>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                
            </div>
            <BottomNavbar />
        </div>
        </>
    );
};

export default Ranking;
