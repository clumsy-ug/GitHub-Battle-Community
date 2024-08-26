import { UsersCommunityType } from "@/constants/usersCommunityType";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getCommunityMembers = async (communityId: string): Promise<UsersCommunityType[]> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('users_community')
            .select('*')
            .eq('community_id', communityId);

        if (error) {
            throw error
        }

        return (data as UsersCommunityType[]);
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return []
    }
}
