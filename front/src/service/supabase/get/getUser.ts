import { UserType } from "@/constants/UserType";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const getUser = async (userId: string): Promise<UserType> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();  // 1つの行のみを返す

        if (error) {
            throw error
        }

        return (data as UserType);
    } catch (error) {
        console.error('Error fetching initial data:', error)
        
        return {
            id: null,
            github_name: null,
            updated_at: null,
            x_name: null,
            github_id: null,
        }
    }
}