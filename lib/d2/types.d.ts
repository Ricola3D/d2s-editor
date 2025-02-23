export type Index = number | string | symbol;
export type ReversibleDictionary<TKey extends Index, TValue extends Index> = {
    [key in TKey]: TValue;
};
export type IntegerBoolean = 0 | 1;
export interface IConfig {
    extendedStash?: boolean;
    sortProperties?: boolean;
}
export declare enum EGemSocketType {
    WeaponGloves = 0,// 0
    ArmorBootsHelmBelt = 1,// 1
    ShieldJewelry = 2
}
export interface IMagicPropertyDef {
    id: number;
    s?: string;
    c?: IntegerBoolean;
    cB?: number;
    cS?: IntegerBoolean;
    cVS?: number;
    sB: number;
    sA?: number;
    sP?: number;
    e?: number;
    np?: number;
    so: number;
    dF: number;
    dP: string;
    dN?: string;
    dV?: number;
    d2?: string;
    dg?: number;
    dgF?: number;
    dgP?: string;
    dgN?: string;
    dgV?: number;
    dg2?: string;
    dR?: string;
    dE?: string;
    o?: number;
    os?: string[];
    op?: number;
    ob?: number;
}
export interface ICommonItemTypeDef {
    nc?: string;
    exc?: string;
    elc?: string;
    iq: EItemQuality;
    n?: string;
    hi?: IntegerBoolean;
    gs?: number;
    gt: EGemSocketType;
    i: string;
    ui?: string;
    si?: string;
    iw: number;
    ih: number;
    it: number;
    ig: string[];
    eq1n?: string;
    eq2n?: string;
    c: string[];
    hdi?: string;
    hdig?: string[];
}
export interface IWeaponTypeDef extends ICommonItemTypeDef {
    durability?: number;
    mind?: number;
    maxd?: number;
    min2d?: number;
    max2d?: number;
    rs?: number;
    rd?: number;
}
export interface IArmorTypeDef extends ICommonItemTypeDef {
    durability?: number;
    minac?: number;
    maxac?: number;
    rs?: number;
}
export interface IMiscTypeDef extends ICommonItemTypeDef {
    m?: GemMods;
}
export interface IConstantData {
    classes: any[];
    skills: any[];
    magic_prefixes: any[];
    magic_suffixes: any[];
    rare_names: any[];
    armor_items: {
        [key: string]: IArmorTypeDef;
    };
    weapon_items: {
        [key: string]: IWeaponTypeDef;
    };
    other_items: {
        [key: string]: IMiscTypeDef;
    };
    stackables: any;
    properties: any;
    magical_properties: IMagicPropertyDef[];
    runewords: any[];
    runeword_fixes?: {
        [key: number]: number;
    };
    set_items: any[];
    unq_items: any[];
    gold?: {
        perCharLevel: number;
        bank: number;
    };
}
export interface ID2S {
    header: IHeader;
    attributes: IAttributes;
    unk_after_attr: Uint8Array;
    item_bonuses: IMagicProperty[];
    displayed_item_bonuses: IMagicProperty[];
    skills: ISkill[];
    items: IItem[];
    corpse_unk004: Uint8Array;
    corpse_items: IItem[];
    merc_items: IItem[];
    golem_item: IItem;
    is_dead: number;
}
export interface IAttributes {
    [key: string]: number;
}
export interface IMenuAppearance {
    graphic: number;
    tint: number;
}
export interface ICharMenuAppearance {
    head: IMenuAppearance;
    torso: IMenuAppearance;
    legs: IMenuAppearance;
    right_arm: IMenuAppearance;
    left_arm: IMenuAppearance;
    right_hand: IMenuAppearance;
    left_hand: IMenuAppearance;
    shield: IMenuAppearance;
    special1: IMenuAppearance;
    special2: IMenuAppearance;
    special3: IMenuAppearance;
    special4: IMenuAppearance;
    special5: IMenuAppearance;
    special6: IMenuAppearance;
    special7: IMenuAppearance;
    special8: IMenuAppearance;
}
export interface IDifficulty {
    Normal: number;
    Nightmare: number;
    Hell: number;
}
export interface INPC {
    intro: boolean;
    congrats: boolean;
}
export interface INPCS {
    warriv_act_ii: INPC;
    charsi: INPC;
    warriv_act_i: INPC;
    kashya: INPC;
    akara: INPC;
    gheed: INPC;
    greiz: INPC;
    jerhyn: INPC;
    meshif_act_ii: INPC;
    geglash: INPC;
    lysnader: INPC;
    fara: INPC;
    drogan: INPC;
    alkor: INPC;
    hratli: INPC;
    ashera: INPC;
    cain_act_iii: INPC;
    elzix: INPC;
    malah: INPC;
    anya: INPC;
    natalya: INPC;
    meshif_act_iii: INPC;
    ormus: INPC;
    cain_act_v: INPC;
    qualkehk: INPC;
    nihlathak: INPC;
}
export interface IQuest {
    b15_completed_before: boolean;
    b14_completed_now: boolean;
    b13_done_recently: boolean;
    b12_closed: boolean;
    b11_custom7: boolean;
    b10_custom6: boolean;
    b9_custom5: boolean;
    b8_custom4: boolean;
    b7_custom3: boolean;
    b6_custom2: boolean;
    b5_custom1: boolean;
    b4_entered_area: boolean;
    b3_left_town: boolean;
    b2_is_received: boolean;
    b0_is_completed: boolean;
    b1_is_requirement_completed: boolean;
}
export interface IActQuests {
    introduced: boolean;
    completed: boolean;
}
export interface IActIQuests extends IActQuests {
    den_of_evil: IQuest;
    sisters_burial_grounds: IQuest;
    tools_of_the_trade: IQuest;
    the_search_for_cain: IQuest;
    the_forgotten_tower: IQuest;
    sisters_to_the_slaughter: IQuest;
}
export interface IActIWaypoints {
    rogue_encampement: boolean;
    cold_plains: boolean;
    stony_field: boolean;
    dark_woods: boolean;
    black_marsh: boolean;
    outer_cloister: boolean;
    jail_lvl_1: boolean;
    inner_cloister: boolean;
    catacombs_lvl_2: boolean;
}
export interface IActIIQuests extends IActQuests {
    radaments_lair: IQuest;
    the_horadric_staff: IQuest;
    tainted_sun: IQuest;
    arcane_sanctuary: IQuest;
    the_summoner: IQuest;
    the_seven_tombs: IQuest;
}
export interface IActIIWaypoints {
    lut_gholein: boolean;
    sewers_lvl_2: boolean;
    dry_hills: boolean;
    halls_of_the_dead_lvl_2: boolean;
    far_oasis: boolean;
    lost_city: boolean;
    palace_cellar_lvl_1: boolean;
    arcane_sanctuary: boolean;
    canyon_of_the_magi: boolean;
}
export interface IActIIIQuests extends IActQuests {
    lam_esens_tome: IQuest;
    khalims_will: IQuest;
    blade_of_the_old_religion: IQuest;
    the_golden_bird: IQuest;
    the_blackened_temple: IQuest;
    the_guardian: IQuest;
}
export interface IActIIIWaypoints {
    kurast_docks: boolean;
    spider_forest: boolean;
    great_marsh: boolean;
    flayer_jungle: boolean;
    lower_kurast: boolean;
    kurast_bazaar: boolean;
    upper_kurast: boolean;
    travincal: boolean;
    durance_of_hate_lvl_2: boolean;
}
export interface IActIVQuests extends IActQuests {
    the_fallen_angel: IQuest;
    terrors_end: IQuest;
    hellforge: IQuest;
}
export interface IActIVWaypoints {
    the_pandemonium_fortress: boolean;
    city_of_the_damned: boolean;
    river_of_flame: boolean;
}
export interface IActVQuests extends IActQuests {
    siege_on_harrogath: IQuest;
    rescue_on_mount_arreat: IQuest;
    prison_of_ice: IQuest;
    betrayal_of_harrogath: IQuest;
    rite_of_passage: IQuest;
    eve_of_destruction: IQuest;
    reset_consumed: boolean;
}
export interface IActVWaypoints {
    harrogath: boolean;
    frigid_highlands: boolean;
    arreat_plateau: boolean;
    crystalline_passage: boolean;
    halls_of_pain: boolean;
    glacial_trail: boolean;
    frozen_tundra: boolean;
    the_ancients_way: boolean;
    worldstone_keep_lvl_2: boolean;
}
export interface IQuests {
    act_i: IActIQuests;
    act_ii: IActIIQuests;
    act_iii: IActIIIQuests;
    act_iv: IActIVQuests;
    act_v: IActVQuests;
    unk058: Uint8Array;
    unk084: Uint8Array;
}
export interface IWaypoints {
    act_i: IActIWaypoints;
    act_ii: IActIIWaypoints;
    act_iii: IActIIIWaypoints;
    act_iv: IActIVWaypoints;
    act_v: IActVWaypoints;
    unk_align: Uint8Array;
    unk_last: Uint8Array;
}
export interface INPCData {
    normal: INPCS;
    nm: INPCS;
    hell: INPCS;
}
export interface IWaypointData {
    normal: IWaypoints;
    nm: IWaypoints;
    hell: IWaypoints;
}
export interface IHeader {
    identifier: string;
    version: number;
    filesize: number;
    checksum: string;
    unk0016: Uint8Array;
    unk0020: Uint8Array;
    name: string;
    status: IStatus;
    progression: number;
    active_arms: number;
    class: string;
    unk0041: Uint8Array;
    level: number;
    created: number;
    last_played: number;
    unk0052: Uint8Array;
    assigned_skills: string[];
    left_skill: string;
    right_skill: string;
    left_swap_skill: string;
    right_swap_skill: string;
    menu_appearance: ICharMenuAppearance;
    difficulty: IDifficulty;
    map_id: number;
    unk0175: Uint8Array;
    dead_merc: number;
    merc_id: string;
    merc_name_id: number;
    merc_type: number;
    merc_experience: number;
    unk0191: Uint8Array;
    unk0335: Uint8Array;
    unk0339: Uint8Array;
    unk0343: Uint8Array;
    quests_normal: IQuests;
    quests_nm: IQuests;
    quests_hell: IQuests;
    unk0633: Uint8Array;
    unk0635: Uint8Array;
    unk0639: Uint8Array;
    waypoints: IWaypointData;
    unk0713: Uint8Array;
    unk0715: Uint8Array;
    raw_npcs: Uint8Array;
    npcs: INPCData;
}
export interface IStatus {
    unk0: boolean;
    unk1: boolean;
    expansion: boolean;
    died: boolean;
    hardcore: boolean;
    ladder: boolean;
    unk7: boolean;
}
export interface ISkill {
    id: number;
    points: number;
    name: string;
}
export interface IItem {
    identified: boolean;
    socketed: boolean;
    max_sockets: number;
    new: boolean;
    is_ear: boolean;
    starter_item: boolean;
    simple_item: boolean;
    ethereal: boolean;
    personalized: boolean;
    personalized_name: string;
    given_runeword: boolean;
    version: string;
    location_id: ELocationId;
    equipped_id: EEquippedId;
    position_x: number;
    position_y: number;
    alt_position_id: EAltPositionId;
    type: string;
    type_id: ETypeId;
    type_name: string;
    quest_difficulty: number;
    nr_of_items_in_sockets: number;
    id: number;
    level: number;
    quality: EQuality;
    multiple_pictures: boolean;
    picture_id: number;
    class_specific: boolean;
    low_quality_id: number;
    timestamp: boolean;
    time: number;
    ear_attributes: IEarAttributes;
    defense_rating: number;
    max_durability: number;
    current_durability: number;
    total_nr_of_sockets: number;
    quantity: number;
    magic_prefix: number;
    magic_suffix: number;
    runeword_id: number;
    runeword_name: string;
    runeword_attributes: IMagicProperty[];
    set_id: number;
    set_name: string;
    set_list_count: number;
    set_attributes: IMagicProperty[][];
    set_attributes_num_req: number;
    set_attributes_ids_req: number;
    rare_name: string;
    rare_name2: string;
    magical_name_ids: [number, number, number, number, number, number];
    unique_id: number;
    unique_name: string;
    magic_attributes: IMagicProperty[];
    combined_magic_attributes: IMagicProperty[];
    socketed_items: IItem[];
    socketed_attributes: IMagicProperty[];
    base_damage: IWeaponDamage;
    reqstr: number;
    reqdex: number;
    inv_width: number;
    inv_height: number;
    inv_file: string;
    hd_inv_file: string;
    inv_transform: number;
    transform_color: string;
    item_quality: EItemQuality;
    categories: string[];
    file_index: number;
    auto_affix_id: number;
    _unknown_data: {
        b0_3?: Uint8Array;
        b5_10?: Uint8Array;
        b12?: Uint8Array;
        b14_15?: Uint8Array;
        b18_20?: Uint8Array;
        b23?: Uint8Array;
        b25?: Uint8Array;
        b27_31?: Uint8Array;
        plist_flag?: number;
    };
    rare_name_id: number;
    rare_name_id2: number;
    displayed_magic_attributes: IMagicProperty[];
    displayed_runeword_attributes: IMagicProperty[];
    displayed_socketed_attributes: IMagicProperty[];
    displayed_combined_magic_attributes: IMagicProperty[];
}
export interface IWeaponDamage {
    mindam: number;
    maxdam: number;
    twohandmindam: number;
    twohandmaxdam: number;
}
export interface IEarAttributes {
    class: number;
    level: number;
    name: string;
}
export interface IMagicProperty {
    id: number;
    name: string;
    values: number[];
    description: string;
    visible: boolean;
    op_value: number;
    op_stats?: string[];
    condition?: string;
}
export declare enum EStashType {
    shared = 0,
    private = 1
}
export interface IStash {
    version: string;
    type: EStashType;
    pageCount: number;
    sharedGold: number;
    hardcore: boolean;
    pages: IStashPage[];
}
export interface IStashPage {
    name: string;
    type: number;
    items: IItem[];
}
export declare enum EItemQuality {
    normal = 0,
    exceptional = 1,
    elite = 2
}
export declare enum EAltPositionId {
    Inventory = 1,
    Cube = 4,
    Stash = 5
}
export declare enum ELocationId {
    Stored = 0,
    Equipped = 1,
    Belt = 2,
    Cursor = 4,
    Socketed = 6
}
export declare enum EEquippedId {
    Stored = 0,
    Helm = 1,
    Amulet = 2,
    Armor = 3,
    RightHand = 4,
    LeftHand = 5,
    RightRing = 6,
    LeftRing = 7,
    Belt = 8,
    Boots = 9,
    Gloves = 10,
    RightHandSwitch = 11,
    LeftHandSwitch = 12,
    Unknown1 = 13,
    Unknown2 = 14
}
export declare enum ETypeId {
    Armor = 1,
    Shield = 2,//treated the same as armor... only here to be able to parse nokkas jsons
    Weapon = 3,
    Other = 4
}
export declare enum EQuality {
    Low = 1,
    Normal = 2,
    Superior = 3,
    Magic = 4,
    Set = 5,
    Rare = 6,
    Unique = 7,
    Crafted = 8,
    DemonTempered = 9
}
export declare enum EGemPosition {
    Weapon = "weapon",
    Helm = "helm",
    Shield = "shield"
}
export interface IGemMod {
    code?: string;
    type?: EGemPosition;
    m: string;
    p: number;
    min: number;
    max: number;
}
export type GemModList = IGemMod[];
export type GemMods = [GemModList, GemModList, GemModList];
