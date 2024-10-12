module 0x1::Scoring {
    use 0x1::Hydra::{HydraAvatar, update_hydra};

    public fun score_personal_action(_avatar: &mut HydraAvatar, action_points: u64, _streak_bonus: bool) {
        let bonus = if (_streak_bonus) { action_points / 2 } else { 0 };
        update_hydra(_avatar, action_points + bonus);
    }
}