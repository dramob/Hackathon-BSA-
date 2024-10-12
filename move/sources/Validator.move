module 0x0::Validator {
    use 0x0::Hydra::{HydraAvatar, update_hydra};


    // Validator structure
    public struct Validator has key, store {
        id: UID,              // Unique validator ID
        address: address,     // Validator's address
    }

    // Function for validators to validate actions and give bonus points
    public fun validate_action(_validator: &Validator, avatar: &mut HydraAvatar, validated_points: u64) {
        update_hydra(avatar, validated_points);
    }

    // Function to create a new validator
    public fun create_validator(creator: address, ctx: &mut tx_context::TxContext): Validator {
        let id = object::new(ctx);
        Validator { id, address: creator }
    }

    // Transfer ownership of the validator
    public fun transfer_validator(validator: Validator, new_owner: address, _ctx: &mut tx_context::TxContext) {
        transfer::transfer(validator, new_owner);
    }
}