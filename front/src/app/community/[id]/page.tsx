// コミュニティ詳細画面

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getOnlyCommunity } from "@/service/supabase/get/getOnlyCommunity";
import { CommunityType } from "@/constants/communityType";
import { UsersCommunityType } from "@/constants/usersCommunityType";
import Link from "next/link";
import { addUserCommunity } from "@/service/supabase/updates/addUserCommunity";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";

// 現在の日時を取得する関数
const getCurrentDate = () => new Date();

// 現在の日時と開始日を比較する関数
const isBattleStarted = (startDate: string) => {
    const currentDate = getCurrentDate();
    const battleStartDate = new Date(startDate);
    return currentDate > battleStartDate;
};

const CommunityDetailPage = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [communityInfo, setCommunityInfo] = useState<CommunityType>();
    const [community_members, setCommunityMembers] = useState<UsersCommunityType[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [memberLimits, setMemberLimits] = useState<number>(0);
    const [memberCount, setMemberCount] = useState<number>(0);

    const initializationDone = useRef(false);
    const params = useParams();
    const communityId: string = params.id as string;
    const router = useRouter();

    useEffect(() => {
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);

            const communityMembers = await getCommunityMembers(communityId);
            setCommunityMembers(communityMembers);

            const fetchCommunity = async () => {
                const onlyCommunity = await getOnlyCommunity(communityId!);
                if (onlyCommunity) {
                    setCommunityInfo(onlyCommunity);
                } else {
                    alert("属しているコミュニティの情報が取得できません");
                }
            };
            fetchCommunity();
        };

        initializeAuth();
    }, [communityId]);

    useEffect(() => {
        const initializeAuth = async () => {
            // 開始日取得
            const currentCommunity = await getOnlyCommunity(communityId);
            const start_date_row = currentCommunity?.start_date;
            const start_date = start_date_row?.toString();
            setStartDate(start_date as string);

            // メンバー上限取得
            const memberLimits = currentCommunity?.member_limits;
            setMemberLimits(memberLimits!);

            // メンバー数をstateにセット
            const memberCount = community_members.length;
            setMemberCount(memberCount);
        };
        initializeAuth();
    }, []);

    const handleJoinCommunity = async () => {
        if (nickname.length < 2) {
            alert("ニックネームは2文字以上で入力してください");
            return;
        }

        const isSucess = await addUserCommunity(
            communityId,
            nickname,
            startDate as unknown as Date
        );
        if (isSucess) {
            router.push(`/community/${communityId}/chat`);
        }
    };

    if (!session) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <p className="text-xl font-semibold text-red-600">
                        ログインしていません
                    </p>
                    <Link
                        href="/login"
                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                        ログインページへ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar session={session} />

            <div className="bg-gray-100 min-h-screen py-10 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {true ? (
                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-blue-700 mb-4">
                                『{communityInfo?.name}』
                            </h1>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                {communityInfo?.detail}
                            </p>
                            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                                {community_members.length === 0 && (
                                    <p className="text-gray-600">
                                        メンバーはいません
                                    </p>
                                )}

                                {community_members.length !== 0 && (
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                        メンバー
                                    </h2>
                                )}

                                <ul className="list-disc list-inside space-y-1">
                                    {community_members.map((member) => (
                                        <li
                                            key={member.user_id}
                                            className="text-gray-600"
                                        >
                                            {member.nickname} さん
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-gray-600">
                                    バトル開始日：
                                    <span className="font-medium">
                                        {startDate}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    メンバー数：
                                    <span className="font-medium">
                                        {memberCount}/{memberLimits}
                                    </span>
                                </p>
                            </div>

                            {/* まだ開始していないなら */}
                            {!isBattleStarted(startDate) && (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        id="nickname"
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                        placeholder="ニックネームを入力"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            )}

                            {/* もう開始しているなら */}
                            {isBattleStarted(startDate) ? (
                                <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                                    <p className="font-bold">警告</p>
                                    <p>
                                        このコミュニティはすでにバトルを開始しています。新規参加はできません。
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoinCommunity}
                                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-center transition duration-300"
                                >
                                    このコミュニティに参加
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="p-8">
                            <p className="text-xl font-semibold text-red-600">
                                このIDのコミュニティは存在しません。
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNavbar />
        </>
    );
};

export default CommunityDetailPage;
