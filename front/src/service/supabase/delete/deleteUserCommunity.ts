import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
export const deleteUserCommunity = async (userId: string): Promise<boolean> => {
    const supabase = createClientComponentClient();

    try {
        const { error } = await supabase
            .from('users_community')
            .delete()
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error deleting user community data:', error);
        return false;
    }
}