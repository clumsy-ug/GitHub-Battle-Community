import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';


export const getUserSession = async (): Promise<Session | null> => {
    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};