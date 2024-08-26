'use client';

import { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { getUserSession } from '@/service/supabase/auth/getUserSession';
import { getCommunity } from '@/service/supabase/get/getCommunity';
import { addUserCommunity } from '@/service/supabase/updates/addUserCommunity';
import { getCommunityMembers } from '@/service/supabase/get/getCommunityMembers';
import { getUserContribution } from '@/service/supabase/get/getUserContribution';
import { getCommunityContribution } from '@/service/supabase/get/getCommunityContribution';
import { getTopUserContributors } from '@/service/supabase/get/getTopUserContributors';
import { getTopCommunityContribution } from '@/service/supabase/get/getTopCommunityContribution';
import { deleteUserCommunity } from '@/service/supabase/delete/deleteUserCommunity';

export default function Test() {
    const [session, setSession] = useState<Session | null>(null);
    const initializationDone = useRef(false);

    useEffect(() => {
        //デバックモードだと２回呼ばれる対策
        if (initializationDone.current) return;
        initializationDone.current = true;
        async function initializeAuth() {
            const initialSession = await getUserSession();
            setSession(initialSession);
            //コミュニティ一覧取得
            const community = await getCommunity(0);
            console.log(community);
            //入りたいコミュニティのメンバー取得
            const communityMember = await getCommunityMembers(community[0].community_id);
            const communityContributionInfo= await getCommunityContribution("251259c2-4a74-8309-cdfd-0ee5917378e7");
            console.log(communityContributionInfo);
            const topCommunityContribution= await getTopCommunityContribution();
            console.log(topCommunityContribution);
            //メンバー上限に達していなければ参加
            if (communityMember.length < community[0].member_limits) {
                //addUserCommunity(community[0].community_id, "hello"); //引数　入るコミュニティID,　個人が特定されないニックネーム
            }



            console.log(communityMember);
        }

        initializeAuth();
    }, []);

    useEffect(() => {
        if (session) {
            const fetchUserContribution = async () => {
                const userContributionInfo = await getUserContribution(session.user.id);
                console.log(userContributionInfo);
                //const temp= await deleteUserCommunity(session.user.id);
                //console.log(temp);
            };

            fetchUserContribution();
        }
    }, [session]);

    if (session) {

        return (
            <div>
                <div>User Metadata: <pre>{JSON.stringify(session, null, 2)}</pre></div>
            </div>
        );
    } else {
        return <div>ログインしていない</div>
    }
}