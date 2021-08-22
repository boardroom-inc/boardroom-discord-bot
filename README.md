# Boardroom's Discord Bot

A bot to interact with Boardroom's API and subscribe to new events.

There are two sets of commands: Commands to get general information and commands for subscriptions.

Subscriptions are run through every 30 seconds.

## Commands

#### ./protocol_list
Lists all protocols supported by Boardroom.

#### ./protocol_proposals
Lists all proposals in a protocol

Options:
* `cname` (required) - Code name for the protocol must be [a-z0-9] (e.g "uniswap")

#### ./protocol_voters
Lists all voters in a protocol

Options:
* `cname` (required) - Code name for the protocol must be [a-z0-9] (e.g "uniswap")

#### ./proposal_votes
Lists all voters in a protocol

Options:
* `refid` (required) - Unique code representing proposal (ends with =)

#### ./protocol_get
Retrieves information about a specific protocol.

Options:
* `cname` (required) - Code name for the protocol must be [a-z0-9] (e.g "uniswap")

#### ./proposal_get
Retrieves information about a specific proposal.

Options:
* `refid` (required) - Unique code representing proposal (ends with =)

#### ./voters_votes
Retrieves the votes of a specific address.

Options:
* `address` (required) - Address of the voter

#### ./voters_get
Retrieves information about a voter.

Options:
* `address` (required) - Address of the voter

#### ./stats
Prints Boardroom's global statistics.

#### ./subscribe_to_protocols
Be notified any time a new protocol is added.

Options:
* `frequency` - How often to check (in hours)

#### ./subscribe_to_protocol_proposals
Be notified any time a new proposal is added.

Options:
* `cname` (required) - Code name for the protocol must be [a-z0-9] (e.g "uniswap")
* `frequency` - How often to check (in hours)

#### ./subscribe_to_proposal_state
Be notified any time the state of a proposal changes.

Options:
* `refid` (required) - Unique code representing proposal (ends with =)
* `frequency` - How often to check (in hours)

#### ./subscribe_to_proposal_votes
Be notified any time a proposal has a new vote.

Options:
* `refid` (required) - Unique code representing proposal (ends with =)
* `frequency` - How often to check (in hours)

#### ./subscribe_to_voter_votes
Be notified any time an address votes.

Options:
* `address` (required) - Address of the voter
* `frequency` - How often to check (in hours)

#### ./subscribe_to_stats
Display global statistics from time to time.

Options:
* `frequency` - How often to check (in hours)

#### ./show_all_subscriptions
Lists all active subscriptions.

#### ./delete_subscription
Delete a subscription

#### ./delete_all_subscriptions
Delete all subscriptions
