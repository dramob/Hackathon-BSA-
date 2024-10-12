module 0x0::HydraTest {

    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::test_scenario::TestScenario;
    use sui::nft::NFT;
    use 0x0::Hydra::{HydraAvatar, mint_avatar, update_hydra, burn_avatar, get_level_image};

    // Set up the test environment
    public fun run_tests() {
        let scenario = TestScenario::new();
        let ctx = scenario.new_tx_context();

        test_mint_avatar(&ctx);
        test_update_points(&ctx);
        test_burn_avatar(&ctx);
    }

    // Test minting a new HydraAvatar
    fun test_mint_avatar(ctx: &mut TxContext) {
        let creator = @0x0;
        let url = b"https://example.com/avatar.png";
        
        // Call mint_avatar function
        let avatar = mint_avatar(&creator, url, ctx);

        // Assert that the avatar has correct initial values
        assert!(avatar.level == 1, 100);  // Level should start at 1
        assert!(avatar.xp == 0, 101);     // XP should start at 0
        assert!(avatar.points == 0, 102); // Points should start at 0
        assert!(avatar.owner == @0x0, 103); // Owner should be the creator
    }

    // Test updating points and XP
    fun test_update_points(ctx: &mut TxContext) {
        let creator = @0x0;
        let url = b"https://example.com/avatar.png";
        
        // Mint a new avatar
        let mut avatar = mint_avatar(&creator, url, ctx);

        // Call update_hydra to add points and XP
        update_hydra(&mut avatar, 200, 600);  // Add 200 points and 600 XP

        // Assert that points and XP are updated correctly
        assert!(avatar.points == 200, 200);    // Points should be 200
        assert!(avatar.xp == 600, 201);        // XP should be 600
        assert!(avatar.level == 2, 202);       // Avatar should level up to 2
        assert!(avatar.url == get_level_image(2), 203); // URL should update based on level
    }

    // Test burning the avatar
    fun test_burn_avatar(ctx: &mut TxContext) {
        let creator = @0x0;
        let url = b"https://example.com/avatar.png";
        
        // Mint a new avatar
        let avatar = mint_avatar(&creator, url, ctx);

        // Try burning the avatar as the owner
        burn_avatar(avatar, &creator);
        // The avatar should be burned, so no further assertions needed
    }
}