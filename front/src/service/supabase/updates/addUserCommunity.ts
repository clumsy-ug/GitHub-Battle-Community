import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const addUserCommunity = async (community_id: string, nickname: string,startDate:Date): Promise<boolean> => {
    const supabase = createClientComponentClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        return false;
    }
    if (!session) {
        return false;
    }
    try {

        const { error } = await supabase
            .from('users_community')
            .upsert({
                user_id: session.user.id,
                community_id: community_id,
                start_date: startDate,
                nickname: nickname
            });

        if (error) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in addUser:', error);
        return false;
    }
}
