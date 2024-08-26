import { User } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const addUser = async (user: User, xName: string | null): Promise<boolean> => {
    const supabase = createClientComponentClient();

    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                github_name: user.user_metadata.preferred_username,
                x_name: xName,
                github_id: user.user_metadata.provider_id,
            }, {
                onConflict: 'id'
            });

        if (error) throw error;

        return true;
    } catch (error) {
        console.error('Error in addUser:', error);
        return false;
    }
}
