# MoonDAO Digital Asset Marketplace 🌕🌕

[![](/webapp/public/Original_Black.png)](https://moondao-marketplace-test.netlify.app/)

The MoonDAO Digital Asset Marketplace is where people can buy or list digital assets (NFTs) for Mooney.

---

## Marketplace

### Buying Assets
1. Direct Listings
   1. Find an asset with a direct listing and purchase for the specified amount
   2. Select a quantity for ERC-1155 listings
2. Auction Listings
   1. Find an asset and place a bid or buyout the auction
      1. Buyout: Immediatley purchase the asset
      2. Bid: Place a bid greater than the previous one, if you have the highest bid when the auction is over you will receive the asset otherwise your bid is returned
   
### Selling Assets
1. Permissions
   1. Only specific collections can be listed on the marketplace, click the 'submit a collection' button [HERE](https://moondao-marketplace-test.netlify.com/sell) to submit your nft collection.  It will be reviewed and you will be notified in a MoonDAO channel by a MoonDAO steward.
1. Direct Listings
   1. Fill in the input fields (quantity, start-time, end-time, price)
   2. Quantity: List a single ERC-721 or multiple ERC-1155 tokens. If you choose to list multiple ERC-1155s they can be sold separately.
   3. Payout: If the direct listing is bought within the time range the asset will be sent to the buyer and the seller will receive the payout, automatically
   4. Cancel:  The seller can cancel a direct listing at anytime by going to their profile page
2. Auction Listings
   1. Fill in the input fields (quantity, start-time, end-time, buyout-price, minimum-bid)
   2. Quantity: List a single ERC-721 or multiple ERC-1155 tokens as a bundle (the tokens will be sold together)
   3. Buyout Payout: If an auction is bought out, it is closed, the seller receives the digital asset and the seller can claim the payout. In order to claim the payout for an auction the seller must navigate to their profile page and click "claim payout" on the auction.
   4. Bid Payout: Once an auction expires the winning bidder will be assign the asset. The seller or bidder will have to then close the auction by going to their profile page and claiming the payout or asset.
   5. Cancel:  Once a auction has started and has received a bid it CANNOT be canceld. If an auction expires before it is bought out or receives any bids the seller will need to cancel it to re-claim their digital asset.

### Profile
1. Manage listings
   1. See current status, bids and expiration
   2. Cancel listings
   3. Claim payouts for Auction listings

---

## [WebApp](/webapp/)
**Demo:** [Marketplace-Demo](https://moondao-marketplace-test.netlify.app/)

The webapp is built on a NextJS framework, using mainly React and Tailwind for the front-end and Thirdweb for interacting with smart contracts. 

Read the documentation to get started [WebApp Documentation](/webapp/README.md)

## [Subgraphs](/subgraphs/)

Subgraphs for the Thirdweb MarketplaceV3 contract.
These subgraphs allow historical data to be filtered and queried for all events emitted by the MarketplaceV3 contract on different networks.

Learn how to deploy a subgraph => [Deploy a subgraph](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-studio/)