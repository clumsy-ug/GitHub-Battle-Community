import { supabase } from "@/service/supabase/supabase";

export const signUpAddUser = async (uid: string, name: string) => {
    const { error } = await supabase
        .from('user')
        .insert({ id: uid, name: name });

    if (error) {
        console.log(error);
        return { error };
    }

    return { success: true };
}