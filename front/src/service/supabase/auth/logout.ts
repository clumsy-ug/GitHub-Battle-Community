import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const logout = async () :Promise<boolean> => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return false;
        
    }
    else {
        alert("ログアウト完了");
        return true;
    }
}