#[allow(duplicate_alias,unused_variables)]

module 0x0::Hydra {


    use sui::tx_context;
    use sui::transfer;
    use sui::object;

    // Définition de la structure HydraAvatar avec propriétés associées
    public struct HydraAvatar has key, store {
        id: UID,                // Identifiant unique pour chaque avatar (NFT)
        points: u64,            // Points de l'avatar
        xp: u64,                // Valeur d'XP pour le leveling
        level: u8,              // Niveau actuel de l'avatar
        url: vector<u8>,        // URL de l'image de l'avatar en fonction du niveau
        owner: address,         // Adresse du propriétaire
    }

    // Fonction publique d'entrée pour minter un nouvel NFT HydraAvatar
    public entry fun mint_avatar(url: vector<u8>, ctx: &mut TxContext) {
        let creator = tx_context::sender(ctx);
        let avatar_id = object::new(ctx);
        let avatar = HydraAvatar {
            id: avatar_id,
            points: 0,
            xp: 0,
            level: 1,
            url,
            owner: creator,
        };

        // Transférer l'avatar au créateur
        transfer::transfer(avatar, creator);}
    // Fonction pour mettre à jour les points et le niveau de l'avatar
    public fun update_hydra(avatar: &mut HydraAvatar, additional_points: u64, additional_xp: u64) {
        // Ajouter les points supplémentaires
        avatar.points = avatar.points + additional_points;
        // Ajouter l'XP supplémentaire
        avatar.xp = avatar.xp + additional_xp;

        // Vérifier si l'avatar doit monter de niveau
        if (avatar.xp >= get_xp_threshold(avatar.level)) {
            avatar.level = avatar.level + 1;  // Augmenter le niveau
            // Mettre à jour l'URL de l'image en fonction du nouveau niveau
            avatar.url = get_level_image(avatar.level);
        }
    }

    // Fonction auxiliaire pour obtenir le seuil d'XP pour le leveling
    public fun get_xp_threshold(level: u8): u64 {
        match (level) {
            1 => 500,    // Niveau 2 à 500 XP
            2 => 1500,   // Niveau 3 à 1500 XP
            3 => 2000,    // Seuil arbitraire pour les niveaux supérieurs
            _=> 3500
        }
    }

    // Fonction auxiliaire pour obtenir l'URL de l'image en fonction du niveau de l'avatar
    public fun get_level_image(level: u8): vector<u8> {
        match (level) {
            1 => b"https://ibb.co/PTtS4V9",        // Image pour le niveau 1
            2 => b"https://ibb.co/fCGSH91", // Image pour le niveau 2
            3 => b"https://ibb.co/kBNMfcN", // Image pour le niveau 3
            _ => b"https://example.com/default.png" // Image par défaut pour les niveaux supérieurs
        }
    }

    // Fonction pour brûler l'avatar (ne peut être appelée que par le propriétaire)
    public fun burn_avatar(avatar: HydraAvatar, caller: &address) {
        assert!(caller == &avatar.owner, 100);  // Vérifie que seul le propriétaire peut brûler l'avatar

        // Désassemblage explicite de l'avatar pour libérer ses ressources
        let HydraAvatar { id, points, xp, level, url, owner } = avatar;
        // Supprimer l'ID de l'objet pour indiquer que l'objet est détruit
        object::delete(id);
        // Les autres champs seront détruits automatiquement
    }
    // Fonction pour dépenser des points de l'avatar (ne peut être appelée que par le propriétaire)
public fun spend_points(avatar: &mut HydraAvatar, points_to_spend: u64, caller: &address) {
    assert!(caller == &avatar.owner, 100);  // Vérifie que seul le propriétaire peut dépenser des points
    assert!(avatar.points >= points_to_spend, 101);  // Vérifie que l'avatar a assez de points

    avatar.points = avatar.points - points_to_spend;  // Déduit les points
}
}