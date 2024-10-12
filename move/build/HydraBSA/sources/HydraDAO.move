module 0x1::HydraDAO {
    use sui::object;
    use sui::tx_context;

    public struct Proposal has key, store {
        id: UID,
        description: vector<u8>,
        yes_votes: u64,
        no_votes: u64,
        proposer: address,
    }

    // Function to create a proposal
    public fun create_proposal(description: vector<u8>, proposer: address, _ctx: &mut tx_context::TxContext): Proposal {
        let id = object::new(_ctx);
        Proposal {
            id,
            description,
            yes_votes: 0,
            no_votes: 0,
            proposer,
        }
    }

    // Voting on a proposal
    public fun vote(_proposal: &mut Proposal, _vote: bool) {
        if (_vote) {
            _proposal.yes_votes = _proposal.yes_votes + 1;
        } else {
            _proposal.no_votes = _proposal.no_votes + 1;
        }
    }

    // Finalize a proposal
    public fun finalize_proposal(_proposal: &Proposal): bool {
        if (_proposal.yes_votes > _proposal.no_votes) {
            true  // Proposal passed
        } else {
            false  // Proposal rejected
        }
    }
}