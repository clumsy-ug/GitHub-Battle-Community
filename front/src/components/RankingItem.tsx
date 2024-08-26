import {RankingType} from '@/constants/rankings';
import Image from 'next/image';

type RankingItemProps = {
    name: string;
    contribution: number;
    rank: number;
    identify: boolean;
};

const RankingItems: React.FC<RankingItemProps> = ({ name, contribution, rank, identify }) => {

    if(identify){
        return (
            <>

                {rank!=0 && rank<=10?
                <li
                key ={rank}
                className='flex justify-between items-center p-3 rounded-lg bg-blue-100 text-blue-800'
                >
                     <Image src={`/rankingicon/icon-rank-tk02_m0${rank}.png`} width={30} height={30} alt="Rank" />
                    <span className="font-semibold">{`${name}`}</span>
                    <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
                </li>
                :
                <li
                key ={rank}
                className='flex justify-between items-center p-3 rounded-lg bg-blue-100 text-blue-800'
                >
                    <span className="font-semibold text-center">{` ${rank}`}</span>
                    <span className="font-semibold">{` ${name}`}</span>
                    <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
                </li>
                }
            </>
        )
    }else{
        return (
            <>
            {
                rank!=0 && rank<=10?
                <li
                key ={rank}
                className='flex justify-between items-center p-3 rounded-lg '
                >
                    <Image src={`/rankingicon/icon-rank-tk02_m0${rank}.png`} width={30} height={30} alt="Rank" />
                    <span className="font-semibold">{`${name}`}</span>
                    <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
                </li>
                :
                <li
                key ={rank}
                className='flex justify-between items-center p-3 rounded-lg '
                >
                    <span className="font-semibold">{` ${rank}.`}</span>
                    <span className="font-semibold">{` ${name}`}</span>
                    <span className="text-sm text-gray-600">{contribution}コントリビュート</span>
                </li>
            }
            
        </>
    )
}

}

export default RankingItems;