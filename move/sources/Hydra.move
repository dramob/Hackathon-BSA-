module 0x0::Hydra {

    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::nft::NFT;

    // Define the HydraAvatar struct with associated properties
    struct HydraAvatar has key, store {
        id: UID,                // Unique identifier for each avatar (NFT)
        points: u64,            // Points for the avatar
        xp: u64,                // XP value for leveling up
        level: u8,              // Avatar's current level
        url: vector<u8>,        // URL for the avatar's image based on level
        owner: address,         // Address of the owner
    }

    // Public function to mint a new HydraAvatar NFT
    public fun mint_avatar(creator: &address, url: vector<u8>, ctx: &mut TxContext): HydraAvatar {
        let avatar_id = object::new(ctx);
        let avatar = HydraAvatar {
            id: avatar_id,
            points: 0,       // New avatar starts with 0 points
            xp: 0,           // New avatar starts with 0 XP
            level: 1,        // New avatar starts at level 1
            url,             // Image URL for the level
            owner: *creator  // Set the owner as the creator
        };

        transfer::transfer(avatar, *creator);
        avatar
    }

    // Function to add new points and XP to the avatar (can be called by anyone)
    public fun update_points(avatar: &mut HydraAvatar, additional_points: u64, additional_xp: u64) {
        // Add the new points and XP to the existing values
        avatar.points = avatar.points + additional_points;
        avatar.xp = avatar.xp + additional_xp;

        // Check if the avatar should level up
        if avatar.xp >= get_xp_threshold(avatar.level) {
            avatar.level = avatar.level + 1;  // Increase level when XP threshold is reached
            // Change the avatar's image URL based on the new level
            avatar.url = get_level_image(avatar.level);
        }
    }

    // Helper function to get the XP threshold for leveling up
    public fun get_xp_threshold(level: u8): u64 {
        match level {
            1 => 500,    // Level 2 at 500 XP
            2 => 1500,   // Level 3 at 1500 XP
            _ => 2000    // Arbitrary threshold for higher levels
        }
    }

    // Helper function to get the image URL based on the avatar's level
    public fun get_level_image(level: u8): vector<u8> {
        match level {
            1 => b"https://example.com/level1.png",  // Image for level 1
            2 => b"https://example.com/level2.png",  // Image for level 2
            3 => b"https://example.com/level3.png",  // Image for level 3
            _ => b"https://example.com/default.png"  // Default image for higher levels
        }
    }

    // Function to burn the avatar (can only be called by the owner)
    public fun burn_avatar(avatar: HydraAvatar, caller: &address) {
        assert!(caller == &avatar.owner, 100);  // Ensure only the owner can burn the avatar
        object::delete(avatar.id);  // Delete the avatar's UID
    }
}