export interface AllocatePlayer {
    OId:        number;
    UniqueId:   string;
    GameSlots:  GameSlot[];
}

export interface GameSlot {
    GameTemplateId: number;
    AllocatedAt:    Date;
    StartedAt:      Date;
    PlayerDetail:   PlayerDetail[];
}

export interface PlayerDetail {
    Name:         string;
    MobileNumber: number;
    PlayersCount: number;
    AllocatedAt:  Date;
}
