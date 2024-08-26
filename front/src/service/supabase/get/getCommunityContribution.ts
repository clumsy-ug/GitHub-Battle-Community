import { communityContributionRnakingType } from "@/constants/communityContributionRnakingType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


export const getCommunityContribution = async (communityId: string): Promise<communityContributionRnakingType | null> => {
    const supabase = createClientComponentClient();

    try {
        const { data: userData, error: userError } = await supabase
            .from('community_contribution')
            .select('*')
            .eq('community_id', communityId)
            .maybeSingle();

        if (userError) throw userError;
        if (!userData) return null;

        const { data: rankData, error: rankError } = await supabase
            .from('community_contribution')
            .select('total_contributions')
            .gte('total_contributions', userData.total_contributions);

        if (rankError) throw rankError;

        const rank = rankData.length;

        return { 
            rank: rank,
            community_id: userData.community_id,
            community_name: userData.community_name,
            total_contributions: userData.total_contributions,
            all_members_committed:userData.all_members_committed,
            created_at: userData.created_at
        }
    } catch (error) {
        console.error('Error fetching user ranking', error);
        return null;
    }
}