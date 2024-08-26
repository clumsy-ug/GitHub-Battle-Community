import { UsersCommunityType } from "@/constants/usersCommunityType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
export const getUsersCommunityRegistration = async (userId: string): Promise<{ UsersCommunityType: UsersCommunityType }> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('users_community')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) {
            if (error.code === 'PGRST116') {
                return {
                    UsersCommunityType: {
                        user_id: null,
                        community_id: null,
                        start_date: null,
                        created_at: null,
                        nickname: null
                    }
                }
            }
            throw error
        }
        if (data === null) {
            return {
                UsersCommunityType: {
                    user_id: null,
                    community_id: null,
                    start_date: null,
                    created_at: null,
                    nickname: null
                }
            }
        }

        // ユーザーが所属するコミュニティが見つかった場合
        return {
            UsersCommunityType: data as UsersCommunityType,

        }
    } catch (error) {
        console.error('予期しないエラー:', error)
        return {
            UsersCommunityType: {
                user_id: null,
                community_id: null,
                start_date: null,
                created_at: null,
                nickname: null
            }
        }
    }
}
