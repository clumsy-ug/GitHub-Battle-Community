import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const login = async (email: string, password: string) => {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        throw new Error(error.message);
    }
    alert("ログイン成功");
    //window.location.href = '/signin'; home画面に遷移させたい
    console.log(data);
}