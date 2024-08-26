import { receiveChatType } from "@/constants/receiveChatType";
import { supabase } from "../supabase";


export const fetchRealtimeData = (
    setReceiveChatData: React.Dispatch<React.SetStateAction<receiveChatType[]>>,
    communityId: string
) => {

    const channel = supabase
        .channel(`public:messages:community_id=eq.${communityId}}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'community_messages', filter: `community_id=eq.${communityId}` },
            payload => {
                setReceiveChatData(prevMessages => {
                    if (prevMessages.some(msg => msg.id === payload.new.id)) {
                        console.log(payload.new);
                        return prevMessages;
                    }
                    return [...prevMessages, payload.new as receiveChatType];
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
}
