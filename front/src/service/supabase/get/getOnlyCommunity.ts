import { CommunityType } from "@/constants/communityType";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export const getOnlyCommunity = async (communityId: string): Promise<CommunityType | null> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('communities')
            .select('*')
            .eq('community_id', communityId)
            .maybeSingle()

        if (error) {
            throw error
        }

        if (data) {
            return data as CommunityType
        } else {
            console.log(`No community found ID: ${communityId}`)
            return null
        }
    } catch (error) {
        console.error('Error fetching community data:', error)
        return null
    }
}