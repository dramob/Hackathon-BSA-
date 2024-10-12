module 0x1::Credits {
    use 0x1::Hydra::{HydraAvatar, get_power, set_power};

    public fun redeem_for_deal(avatar: &mut HydraAvatar, points_to_redeem: u64): bool {
        if (get_power(avatar) >= points_to_redeem) {
            let new_power = get_power(avatar) - points_to_redeem;
            set_power(avatar, new_power);
            true  // Successful redemption
        } else {
            false  // Failed redemption
        }
    }

    public fun convert_to_carbon_credits(avatar: &mut HydraAvatar): u64 {
        let carbon_credits = get_power(avatar) / 1000;  // Conversion rate for carbon credits
        set_power(avatar, 0);  // Reset power after conversion
        carbon_credits  // Return the calculated carbon credits
    }
}