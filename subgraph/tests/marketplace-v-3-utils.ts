import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/MarketplaceV3/MarketplaceV3"

export function createContractURIUpdatedEvent(
  prevURI: string,
  newURI: string
): ContractURIUpdated {
  let contractUriUpdatedEvent = changetype<ContractURIUpdated>(newMockEvent())

  contractUriUpdatedEvent.parameters = new Array()

  contractUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevURI", ethereum.Value.fromString(prevURI))
  )
  contractUriUpdatedEvent.parameters.push(
    new ethereum.EventParam("newURI", ethereum.Value.fromString(newURI))
  )

  return contractUriUpdatedEvent
}

export function createPlatformFeeInfoUpdatedEvent(
  platformFeeRecipient: Address,
  platformFeeBps: BigInt
): PlatformFeeInfoUpdated {
  let platformFeeInfoUpdatedEvent = changetype<PlatformFeeInfoUpdated>(
    newMockEvent()
  )

  platformFeeInfoUpdatedEvent.parameters = new Array()

  platformFeeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeRecipient",
      ethereum.Value.fromAddress(platformFeeRecipient)
    )
  )
  platformFeeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeBps",
      ethereum.Value.fromUnsignedBigInt(platformFeeBps)
    )
  )

  return platformFeeInfoUpdatedEvent
}

export function createPluginAddedEvent(
  functionSelector: Bytes,
  pluginAddress: Address
): PluginAdded {
  let pluginAddedEvent = changetype<PluginAdded>(newMockEvent())

  pluginAddedEvent.parameters = new Array()

  pluginAddedEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  pluginAddedEvent.parameters.push(
    new ethereum.EventParam(
      "pluginAddress",
      ethereum.Value.fromAddress(pluginAddress)
    )
  )

  return pluginAddedEvent
}

export function createPluginRemovedEvent(
  functionSelector: Bytes,
  pluginAddress: Address
): PluginRemoved {
  let pluginRemovedEvent = changetype<PluginRemoved>(newMockEvent())

  pluginRemovedEvent.parameters = new Array()

  pluginRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  pluginRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "pluginAddress",
      ethereum.Value.fromAddress(pluginAddress)
    )
  )

  return pluginRemovedEvent
}

export function createPluginSetEvent(
  functionSelector: Bytes,
  functionSignature: string,
  pluginAddress: Address
): PluginSet {
  let pluginSetEvent = changetype<PluginSet>(newMockEvent())

  pluginSetEvent.parameters = new Array()

  pluginSetEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  pluginSetEvent.parameters.push(
    new ethereum.EventParam(
      "functionSignature",
      ethereum.Value.fromString(functionSignature)
    )
  )
  pluginSetEvent.parameters.push(
    new ethereum.EventParam(
      "pluginAddress",
      ethereum.Value.fromAddress(pluginAddress)
    )
  )

  return pluginSetEvent
}

export function createPluginUpdatedEvent(
  functionSelector: Bytes,
  oldPluginAddress: Address,
  newPluginAddress: Address
): PluginUpdated {
  let pluginUpdatedEvent = changetype<PluginUpdated>(newMockEvent())

  pluginUpdatedEvent.parameters = new Array()

  pluginUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  pluginUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPluginAddress",
      ethereum.Value.fromAddress(oldPluginAddress)
    )
  )
  pluginUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPluginAddress",
      ethereum.Value.fromAddress(newPluginAddress)
    )
  )

  return pluginUpdatedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createBuyerApprovedForListingEvent(
  listingId: BigInt,
  buyer: Address,
  approved: boolean
): BuyerApprovedForListing {
  let buyerApprovedForListingEvent = changetype<BuyerApprovedForListing>(
    newMockEvent()
  )

  buyerApprovedForListingEvent.parameters = new Array()

  buyerApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  buyerApprovedForListingEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyerApprovedForListingEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return buyerApprovedForListingEvent
}

export function createCancelledListingEvent(
  listingCreator: Address,
  listingId: BigInt
): CancelledListing {
  let cancelledListingEvent = changetype<CancelledListing>(newMockEvent())

  cancelledListingEvent.parameters = new Array()

  cancelledListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  cancelledListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )

  return cancelledListingEvent
}

export function createCurrencyApprovedForListingEvent(
  listingId: BigInt,
  currency: Address,
  pricePerToken: BigInt
): CurrencyApprovedForListing {
  let currencyApprovedForListingEvent = changetype<CurrencyApprovedForListing>(
    newMockEvent()
  )

  currencyApprovedForListingEvent.parameters = new Array()

  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerToken",
      ethereum.Value.fromUnsignedBigInt(pricePerToken)
    )
  )

  return currencyApprovedForListingEvent
}

