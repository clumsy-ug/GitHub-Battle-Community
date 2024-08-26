import { communityContributionType } from "@/constants/communityContributionType";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const getTopCommunityContribution = async (): Promise<communityContributionType[]> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('community_contribution')
            .select('*')
            .order('total_contributions', { ascending: false })
            .limit(10);

        if (error) {
            throw error
        }

        return (data as communityContributionType[]);
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return []
    }
}