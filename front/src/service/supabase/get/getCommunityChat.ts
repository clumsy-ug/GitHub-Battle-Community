import { receiveChatType } from "@/constants/receiveChatType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getUsersCommunityRegistration } from "./getUsersCommunityRegistration";

export const getCommunityChat = async (communityId: string): Promise<receiveChatType[]|boolean> => {
    const supabase = createClientComponentClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        return [];
    }
    if (!session) {
        return [];
    }

    const { UsersCommunityType } = await getUsersCommunityRegistration(session.user.id);

    if (UsersCommunityType.community_id !== communityId) {
        alert('このコミュニティには所属していません');
        return true;
    }

    try {
        const { data, error } = await supabase
            .from('community_messages')
            .select('*')
            .eq('community_id', communityId)
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) {
            throw error
        }

        return (data as receiveChatType[]).reverse()
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return false;
    }
}