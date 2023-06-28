import {
  ContractURIUpdated as ContractURIUpdatedEvent,
  PlatformFeeInfoUpdated as PlatformFeeInfoUpdatedEvent,
  PluginAdded as PluginAddedEvent,
  PluginRemoved as PluginRemovedEvent,
  PluginSet as PluginSetEvent,
  PluginUpdated as PluginUpdatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  BuyerApprovedForListing as BuyerApprovedForListingEvent,
  CancelledListing as CancelledListingEvent,
  CurrencyApprovedForListing as CurrencyApprovedForListingEvent,
  NewListing as NewListingEvent,
  NewSale as NewSaleEvent,
  UpdatedListing as UpdatedListingEvent,
  AuctionClosed as AuctionClosedEvent,
  CancelledAuction as CancelledAuctionEvent,
  NewAuction as NewAuctionEvent,
  NewBid as NewBidEvent,
  AcceptedOffer as AcceptedOfferEvent,
  CancelledOffer as CancelledOfferEvent,
  NewOffer as NewOfferEvent
} from "../generated/MarketplaceV3/MarketplaceV3"
import {
  ContractURIUpdated,
  PlatformFeeInfoUpdated,
  PluginAdded,
  PluginRemoved,
  PluginSet,
  PluginUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  BuyerApprovedForListing,
  CancelledListing,
  CurrencyApprovedForListing,
  NewListing,
  NewSale,
  UpdatedListing,
  AuctionClosed,
  CancelledAuction,
  NewAuction,
  NewBid,
  AcceptedOffer,
  CancelledOffer,
  NewOffer
} from "../generated/schema"

