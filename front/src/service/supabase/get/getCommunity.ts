import { CommunityType } from "@/constants/communityType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const getCommunityAndCnt = async (offset: number): Promise<{ communities: CommunityType[], total: number }> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error, count } = await supabase
            .from('communities')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + 19)

        if (error) {
            throw error
        }

        return {
            communities: (data as CommunityType[]),
            total: count || 0
        };
    } catch (error) {
        console.error('Error fetching data:', error)
        return { communities: [], total: 0 }
    }
}

export const getCommunity = async (offset: number): Promise<CommunityType[]> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('communities')
            .select('*')
            .order('created_at', { ascending: false })  // 新しいデータから取得
            .range(offset, offset + 20)

        if (error) {
            throw error
        }

        return (data as CommunityType[]).reverse();  // このreverseを消せば配列の順序を逆にできる
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return []
    }
}
