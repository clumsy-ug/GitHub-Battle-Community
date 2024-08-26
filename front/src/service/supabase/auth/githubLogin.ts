import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const githubLogin = async (): Promise<void> => {
    const supabase = createClientComponentClient();

    try {
        const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/login`
            }
        });

        if (signInError) throw signInError;

    } catch (error) {
        console.error('GitHub login error:', error);
        throw error;
    }
}