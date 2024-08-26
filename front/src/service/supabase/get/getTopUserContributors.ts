import { userContributionType } from "@/constants/userContributionType";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const getTopUserContributors = async (): Promise<userContributionType[]> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('user_contribution')
            .select('*')
            .order('total_contributions', { ascending: false })
            .limit(10);

        if (error) {
            throw error
        }

        return (data as userContributionType[]);
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return []
    }
}