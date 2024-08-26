import {RankingType} from '@/constants/rankings';
import {userContributionType} from '@/constants/userContributionType';
import RankingItem from "@/components/RankingItem"



export default function RankingList(props:{rankings:RankingType[],userId:string}) {


    const isMe =(id:String,userId:String)=>{
        if(id===userId){
            return true
        }else{
            return false
        }
    }
    return (
        <>
        <ol>
            {props.rankings.map((ranking,index) => (
                    <RankingItem
                    name={ranking.name}
                    contribution={ranking.contribution}
                    // rank={ranking.rank}
                    rank={index+1}
                    identify={isMe(ranking.id,props.userId)}
                    key={ranking.id}
                    />
            ))}
        </ol>
        </>
    )


}



