import { receiveChatType } from '@/constants/receiveChatType';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export const addMessageDB = async (message: string, communityId: string,nickname:string): Promise<receiveChatType> => {
    const supabase = createClientComponentClient();

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            throw sessionError;
        }
        if (!session) {
            throw new Error('ログイン状態ではない');
        }

        const { data, error } = await supabase
            .from('community_messages')
            .insert({
                community_id: communityId,
                message: message,
                nickname: nickname,
                user_id: session.user.id
            })
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('メッセージの追加に失敗しました');

        return data as receiveChatType;
    } catch (error) {
        console.error('メッセージ追加エラー:', error);
        throw error;
    }
}