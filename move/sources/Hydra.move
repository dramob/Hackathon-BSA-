#[allow(lint(custom_state_change))]
module 0x0::Hydra {

    public struct HydraAvatar has key, store {
        id: UID,
        power: u64,
        level: u8,
        owner: address,
    }

    // Getter for power
    public fun get_power(avatar: &HydraAvatar): u64 {
        avatar.power
    }

    // Setter for power
    public fun set_power(avatar: &mut HydraAvatar, new_power: u64) {
        avatar.power = new_power;
    }

    // Function to update the Hydra Avatar's power and level
    public fun update_hydra(avatar: &mut HydraAvatar, points: u64) {
        avatar.power = avatar.power + points;
        if (avatar.power >= 100) {
            avatar.level = avatar.level + 1;
        }
    }

    // Transfer function
    public fun transfer_hydra(avatar: HydraAvatar, new_owner: address, _ctx: &mut tx_context::TxContext) {
        transfer::transfer(avatar, new_owner);
    }
}