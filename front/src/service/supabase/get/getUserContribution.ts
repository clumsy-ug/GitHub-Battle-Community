import { userContributionRankingType } from "@/constants/userContributionRankingType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


export const getUserContribution = async (userId: string): Promise<userContributionRankingType | null> => {
    const supabase = createClientComponentClient()

    try {
        const { data: userData, error: userError } = await supabase
            .from('user_contribution')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()
            // .single()


        if (userError) throw userError
        if (!userData) return null

        const { data: rankData, error: rankError } = await supabase
            .from('user_contribution')
            .select('total_contributions')
            .gte('total_contributions', userData.total_contributions)

        if (rankError) throw rankError

        const rank = rankData.length

        /*const { count, error: countError } = await supabase
            .from('user_contribution')
            .select('*', { count: 'exact', head: true })

        if (countError) throw countError 全ユーザー数取得*/

        return { 
            rank: rank,
            user_id: userData.user_id,
            user_name: userData.user_name,
            total_contributions: userData.total_contributions,
            yesterday_contributions: userData.yesterday_contributions,
            update_at: userData.update_at
        }
    } catch (error) {
        console.error('Error fetching user ranking', error)
        return null
    }
}