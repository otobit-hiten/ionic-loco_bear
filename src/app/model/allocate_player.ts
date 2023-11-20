export interface AllocatePlayer {
    OId:        number;
    UniqueId:   string;
    DeviceName: string;
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
    MobileNumber: string;
    PlayersCount: number;
    AllocatedAt:  Date;
}
