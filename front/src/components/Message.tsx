import { receiveChatType } from '@/constants/receiveChatType';
import React from 'react'

interface MessageProps {
    receiveChat: receiveChatType;
}

const Message = ({ receiveChat }: MessageProps) => {
    return (
<div className="">
    <div className="font-bold text-gray-800 mb-2">{receiveChat.nickname}
    </div>
    <div className="text-gray-600p-4 border-white-300 rounded-lg mb-4 max-w-sm bg-gray-100 shadow-lg p-3 break-words">
    {receiveChat.message}
    </div>
</div>
    )
}

export default Message
