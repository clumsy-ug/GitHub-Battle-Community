export interface CommunityType {
    community_id: string;
    owner_id: string;
    name: string;
    detail: string | null;
    start_date: Date;
    created_at: string;
    member_limits: number;
}