export function handleContractURIUpdated(event: ContractURIUpdatedEvent): void {
  let entity = new ContractURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevURI = event.params.prevURI
  entity.newURI = event.params.newURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlatformFeeInfoUpdated(
  event: PlatformFeeInfoUpdatedEvent
): void {
  let entity = new PlatformFeeInfoUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.platformFeeRecipient = event.params.platformFeeRecipient
  entity.platformFeeBps = event.params.platformFeeBps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePluginAdded(event: PluginAddedEvent): void {
  let entity = new PluginAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.functionSelector = event.params.functionSelector
  entity.pluginAddress = event.params.pluginAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePluginRemoved(event: PluginRemovedEvent): void {
  let entity = new PluginRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.functionSelector = event.params.functionSelector
  entity.pluginAddress = event.params.pluginAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePluginSet(event: PluginSetEvent): void {
  let entity = new PluginSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.functionSelector = event.params.functionSelector
  entity.functionSignature = event.params.functionSignature
  entity.pluginAddress = event.params.pluginAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePluginUpdated(event: PluginUpdatedEvent): void {
  let entity = new PluginUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.functionSelector = event.params.functionSelector
  entity.oldPluginAddress = event.params.oldPluginAddress
  entity.newPluginAddress = event.params.newPluginAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBuyerApprovedForListing(
  event: BuyerApprovedForListingEvent
): void {
  let entity = new BuyerApprovedForListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.buyer = event.params.buyer
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledListing(event: CancelledListingEvent): void {
  let entity = new CancelledListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCurrencyApprovedForListing(
  event: CurrencyApprovedForListingEvent
): void {
  let entity = new CurrencyApprovedForListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.currency = event.params.currency
  entity.pricePerToken = event.params.pricePerToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewListing(event: NewListingEvent): void {
  let entity = new NewListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.listing_listingId = event.params.listing.listingId
  entity.listing_listingCreator = event.params.listing.listingCreator
  entity.listing_assetContract = event.params.listing.assetContract
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_quantity = event.params.listing.quantity
  entity.listing_currency = event.params.listing.currency
  entity.listing_pricePerToken = event.params.listing.pricePerToken
  entity.listing_startTimestamp = event.params.listing.startTimestamp
  entity.listing_endTimestamp = event.params.listing.endTimestamp
  entity.listing_reserved = event.params.listing.reserved
  entity.listing_tokenType = event.params.listing.tokenType
  entity.listing_status = event.params.listing.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewSale(event: NewSaleEvent): void {
  let entity = new NewSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.tokenId = event.params.tokenId
  entity.buyer = event.params.buyer
  entity.quantityBought = event.params.quantityBought
  entity.totalPricePaid = event.params.totalPricePaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedListing(event: UpdatedListingEvent): void {
  let entity = new UpdatedListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.listing_listingId = event.params.listing.listingId
  entity.listing_listingCreator = event.params.listing.listingCreator
  entity.listing_assetContract = event.params.listing.assetContract
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_quantity = event.params.listing.quantity
  entity.listing_currency = event.params.listing.currency
  entity.listing_pricePerToken = event.params.listing.pricePerToken
  entity.listing_startTimestamp = event.params.listing.startTimestamp
  entity.listing_endTimestamp = event.params.listing.endTimestamp
  entity.listing_reserved = event.params.listing.reserved
  entity.listing_tokenType = event.params.listing.tokenType
  entity.listing_status = event.params.listing.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionClosed(event: AuctionClosedEvent): void {
  let entity = new AuctionClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.assetContract = event.params.assetContract
  entity.closer = event.params.closer
  entity.tokenId = event.params.tokenId
  entity.auctionCreator = event.params.auctionCreator
  entity.winningBidder = event.params.winningBidder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledAuction(event: CancelledAuctionEvent): void {
  let entity = new CancelledAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionCreator = event.params.auctionCreator
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewAuction(event: NewAuctionEvent): void {
  let entity = new NewAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionCreator = event.params.auctionCreator
  entity.auctionId = event.params.auctionId
  entity.assetContract = event.params.assetContract
  entity.auction_auctionId = event.params.auction.auctionId
  entity.auction_auctionCreator = event.params.auction.auctionCreator
  entity.auction_assetContract = event.params.auction.assetContract
  entity.auction_tokenId = event.params.auction.tokenId
  entity.auction_quantity = event.params.auction.quantity
  entity.auction_currency = event.params.auction.currency
  entity.auction_minimumBidAmount = event.params.auction.minimumBidAmount
  entity.auction_buyoutBidAmount = event.params.auction.buyoutBidAmount
  entity.auction_timeBufferInSeconds = event.params.auction.timeBufferInSeconds
  entity.auction_bidBufferBps = event.params.auction.bidBufferBps
  entity.auction_startTimestamp = event.params.auction.startTimestamp
  entity.auction_endTimestamp = event.params.auction.endTimestamp
  entity.auction_tokenType = event.params.auction.tokenType
  entity.auction_status = event.params.auction.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewBid(event: NewBidEvent): void {
  let entity = new NewBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.bidder = event.params.bidder
  entity.assetContract = event.params.assetContract
  entity.bidAmount = event.params.bidAmount
  entity.auction_auctionId = event.params.auction.auctionId
  entity.auction_auctionCreator = event.params.auction.auctionCreator
  entity.auction_assetContract = event.params.auction.assetContract
  entity.auction_tokenId = event.params.auction.tokenId
  entity.auction_quantity = event.params.auction.quantity
  entity.auction_currency = event.params.auction.currency
  entity.auction_minimumBidAmount = event.params.auction.minimumBidAmount
  entity.auction_buyoutBidAmount = event.params.auction.buyoutBidAmount
  entity.auction_timeBufferInSeconds = event.params.auction.timeBufferInSeconds
  entity.auction_bidBufferBps = event.params.auction.bidBufferBps
  entity.auction_startTimestamp = event.params.auction.startTimestamp
  entity.auction_endTimestamp = event.params.auction.endTimestamp
  entity.auction_tokenType = event.params.auction.tokenType
  entity.auction_status = event.params.auction.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAcceptedOffer(event: AcceptedOfferEvent): void {
  let entity = new AcceptedOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId
  entity.assetContract = event.params.assetContract
  entity.tokenId = event.params.tokenId
  entity.seller = event.params.seller
  entity.quantityBought = event.params.quantityBought
  entity.totalPricePaid = event.params.totalPricePaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledOffer(event: CancelledOfferEvent): void {
  let entity = new CancelledOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewOffer(event: NewOfferEvent): void {
  let entity = new NewOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId
  entity.assetContract = event.params.assetContract
  entity.offer_offerId = event.params.offer.offerId
  entity.offer_offeror = event.params.offer.offeror
  entity.offer_assetContract = event.params.offer.assetContract
  entity.offer_tokenId = event.params.offer.tokenId
  entity.offer_quantity = event.params.offer.quantity
  entity.offer_currency = event.params.offer.currency
  entity.offer_totalPrice = event.params.offer.totalPrice
  entity.offer_expirationTimestamp = event.params.offer.expirationTimestamp
  entity.offer_tokenType = event.params.offer.tokenType
  entity.offer_status = event.params.offer.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