export function createNewListingEvent(
  listingCreator: Address,
  listingId: BigInt,
  assetContract: Address,
  listing: ethereum.Tuple
): NewListing {
  let newListingEvent = changetype<NewListing>(newMockEvent())

  newListingEvent.parameters = new Array()

  newListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  newListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newListingEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newListingEvent.parameters.push(
    new ethereum.EventParam("listing", ethereum.Value.fromTuple(listing))
  )

  return newListingEvent
}

export function createNewSaleEvent(
  listingCreator: Address,
  listingId: BigInt,
  assetContract: Address,
  tokenId: BigInt,
  buyer: Address,
  quantityBought: BigInt,
  totalPricePaid: BigInt
): NewSale {
  let newSaleEvent = changetype<NewSale>(newMockEvent())

  newSaleEvent.parameters = new Array()

  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "quantityBought",
      ethereum.Value.fromUnsignedBigInt(quantityBought)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "totalPricePaid",
      ethereum.Value.fromUnsignedBigInt(totalPricePaid)
    )
  )

  return newSaleEvent
}

export function createUpdatedListingEvent(
  listingCreator: Address,
  listingId: BigInt,
  assetContract: Address,
  listing: ethereum.Tuple
): UpdatedListing {
  let updatedListingEvent = changetype<UpdatedListing>(newMockEvent())

  updatedListingEvent.parameters = new Array()

  updatedListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  updatedListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  updatedListingEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  updatedListingEvent.parameters.push(
    new ethereum.EventParam("listing", ethereum.Value.fromTuple(listing))
  )

  return updatedListingEvent
}

export function createAuctionClosedEvent(
  auctionId: BigInt,
  assetContract: Address,
  closer: Address,
  tokenId: BigInt,
  auctionCreator: Address,
  winningBidder: Address
): AuctionClosed {
  let auctionClosedEvent = changetype<AuctionClosed>(newMockEvent())

  auctionClosedEvent.parameters = new Array()

  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam("closer", ethereum.Value.fromAddress(closer))
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionCreator",
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "winningBidder",
      ethereum.Value.fromAddress(winningBidder)
    )
  )

  return auctionClosedEvent
}

export function createCancelledAuctionEvent(
  auctionCreator: Address,
  auctionId: BigInt
): CancelledAuction {
  let cancelledAuctionEvent = changetype<CancelledAuction>(newMockEvent())

  cancelledAuctionEvent.parameters = new Array()

  cancelledAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionCreator",
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  cancelledAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return cancelledAuctionEvent
}

export function createNewAuctionEvent(
  auctionCreator: Address,
  auctionId: BigInt,
  assetContract: Address,
  auction: ethereum.Tuple
): NewAuction {
  let newAuctionEvent = changetype<NewAuction>(newMockEvent())

  newAuctionEvent.parameters = new Array()

  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionCreator",
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newAuctionEvent.parameters.push(
    new ethereum.EventParam("auction", ethereum.Value.fromTuple(auction))
  )

  return newAuctionEvent
}

export function createNewBidEvent(
  auctionId: BigInt,
  bidder: Address,
  assetContract: Address,
  bidAmount: BigInt,
  auction: ethereum.Tuple
): NewBid {
  let newBidEvent = changetype<NewBid>(newMockEvent())

  newBidEvent.parameters = new Array()

  newBidEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam("auction", ethereum.Value.fromTuple(auction))
  )

  return newBidEvent
}

export function createAcceptedOfferEvent(
  offeror: Address,
  offerId: BigInt,
  assetContract: Address,
  tokenId: BigInt,
  seller: Address,
  quantityBought: BigInt,
  totalPricePaid: BigInt
): AcceptedOffer {
  let acceptedOfferEvent = changetype<AcceptedOffer>(newMockEvent())

  acceptedOfferEvent.parameters = new Array()

  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "quantityBought",
      ethereum.Value.fromUnsignedBigInt(quantityBought)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "totalPricePaid",
      ethereum.Value.fromUnsignedBigInt(totalPricePaid)
    )
  )

  return acceptedOfferEvent
}

export function createCancelledOfferEvent(
  offeror: Address,
  offerId: BigInt
): CancelledOffer {
  let cancelledOfferEvent = changetype<CancelledOffer>(newMockEvent())

  cancelledOfferEvent.parameters = new Array()

  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return cancelledOfferEvent
}

export function createNewOfferEvent(
  offeror: Address,
  offerId: BigInt,
  assetContract: Address,
  offer: ethereum.Tuple
): NewOffer {
  let newOfferEvent = changetype<NewOffer>(newMockEvent())

  newOfferEvent.parameters = new Array()

  newOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam("offer", ethereum.Value.fromTuple(offer))
  )

  return newOfferEvent
}
