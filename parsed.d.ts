/** https://developer.apple.com/documentation/appstoreservernotifications/jwstransactiondecodedpayload */
interface AppStoreNotificationTransactionInfo {
  /** A UUID that associates the transaction with a user on your own service. If your app doesn’t provide an appAccountToken, this string is empty. For more information, see appAccountToken(_:).*/
  'appAccountToken'?: AppAccountToken;

  /** The bundle identifier of the app.*/
  'bundleId'?: BundleId;

  /** The server environment, either sandbox or production.*/
  'environment'?: Environment;

  /** The UNIX time, in milliseconds, the subscription expires or renews.*/
  'expiresDate'?: ExpiresDate;

  /** A string that describes whether the transaction was purchased by the user, or is available to them through Family Sharing.*/
  'inAppOwnershipType'?: InAppOwnershipType;

  /** A Boolean value that indicates whether the user upgraded to another subscription.*/
  'isUpgraded'?: IsUpgraded;

  /** The identifier that contains the promo code or the promotional offer identifier.*/
  'offerIdentifier'?: OfferIdentifier;

  /** A value that represents the promotional offer type.*/
  'offerType'?: OfferType;

  /** The UNIX time, in milliseconds, that represents the purchase date of the original transaction identifier.*/
  'originalPurchaseDate'?: OriginalPurchaseDate;

  /** The transaction identifier of the original purchase.*/
  'originalTransactionId'?: OriginalTransactionId;

  /** The product identifier of the in-app purchase.*/
  'productId'?: ProductId;

  /** The UNIX time, in milliseconds, that the App Store charged the user’s account for a purchase, restored product, subscription, or subscription renewal after a lapse.*/
  'purchaseDate'?: PurchaseDate;

  /** The number of consumable products the user purchased.*/
  'quantity'?: Quantity;

  /** The UNIX time, in milliseconds, that the App Store refunded the transaction or revoked it from Family Sharing.*/
  'revocationDate'?: RevocationDate;

  /** The reason that the App Store refunded the transaction or revoked it from Family Sharing.*/
  'revocationReason'?: RevocationReason;

  /** The UNIX time, in milliseconds, that the App Store signed the JSON Web Signature (JWS) data.*/
  'signedDate'?: SignedDate;

  /** The identifier of the subscription group the subscription belongs to.*/
  'subscriptionGroupIdentifier'?: SubscriptionGroupIdentifier;

  /** The unique identifier of the transaction.*/
  'transactionId'?: TransactionId;

  /** The type of the in-app purchase.*/
  'type'?: Type;

  /** The unique identifier of subscription purchase events across devices, including subscription renewals.*/
  'webOrderLineItemId'?: WebOrderLineItemId;
}

/** https://developer.apple.com/documentation/appstoreservernotifications/appaccounttoken */
type AppAccountToken = uuid;

/** https://developer.apple.com/documentation/appstoreservernotifications/bundleid */
type BundleId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/environment */
type Environment = /** string */
  | 'Sandbox' /** Indicates that the notification applies to testing in the sandbox environment. */
  | 'Production'; /** Indicates that the notification applies to the production environment. */

/** https://developer.apple.com/documentation/appstoreservernotifications/expiresdate */
type ExpiresDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/inappownershiptype */
type InAppOwnershipType = /** string */
  | 'FAMILY_SHARED' /** The transaction belongs to a family member who benefits from the service. */
  | 'PURCHASED'; /** The transaction belongs to the purchaser. */

/** https://developer.apple.com/documentation/appstoreservernotifications/isupgraded */
type IsUpgraded = boolean;

