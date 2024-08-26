"use client";

import Message from "@/components/Message";
import { receiveChatType } from "@/constants/receiveChatType";
import { getCommunityChat } from "@/service/supabase/get/getCommunityChat";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getUser } from "@/service/supabase/get/getUser";
import { CommunityType } from "@/constants/communityType";
import { Session } from "@supabase/supabase-js";
import { fetchRealtimeData } from "@/service/supabase/realtime/fetchRealtime";
import { addMessageDB } from "@/service/supabase/updates/addCommunityMessage";
import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { getOnlyCommunity } from "@/service/supabase/get/getOnlyCommunity";
// コミュニティ用のランキングを取得する関数をインポート
import { communityContributionRnakingType } from "@/constants/communityContributionRnakingType";
import { getCommunityContribution } from "@/service/supabase/get/getCommunityContribution";
import RankingItem from "@/components/RankingItem";
import BottomNavbar from "@/components/BottomNavbar";

const CommunityChat = ({ params }: { params: { id: string } }) => {
    const [chatMs, setChatMs] = useState<string>("");
    const [receiveChatData, setReceiveChatData] = useState<receiveChatType[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [nickname, setNickname] = useState<string>("匿名");
    const [githubNames, setGithubNames] = useState<string[]>([]);
    const [xNames, setXNames] = useState<string[]>([]);

    const [communityInfo, setCommunityInfo] = useState<CommunityType>();
    const [communityDetail, setCommunityDetail] = useState<string>("");

    const [communityRanking, setCommunityRanking] =
        useState<communityContributionRnakingType | null>();
        const [userCommunityStartDate, setUserCommunityStartDate] = useState<Date | null>(null);
        const [isMonthEnd, setIsMonthEnd] = useState(false);

    const scrollToTop = () => {
        messagesEndRef.current?.parentElement?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessages = useCallback((newReceiveChat: receiveChatType) => {
        setReceiveChatData((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === newReceiveChat.id)) {
                return prevMessages;
            }
            return [...prevMessages, newReceiveChat];
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const cleanupFunction = fetchRealtimeData(
            setReceiveChatData,
            params.id
        );

        const fetchInitialMessages = async () => {
            try {
                const initialMessages: receiveChatType[] | boolean =
                    await getCommunityChat(params.id);

                if (initialMessages == true) {
                    router.push("/home");
                }
                if (typeof initialMessages !== "boolean") {
                    if (isMounted) {
                        setReceiveChatData(
                            initialMessages as receiveChatType[]
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching initial messages:", error);
            }
        };
        fetchInitialMessages();

        return () => {
            isMounted = false;
            cleanupFunction();
        };
    }, [params.id]);

    useEffect(() => {
        const fetchCommunity = async () => {
            const onlyCommunity = await getOnlyCommunity(params.id!);
            if (onlyCommunity) {
                setCommunityInfo(onlyCommunity);
            } else {
                alert("属しているコミュニティの情報が取得できません");
            }
        };
        fetchCommunity();
    }, [params.id]);

    const checkLastDayOfMonth = (date: Date): boolean => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getMonth() !== date.getMonth();
    };
    useEffect(() => {
        const fetchNickname = async () => {
            if (session) {
                const userCommunityInfo = await getUsersCommunityRegistration(
                    session.user.id
                );
                setNickname(userCommunityInfo.UsersCommunityType.nickname!);
                
                if (userCommunityInfo.UsersCommunityType.start_date) {
                    const startDate = new Date(userCommunityInfo.UsersCommunityType.start_date);
                    setUserCommunityStartDate(startDate);
                }
                const now = new Date();

                const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
                const isLastDayOfMonth = checkLastDayOfMonth(japanTime);
                setIsMonthEnd(isLastDayOfMonth);
            }
        };

        fetchNickname();
    }, [session]);

    useEffect(() => {
        scrollToBottom();
    }, [receiveChatData]);

    useEffect(() => {
        inputRef.current?.focus();

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);

            const CommunityRank = await getCommunityContribution(params.id);
            setCommunityRanking(CommunityRank);

            if (!initialSession) {
                router.push("/login");
            }

            // メンバー全員のgithub_nameを取得
            const members = await getCommunityMembers(params.id);
            const memberIds = members.map((member) => member.user_id);
            const memberGithubNamesPromises = memberIds.map(
                async (memberId) => {
                    const member = await getUser(memberId as string);
                    if (member.github_name) {
                        return member.github_name;
                    } else {
                        return "github_nameが未登録です";
                    }
                }
            );

            // Promise.all() を使用して全てのPromiseが解決されるのを待つ
            // これでmemberGithubNamesは解決された値の配列になるので、Promiseではなく値そのものを取得できる
            const memberGithubNames = await Promise.all(
                memberGithubNamesPromises
            );
            setGithubNames(memberGithubNames);

            // 同様にメンバー全員のx_nameを取得
            const memberXNamesPromises = memberIds.map(async (memberId) => {
                const member = await getUser(memberId as string);
                if (member.x_name) {
                    return member.x_name;
                } else {
                    return "x_nameが未登録です";
                }
            });
            const memberXNames = await Promise.all(memberXNamesPromises);
            setXNames(memberXNames);

            // コミュニティの詳細を取得
            const community = await getOnlyCommunity(params.id);
            setCommunityDetail(community?.detail as string);
        };

        initializeAuth();
    }, []);

    const handleSendMessage = async () => {
        if (chatMs.length > 500) {
            alert("メッセージは500文字以内で入力してください");
            return;
        }

        if (chatMs.trim()) {
            try {
                if (session) {
                    const newReceiveChat = await addMessageDB(
                        chatMs,
                        params.id,
                        nickname
                    );
                    updateMessages(newReceiveChat);
                }

                setChatMs("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {isMonthEnd ? (
            // {thirtyDaysLater >= userCommunityStartDate ? (  これがテスト用
                <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                        メンバーの皆様のアカウントが共有されます🥳<br />
                        メッセージを送って繋がりましょう！
                    </h1>

                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        GitHubユーザー名
                    </h2>
                    <ol className="list-decimal list-inside mb-6 space-y-2">
                        {githubNames.map((name, index) => (
                            <li
                                key={index}
                                className="text-gray-700 bg-gray-100 p-2 rounded"
                            >
                                {name}
                            </li>
                        ))}
                    </ol>

                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Xユーザー名
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        {xNames.map((name, index) => (
                            <li
                                key={index}
                                className="text-gray-700 bg-gray-100 p-2 rounded"
                            >
                                {name}
                            </li>
                        ))}
                    </ol>
                </div>
            ) : null}

            <Navbar session={session} />

            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-center text-2xl md:text-3xl font-extrabold mb-8 mt-4 text-gray-800 tracking-tight leading-tight">
                    『{communityInfo?.name}』
                </h1>

                <p className="text-center text-sm md:text-base text-gray-600 mb-8 px-4 leading-relaxed">
                    {communityDetail}
                </p>
                
                <div>
                    {communityRanking && (
                        <div className="community-ranking-container">
                            <h2>コミュニティランキング</h2>
                            <RankingItem
                                name={communityRanking.community_name}
                                contribution={communityRanking.total_contributions}
                                rank={communityRanking.rank}
                                identify={true}
                            />
                        </div>
                    )}
                </div>

                <div
                    className="text-center text-gray-500 my-4 cursor-pointer hover:text-blue-500"
                    onClick={scrollToTop}
                >
                    ↑古いチャットへ
                </div>

                <div className="h-96 overflow-y-auto mb-4 bg-gray-100 p-4 rounded-lg">
                    {receiveChatData.map((ms, index) => (
                        <Message receiveChat={ms} key={ms.id || index} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div
                    className="text-center text-gray-500 my-4 cursor-pointer hover:text-blue-500"
                    onClick={scrollToBottom}
                >
                    ↓新しいチャットへ
                </div>

                <div className="flex">
                    <input
                        type="text"
                        value={chatMs}
                        onChange={(e) => setChatMs(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="メッセージを入力..."
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={inputRef}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        送信
                    </button>
                </div>
            </div>

            <BottomNavbar />
        </>
    );
};

export default CommunityChat;
