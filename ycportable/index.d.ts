import { Currency, DateString, DateTime, DeviceType, domain, email, integer, nanoId10, phoneNumber, uri, uuid } from '../common';
import { EmailServiceProvider } from './esp';
import { StringLikeExpression } from './expressions';
import { AutoApplyConfig, BasicScrape, CurrencyScrape, PageTypeScrape, RepeatedItemScrape } from './scraping';
import { UserGroups } from './user-groups';
import { User, UserType } from './user/user';
export * from './expressions';
export * from './esp';
export * from './scraping';
export { UserGroups } from './user-groups';
export interface IdentifiableEntity<Identifier> {
    id: Identifier;
}
/**
 * Common properties for keeping track of updates to Entity.
 */
export interface TrackableEntity {
    deleted_at: DateTime | null;
    created_at: DateTime;
    updated_at: DateTime;
}
/**
 * "Partial" entity with optional trackable properties.
 */
export interface PartialTrackableEntity {
    deleted_at?: DateTime | null;
    created_at?: DateTime;
    updated_at?: DateTime;
}
/**
 * Common properties for Entities Viserion Responses.
 */
export interface BaseEntity<Identifier> extends IdentifiableEntity<Identifier>, TrackableEntity {
}
export interface PartialBaseEntity<Identifier> extends IdentifiableEntity<Identifier>, PartialTrackableEntity {
}
/**
 * Entities in Viserion that are Lockable
 */
export interface LockableBaseEntity<Identifier> extends BaseEntity<Identifier> {
    lock_version: integer;
    schema_version?: 'v2';
}
export interface PartialLockableBaseEntity<Identifier> extends PartialBaseEntity<Identifier> {
    lock_version?: integer;
}
export declare type OrganisationId = integer;
export interface Organisation extends LockableBaseEntity<OrganisationId> {
    is_internal?: boolean;
    name: string;
    websites?: Website[];
}
export interface Address {
    name: string;
    address: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    [key: string]: string;
}
/**
 * Describes the action that created the entity version.
 */
export declare enum EntityVersionStatus {
    CREATED = 0,
    UPDATED = 1,
    DELETED = 2
}
/**
 * Interface for entity version returned as payload.
 */
export interface EntityVersion<DocumentType> {
    entity_id: integer;
    /**
     * Current entity version.
     */
    entity_version: integer;
    /**
     * The type of update applied on the entity.
     */
    entity_status: EntityVersionStatus;
    /**
     * The document that was updated.
     */
    state: DocumentType;
    /**
     * The time of the update.
     */
    updated_at: DateString;
    /**
     * Details of the user that created the version.
     */
    updated_by: {
        id: string;
        uid: string;
        email: string;
    };
}
export declare type FontType = 'otf' | 'ttf' | 'woff' | 'woff2';
/**
 * Interface for the font configuration files.
 * Each instance of this type maps to a font file in S3.
 * The intent of this is to have a reference from the font config to the actual file that should be
 * served and also keep some additional info on the file.
 */
export interface FontFile {
    /**
     * URL from which the font should be served.
     */
    url: uri;
    /**
     * Original name of the file before it gets uploaded to S3.
     */
    originalFileName: string;
    /**
     * Format of the font
     */
    type: FontType;
}
/**
 * Interface for the font configuration.
 * Each instance of this type maps to a custom font in the website.
 * The intent of this is to allow users to upload their own custom fonts into the platform.
 */
export interface FontConfiguration {
    /**
     * Human readable name for the font.
     */
    name: string;
    /**
     * Name that should be used internally as an identifier
     */
    cssName: string;
    /**
     * Array of font file configuration to allow multiple formats to be supported
     */
    files: FontFile[];
    /**
     * Font fallback in case the font is not supported, or the file can't be retrieved
     * @deprecated to be removed soon. Campaigns with a missing font or fonts that fail
     * to load should not trigger.
     */
    fallbackFont?: string;
    createdAt?: DateTime;
}
export declare type WebsiteId = integer;
export declare type CustomCodeBundleState = 'enabled' | 'testing' | 'disabled';
export interface ScrapeConfiguration {
    basicVariables: BasicScrape[];
    currencyMapping: CurrencyScrape;
    repeatedItems: RepeatedItemScrape[];
    pageTypes: PageTypeScrape[];
    autoApplyConfigurations: AutoApplyConfig[];
}
export declare type CampaignConfiguration = Campaign | EmailCampaign;
export interface AccessibilityHistory {
    /**
     * The user that made the change
     */
    user: string;
    /**
     * When was the change applied
     */
    timestamp: DateString;
    /**
     * The value the accessibility checks was set to
     */
    value: boolean;
}
export interface WebsiteAccessibilityOptions {
    /**
     * Dictates whether the website should run Accessibility validations.
     * @default false
     */
    active: boolean;
    /**
     * Contains the history of this property
     */
    history: AccessibilityHistory[];
}
export interface PCLOverrideAction {
    /** The user that made the change */
    user: string;
    /** When was the change applied */
    timestamp: DateString;
    /** The value the overridden PCL was set to */
    value: number | null;
}
export interface PCLOverride {
    /** The overridden PCL value in days */
    pcl: number | null;
    /** History of changes to the overridden PCL value */
    history: PCLOverrideAction[];
}
export interface Website extends LockableBaseEntity<WebsiteId> {
    name: string;
    organization_id: OrganisationId;
    domain: string;
    cookie_domain?: domain;
    uuid: uuid;
    currencies: Currency;
    campaigns?: CampaignConfiguration[];
    organization?: Organisation;
    /**
     * If the tag should be activated on the site or not.
     * @default true
     */
    tag_active: boolean;
    /** Timezone string in the standard timezone format e.g. "Europe/London" */
    timezone: string;
    business_address?: Address;
    frequency_cap_duration?: number;
    exit_intent_delay_ms?: number;
    ga_integration?: boolean;
    ga_tracker_names?: string[];
    identityUrl?: string;
    /**
     * If we should bundle custom code with the tag or not
     * @default 'disabled'
     */
    enable_custom_code_bundle?: CustomCodeBundleState;
    feature_flags: FeatureFlags;
    custom_fonts?: FontConfiguration[];
    custom_inputs?: string[];
    custom_validation_rules?: WebsiteValidationRule[];
    scrapeConfiguration: ScrapeConfiguration;
    outlierFiltering?: boolean;
    performanceIndicators?: PerformanceIndicator[];
    /**
     * Used to enable campaign refresh/close on URL fragment change (i.e. part following the hash #)
     *
     * true - will consider the full url (incl. hash parameters)
     * false - will consider url change up to the hash
     */
    refreshCampaignsViaUrlHash?: boolean;
    accessibility?: WebsiteAccessibilityOptions;
    pclOverride?: PCLOverride;
}
export interface PerformanceIndicator {
    id: GoalId;
    name: string;
    created_at: DateTime;
    updated_at?: DateTime;
    deleted_at?: DateTime;
    description?: string;
    results: 'includes' | 'excludes';
    userGroups?: UserGroups.Web[];
    state: 'paused' | 'live' | 'deleted';
    value: number | null;
    version: number;
}
export declare type NoteId = integer;
/**
 * Inspired by
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/quill/index.d.ts#L23
 */
export declare type Op = {
    attributes?: {
        [key: string]: string | number | boolean;
    };
    insert?: any;
    delete?: number;
    retain?: number;
};
export interface QuillDelta {
    ops: Op[];
}
export interface Note extends LockableBaseEntity<NoteId> {
    websiteId: integer;
    content: QuillDelta;
}
export interface WebsiteValidationRule {
    name: string;
    id: uuid;
    regex: string;
}
export declare const AVAILABLE_FEATURE_FLAGS: readonly ["A11Y_TOGGLE", "ACCOUNT_INTEGRATIONS", "ACCOUNT_SETTINGS", "ACCOUNT_SETTINGS_FONTS", "ACCOUNT_SELECT_PAGE_V2", "ADD_REMOVE_OVERLAY_ELEMENTS", "ADVANCED_COMPONENT_LOGGING", "ADVANCED_COMPONENT_RENDERING", "ADVANCED_OVERLAY_ELEMENTS", "ANALYTICS_PAGE_TYPES", "ANIMATE_IN_CAMPAIGN", "AUDIT_LOG", "AUTH0", "BANNER_FORCED_Z_INDEX", "BANNER_FORMAT", "BERIC_METRICS", "BORDER_RADIUS", "CAMPAIGN_AUDIT_LOG", "CAMPAIGN_CLONE", "CAMPAIGN_CREDITS", "CAMPAIGN_PRIORITY", "CAMPAIGN_SETTINGS_V2", "CAMPAIGN_TEST_MODE", "CART_ABANDONMENT_EMAIL", "CLICK_ADDITIONAL_ACTION", "CLICK_TO_CALL", "CLICK_TRIGGER", "CLOSE_USER_GROUPS", "CNAME_CLOAKING", "CONFIGURABLE_CHECKBOX", "CONFIGURABLE_FREQ_CAPPING", "CONFIG_INC_SPLIT", "COPY_PASTE_STAGE", "COUNT_AS_CLICK", "CROSS_SESSION_VARIABLES", "CTA_OPEN_TAB", "CUSTOM_BRANDED_FONTS", "CUSTOM_CHANNEL_VARIABLES", "CUSTOM_CHECKBOX", "CUSTOM_CLOSE_BUTTON_ELEMENT", "CUSTOM_CODE_BUNDLE", "CUSTOM_INPUT", "CUSTOM_MAPPING", "CUSTOM_NOTIFICATION_MARGIN", "CUSTOM_TARGETING", "CUSTOM_VALIDATION_MESSAGES", "CUSTOM_VALIDATION_REGEX", "DASHBOARD_V2", "DATA_LAYER_TARGETING", "DAY_OF_WEEK_TARGETING", "DEV", "DEVICE_CONTEXT", "DOUBLE_OVERLAY", "DROPDOWN_MENUS", "DYNAMIC_COUPONS", "DYNAMIC_CTA_LINKS", "DYNAMIC_TEXT_COMPONENT", "ELEMENT_LAYERING", "EMAIL_CODE_EDITOR", "EMAIL_DRIPS", "EMAIL_SCRAPING", "EMAIL_STANDALONE", "EMAIL_USER_GROUPS", "EMBEDDED_LOOKER", "ENHANCED_PAGE_TYPES", "ESP_INTEGRATIONS", "EXPANDABLE_BOTTOM_BAR", "EXPRESSION_EDITOR", "EXTERNAL_SCRAPE_HOOKS", "FEATURE_FLAG_API", "FLOATING_BUTTON", "FORCED_Z_INDEX", "FULLSCREEN_OVERLAY", "FULL_WIDTH_EMBEDDED", "GA_INTEGRATION", "GA_TRACKER_NAMES", "GDPR_AUTOMATION", "GDPR_EMAIL", "GET_RESPONSE", "GOAL_BASED_CAMPAIGNS", "GTE_LTE_TARGETING", "HOVER_TRIGGER", "IMAGE_COMPONENT", "INACTIVITY_TRIGGER", "INCREMENTALITY_DISPLAY_V2", "INLINE_TEXT_STYLING", "INLINE_TEXT_STYLING_V2", "INPUT_LABELS", "INTERNAL_MFA", "IN_PAGE_CAMPAIGN", "KLAVIYO_INTEGRATION", "LEAD_GEN", "LEAD_GEN_CHECKBOX", "LIST_TARGETING", "LOGIN_PAGE_V2", "MAINTENANCE_MODE", "MAPPING_ANALYTICS", "MOVABLE_CLOSE_BUTTON", "MULTI_CTA", "MULTI_CURRENCY", "MULTI_CURRENCY_LITE", "MULTI_FORM_FIELDS", "MULTI_STAGE_CAMPAIGN", "NOTIFICATION", "NO_ACTION_CTA", "NUMBER_OF_PAGES_VISITED", "NUMBER_OF_PAGES_VISITED_BY_URL", "ON_PAGE_CAMPAIGN", "ORG_SELECT_V3", "OUTLIER_FILTERING", "PRODUCT_HISTORY_TARGETING", "PURCHASE_CYCLE_ATTRIBUTION", "RADIO_BUTTONS", "REMOVE_CLOSE_BUTTON", "REPEATED_ITEM_MAPPING", "RESUMABLE_EXPERIMENTS", "SANDBOX_WEB_COMPONENT", "SCHEDULE_EXPERIMENT", "SCROLL_TO_ELEMENT_TRIGGER", "SELF_CLOSING_NOTIFICATIONS", "SEND_TO_COLLECTORS", "SOCIAL_PROOF", "SPA_SUPPORT", "STRETCH_AND_SAVE", "TARGET_GEO_LOCATION", "TARGET_HAS_PURCHASED", "TARGET_IS_LEAD", "TARGET_REFERRER_URL", "TARGET_SESSION_COUNT", "TARGET_STRING_REGEX", "TARGET_TIME_ON_SITE", "TARGET_VISITED_URL", "TEMPLATES_PAGE_V2", "TEMPLATES_PAGE_V3", "TIME_OF_DAY_TARGETING", "TOAST_NOTIFICATIONS", "TOP_LEVEL_BERIC_METRICS", "UNENCODED_PAGE_URL", "USER_CREATED_TEMPLATES", "VARIANT_TARGETING", "WEBSITE_MAPPING", "WEB_USER_GROUPS", "X_WEBSITE_CAMPAIGN_COPYING"];
export declare type FeatureFlag = typeof AVAILABLE_FEATURE_FLAGS[number];
export declare type FeatureFlags = FeatureFlag[];
export declare type CampaignType = 'Core' | 'Promotional' | 'UseCase' | 'External' | 'Other';
export declare type CampaignCategory = 'LeadCapture' | 'EmailRemarketing' | 'SocialProof' | 'Abandonment' | 'Testimonial' | 'USP/ValueProposition' | 'TrafficShaping' | 'UpsellCampaigns' | 'Other';
export declare type CampaignCappingBehaviour = 'Uncapped' | 'Format' | 'Campaign' | 'Persistent';
export declare type CampaignState = 'deleted' | 'live' | 'paused' | 'scheduled';
export declare type CampaignGoal = 'CaptureEmailAddresses' | 'ImproveUserJourney' | 'IncreaseConversions' | 'IncreaseCustomerValue' | 'Other' | 'UserTemplate';
export declare type DefaultMetricType = 'impressions' | 'ctr' | 'clicks' | 'sales' | 'revenue' | 'form_submits' | 'download' | 'leads' | 'revenue-uplift' | 'sales-uplift' | 'users' | 'confidence';
export declare type CampaignId = integer;
export interface Campaign extends LockableBaseEntity<CampaignId> {
    website_id: WebsiteId;
    name: string;
    type: string;
    template_id: TemplateId;
    campaign_revision_id?: RevisionId;
    count_as_credit?: boolean;
    state: CampaignState;
    start_at: DateTime;
    end_at: DateTime | null;
    campaign_type?: CampaignType;
    category?: CampaignCategory;
    goal?: CampaignGoal;
    default_metric?: DefaultMetricType;
    capping_behaviour?: CampaignCappingBehaviour;
    testing_mode?: boolean;
    revision?: Revision;
    website?: Website;
    experiments?: Experiment[];
    all_experiments?: Experiment[];
    performance_indicator_ids?: GoalId[];
    is_scheduled?: boolean;
}
export interface EmailCampaign extends LockableBaseEntity<CampaignId> {
    website_id: WebsiteId;
    name: string;
    type: 'EmailCampaign';
    campaign_type?: CampaignType;
    category?: CampaignCategory;
    count_as_credit?: boolean;
    template_id: TemplateId;
    state: CampaignState;
    start_at: DateTime;
    end_at: DateTime | null;
    specs: EmailSpec;
    is_scheduled?: boolean;
}
export declare type TemplateCategory = 'conversionRate' | 'averageOrderValue' | 'lifetimeValue' | 'leadGeneration' | 'custom' | 'devOnly' | 'notification' | 'doubleOverlay' | 'expandableBottomBar' | 'floatingButton' | 'socialProof' | 'stretchAndSave' | 'onPage' | 'inPage' | 'banner' | 'standaloneEmail';
export declare type TemplateId = integer;
export declare type TemplateCampaignType = 'SingleOverlay' | 'DoubleOverlay';
export declare type TemplateType = 'onPage' | 'inPage' | 'email' | 'custom';
export declare type TemplateContent = 'default' | 'blank' | 'custom' | 'dev';
export interface Template extends LockableBaseEntity<TemplateId> {
    website_id?: number;
    name: string;
    description: string;
    specs: WebSpec;
    category?: TemplateCategory;
    icon_url?: string;
    preview_url: string;
    animation_url?: string;
    campaign_type?: TemplateCampaignType;
    capping_behaviour?: CampaignCappingBehaviour;
    goals?: CampaignGoal[];
    templateType?: TemplateType;
    contentType?: TemplateContent;
}
export interface EmailTemplate extends LockableBaseEntity<TemplateId> {
    website_id?: number;
    name: string;
    description: string;
    type: 'EmailCampaign';
    specs: EmailSpec;
    category?: TemplateCategory;
    icon_url?: string;
    preview_url: string;
    goals?: CampaignGoal[];
    templateType?: 'email';
    contentType?: TemplateContent;
}
export declare type BlankTemplatesMap = Record<OverlayFormat, Template>;
export interface RedirectSettings {
    url: uri;
}
export declare type TriggerType = 'Timer' | 'ExitIntent' | 'ScrollToElement' | 'Inactivity' | 'Click' | 'Hover';
export declare type TriggerId = integer;
export interface TriggerBase {
    type: TriggerType;
    settings: any;
}
export interface TimerTriggerSettings {
    time: number;
    unit: 'seconds';
}
export interface TimerTrigger extends TriggerBase {
    type: 'Timer';
    settings: TimerTriggerSettings;
}
export interface ExitIntentTriggerSettings {
}
export interface ExitIntentTrigger extends TriggerBase {
    type: 'ExitIntent';
    settings: ExitIntentTriggerSettings;
}
export declare type PageElementId = integer;
export interface ScrollToElementTriggerSettings {
    selector: string;
}
export interface ScrollToElementTrigger extends TriggerBase {
    type: 'ScrollToElement';
    settings: ScrollToElementTriggerSettings;
}
export interface InactivityTriggerSettings {
    seconds: integer;
}
export interface InactivityTrigger extends TriggerBase {
    type: 'Inactivity';
    settings: InactivityTriggerSettings;
}
export interface ClickTriggerSettings {
    selector: string;
}
export interface ClickTrigger extends TriggerBase {
    type: 'Click';
    settings: ClickTriggerSettings;
}
export interface HoverTriggerSettings {
    selector: string;
}
export interface HoverTrigger extends TriggerBase {
    type: 'Hover';
    settings: HoverTriggerSettings;
}
export declare type Trigger = TimerTrigger | ExitIntentTrigger | ScrollToElementTrigger | InactivityTrigger | ClickTrigger | HoverTrigger;
export declare type ExperimentId = integer;
/**
 * An Experiment represents a A/B/N test.
 *
 * All users that arrive on the website are 'split' into one of potentially
 * many buckets. The user journey customisation applied to users in a given
 * split will be different to those in a competing Split. The users actions
 * will be recorded and statistically analysed to show which Split is causing
 * more users to exhibit the desired goal of the experiment.
 *
 * Example (incrementality use-case):
 *  Hypothesis:
 *    Showing users this Campaign will lead to increased sales.
 *  Setup:
 *    - Users in Split 1 are shown an Overlay.
 *    - Users in Split 2 are not shown an Overlay (control group).
 *  Result:
 *    We observe a statistically significant increase in users making
 *    purchases in Split 1 than those in Split 2.
 *
 *  => We conclude that showing a user this Campaign increases the likelihood
 *     of them making a purchase.
 */
export interface Experiment extends LockableBaseEntity<ExperimentId> {
    /**
     * The Campaign that this experiment is running on.
     */
    campaign_id: CampaignId;
    /**
     * The time & date at which this Experiment was started.
     *
     * This time will always be in the past, since it records the moment that
     * the experiment went live and it is not possible to schedule an
     * experiment to start.
     */
    started_at: DateTime | null;
    /**
     * The time & date at which this Experiment ended.
     *
     * This time will always be in the past, if set, as it's also not possible
     * to schedule an experiment to end since we don't know how long it will
     * take for the result to reach statistical significance.
     *
     * If an experiment is currently running, `ended_at` will be `null`.
     */
    ended_at: DateTime | null;
    /**
     * Version 4 UUID.
     * Used for randomising the assignment of users to Splits.
     */
    uuid: uuid;
    /**
     * The traffic Splits associated with the Experiment.
     */
    splits: Split[];
    /**
     * A flag to distinguish testing and real experiments.
     */
    test: boolean;
    /**
     * A key to group experiments into buckets
     */
    bucketing_key: uuid;
}
export declare type SplitId = integer;
export interface SplitState {
    hasBeenLaunched: boolean;
    isDeleted: boolean;
}
/**
 * A Split corresponds to a portion of traffic for whom it is possible to
 * customise the user journey. For a given Experiment, a user will be in
 *  _one_ Split and will stay in the same Split for the duration of the Experiment.
 */
export interface Split {
    id: SplitId;
    /**
     * The weight of the Split determines the proportion of users assigned to
     * it. It is an arbitrary number and defines the proportion relative to the
     * total weight all the Splits in the Experiment.
     * When weight is not defined, we expect the default to be equal weights (50-50)
     */
    weight?: number;
    /**
     * The type of the Split, used to identify different splits on A/B testing, or
     * the control vs actual split in incrementality tests
     */
    split_type: SplitType;
    /**
     * The state of the specified split type. Tells if the split is part of an experiment
     * which has already launched, and also if it has been deleted.
     */
    state: SplitState;
}
export declare type RevisionId = integer;
export interface Revision {
    id?: RevisionId;
    lock_version?: integer;
    schema_version?: 'v2';
    deleted_at?: DateTime | null;
    created_at?: DateTime;
    updated_at?: DateTime;
    campaign_id?: CampaignId;
    images?: Image[];
    specs: WebSpec;
}
export declare type ImageId = integer;
export interface Image extends BaseEntity<ImageId> {
    imageable_id: RevisionId;
    imageable_type: 'CampaignRevision';
    url: uri;
    step: integer;
    device: DeviceType;
}
/**
 * Split types should be unique in a single experiment, if this value is control then the Tag
 * will treat the split as a control group. Any other value designated by a single letter,
 * will be treated like another variant.
 *
 * Examples: "a", "b", "n"
 */
export declare type ControlSplitType = 'control';
/**
 * @pattern ^[a-z]+$
 */
export declare type Variant = string;
export declare type SplitType = Variant | ControlSplitType;
export declare type AnimationName = 'fade-in' | 'fade-in-top' | 'fade-in-bottom' | 'fade-in-left' | 'fade-in-right' | 'scale-in' | 'slide-in-blurred-top' | 'slide-in-blurred-bottom' | 'slide-in-blurred-left' | 'slide-in-blurred-right' | 'slide-in-elliptic-top-fwd';
export interface AnimationSettings {
    name: AnimationName;
    duration?: number;
    timingFunc?: string;
}
/**
 * Configuration for retargetting emails.
 */
export interface EmailConfiguration {
    /** Delay between the user abandoning the cart and the email being sent */
    triggerDelay: number;
    /** Path to template in the S3 bucket */
    templatePath: string;
    /** Subject to show on the email */
    emailSubject: string;
    senderName: string;
    /** Allow empty strings to account for newly created campaigns */
    senderEmail: email | '';
    /** Required static basket fields */
    staticRequiredVariables?: string[];
    /** Required fields per basket item */
    itemRequiredVariables?: string[];
    /** URL at which a preview image of the email can be found. */
    previewUrl: string;
}
/**
 * Represents a group of creatives, and metadata about when it should be
 * used.
 */
export interface CreativeGroup {
    /**
     * Type of device that this creative is intended for. Practically only 'desktop' and 'mobile'
     * are used, and when presenting on a 'tablet' the 'desktop' creative should be used.
     */
    device: DeviceType;
    /** Experiment split that this creative belongs to. */
    splitType?: Variant;
    /** Overlay settings belonging to this device/splitType */
    stages: OverlaySettings[];
}
export interface CreativeType {
    /**
     * Type of device that this creative is intended for. Practically only 'desktop' and 'mobile'
     * are used, and when presenting on a 'tablet' the 'desktop' creative should be used.
     */
    device: DeviceType;
    /** Experiment split that this creative belongs to. */
    splitType?: Variant;
    /** Zero-indexed display order for this creative relative to other creatives. */
    displayOrder: integer;
}
export interface BaseSpec {
    type?: 'web' | 'email';
}
export interface Spec extends BaseSpec {
    type?: 'web';
    creativeGroups: CreativeGroup[];
    /**
     * Dictates the order in which the campaigns should be triggered.
     * Currently only 0 or 1 values are being generated by the UI:
     * 0 = Lowest priority
     * 1 = Highest priority
     * If undefined 0 is assumed.
     */
    priority?: integer;
    userGroups?: UserGroups.Web[];
    closingGroups?: UserGroups.Web[];
}
/**
 * Alias for the Spec interface so we don't have to rename everything now
 *
 * @deprecated To be removed soon
 */
export declare type WebSpec = Spec;
export declare type EmailSource = 'scraped' | 'lead-gen';
export interface EmailSpec extends BaseSpec {
    type?: 'email';
    emailConfiguration: EmailConfiguration[];
    emailSources: EmailSource[];
    userGroups?: UserGroups.Email[];
}
export declare type OverlayFormat = 'Overlay' | 'Notification' | 'Popover' | 'Banner' | 'InPage';
export declare type ReadOrder = 'default' | 'top-left' | 'top-right';
export interface OverlaySettings {
    /**
     * HTML contents of the overlay.
     * Currently generated by the UI using this settings object.
     */
    body?: string;
    /**
     * URL at which a preview image of this overlay can be found.
     */
    previewUrl: string;
    /**
     * The visual 'format' of this overlay.
     *
     * Examples:
     *  - Overlay: A one-time, triggered format that 'takes control' of the user journey by
     *    covering the whole screen with a semi-transparent background behind it.
     *  - Notification: A small overlay that can be positioned around the page.
     *  - Popover: An overlay that is anchored to an element of the page to add information.
     *  - Banner: An in-page element that can be positioned at the top or bottom of the page
     *    taking all the width.
     */
    format: OverlayFormat;
    /**
     * The elements that make up the contents of the overlay.
     *
     * Examples:
     *  - CTA button (e.g. "Continue shopping!")
     *  - A Form that includes text inputs etc.
     *  - Text elements
     */
    overlayElements: OverlayElement[];
    /**
     * Configuration options for the close button that the Tag adds to the Overlay.
     * If undefined, the close button is disabled/hidden when the creative is displayed on the site
     */
    closeButton?: CloseButtonConfiguration;
    /**
     * The actual dimensions of this Overlay in device-independent pixels.
     *
     * TODO(will/zak): this should really be of type `Dimensions`.
     */
    dimensions: DimensionsPixels;
    /**
     * The dimensions to use when calculating a scaling factor for the Overlay,
     * based upon the size of the viewport (to ensure it fits). If unspecified,
     * the actual `dimensions` will be used.
     *
     * Example usage:
     * When there are multiple related Overlays of different dimensions that
     * all want to be scaled by the same factor so they stay the same size
     * relative to each other. In this case, you would specify the greatest
     * width / height of all the overlays to ensure that they will all fit
     * within the bounds of the display.
     */
    effectiveScalingDimensions?: Dimensions;
    /**
     * Deprecated for removal in YLD-11786
     */
    hasBackdrop?: boolean;
    /**
     * Defines the margin (in pixels) to be rendered around in page campaigns.
     * Should remain `undefined` for other formats than `InPage`
     *
     * @default { type 'CustomMargin', top: 0, bottom: 0, left: 0, right: 0 }
     */
    marginInPage?: MarginInPageConfig;
    /**
     * Defines the margin (in pixels) to be rendered around a notification's horizontal
     * and vertical sides, independently.
     *
     * Currently only supported for notification format overlays. Should remain
     * `undefined` for `format: 'Overlay'` creatives.
     *
     * @default { horizontal: 15, vertical: 15 }
     */
    margin?: MarginConfig;
    /**
     * Where on the screen the overlay should be fixed, relative to the bounds
     * of the device's viewport.
     * For 'Banner' format, it indicates where the banner is going to be positioned,
     * 'Top' or 'Bottom'
     *
     * @default Centre
     */
    position?: Position;
    anchorSettings?: AnchorSettings;
    insertionSettings?: InsertionSettings;
    /**
     * Entrance animation for overlay. If undefined no animation effects will show on entrance
     *
     * @default undefined
     */
    enterAnimation?: AnimationSettings;
    /**
     * Accessibility properties for the overlay
     *
     * @default undefined
     */
    accessibility?: AccessibilitySettings;
    /**
     * Background settings is only available for full-width embedded campaigns. It
     * defines properties of the iframe wrapper.
     *
     * @default undefined
     */
    wrapperSettings?: WrapperSettings;
    /**
     * Force override the z-index on the overlay.
     *
     * @default undefined
     */
    zIndex?: number;
}
export interface AccessibilitySettings {
    /**
     * Attaches an accessibility label to the overlay for assisting screen readers.
     */
    ariaLabel?: string;
    /**
     * Sets the overlay to use browser default focus styles for focusable elements.
     */
    defaultFocusStyles?: boolean;
    /**
     * The criteria based on which the overlay elements will be ordered when rendered in the DOM.
     * default/missing - do not sort, render in the order in which the items are found
     * top-left - sort based on the position, main criteria: "top", secondary criteria "left"
     * top-right - sort based on the position, main criteria: "top", secondary criteria "right"
     */
    readOrder?: ReadOrder;
}
export interface AnchorSettings {
    domSelector: string;
    domAnchor: Position;
    overlayAnchor: Position;
    offsetX: number;
    offsetY: number;
}
/**
 * Configuration for the iframe wrapper of a full-width embedded campaign.
 */
export interface WrapperSettings {
    expand: boolean;
    fullscreen?: boolean;
}
export declare type InsertionPosition = 'FirstChild' | 'LastChild' | 'Before' | 'After';
export interface InsertionSettings {
    domSelector: string;
    position: InsertionPosition;
}
export interface DimensionsPixels {
    width: string;
    height: string;
}
/**
 * Close button config for customizing position, style, etc. of creative close button
 */
export interface CloseButtonConfiguration {
    position: PositionOffsetTopRight;
}
export interface PositionOffsetTopRight {
    top: integer;
    right: integer;
}
export interface MarginConfig {
    /**
     * Margin in pixels to be applied to both horizontal sides of a CSS box.
     */
    horizontal: number;
    /**
     * Margin in pixels to be applied to both vertical sides of a CSS box.
     */
    vertical: number;
}
export declare type MarginInPageConfig = HorizontallyCenteredMargin | CustomMargin;
export interface HorizontallyCenteredMargin {
    type: 'HorizontallyCenteredMargin';
    top: number;
    bottom: number;
}
export interface CustomMargin {
    type: 'CustomMargin';
    top: number;
    bottom: number;
    left: number;
    right: number;
}
/**
 * Defines a position within some box area.
 */
export declare type Position = 'Centre' | 'Top' | 'TopRight' | 'Right' | 'BottomRight' | 'Bottom' | 'BottomLeft' | 'Left' | 'TopLeft';
export declare type ElementType = 'body' | 'cta' | 'input' | 'dropdown' | 'text' | 'form' | 'coupon' | 'advanced-component' | 'dynamic-coupon' | 'checkbox' | 'checkbox-group' | 'radio-group' | 'validation-message' | 'image' | 'rich-text' | 'close-button' | 'custom-close-button';
export interface OverlayElementBase {
    id: string;
    type: ElementType;
    zIndex?: number;
}
export interface ContentElement extends OverlayElementBase {
    text?: string | StringLikeExpression;
}
export interface PositionedOverlayElementBase {
    position: PositionOffset;
    dimensions: Dimensions;
}
export declare type OverlayElementAlignment = 'none' | 'left' | 'center' | 'right';
export declare type BorderRadiusUnit = 'px' | '%';
export interface CustomBorderRadius {
    topRight: number;
    topLeft: number;
    bottomRight: number;
    bottomLeft: number;
    unit: BorderRadiusUnit;
}
export interface StyledContentBase {
    color: string;
    placeholderColor?: string;
    fontSize: number;
    fontStyle: string;
    textAlign: string;
    fontFamily: string;
    fontWeight: string;
    textDecoration: string;
    lineHeight?: string;
}
export interface StyledBlockBase {
    borderSize: number;
    borderColor: string;
    backgroundColor: string;
    backgroundImage?: string;
    borderRadius?: CustomBorderRadius;
    alignment?: OverlayElementAlignment;
}
export interface StyledOverlayElementBase extends StyledContentBase, StyledBlockBase, PositionedOverlayElementBase {
}
export interface PositionOffset {
    top: number;
    left: number;
}
export interface Dimensions {
    width: number;
    height: number;
}
export declare type CtaAdditionalActionType = 'custom' | 'click-on-element';
export interface BaseAdditionalAction {
    type: CtaAdditionalActionType;
    target: string;
}
export declare type CtaClickType = 'redirect' | 'next' | 'dismiss' | 'new-tab' | 'click-to-call' | 'dep-redirect' | 'no-action';
export interface BaseCtaClick {
    type: CtaClickType;
    name?: string;
    countAsClick: boolean;
    additionalAction?: BaseAdditionalAction;
}
export interface RetargetingCtaClick {
    /**
     * If present, it contains all the configuration necessary for doing email retargeting via
     * the Y1 email service. If undefined, the element is not part of an email retargeting campaign.
     */
    y1Retargeting?: {
        y1CampaignId: integer;
    };
    /**
     * If present, it contains the id of the attached standalone email campaign.
     * If undefined, the element is not part of an email retargeting campaign.
     */
    standaloneRetargeting?: {
        emailCampaignId: integer;
    };
}
/**
 * Redirect the user to the given URI.
 */
export interface CtaClickRedirect extends BaseCtaClick, RetargetingCtaClick {
    type: 'redirect';
    target: uri | string;
    /**
     * Configure handling of the variable substring, "{{page.url}}" when it appears inside the
     * `target` parameter. `{{page.url}}` is replaced with the current page's url from which the
     * redirect takes place.
     * If omitted entirely, the default is { encoded: true, query: {} }
     */
    pageUrl?: {
        /**
         * Whether to encode the current url such that it is suitable to be used as a query parameter
         * in another url.
         */
        encoded: boolean;
        /**
         * Extra query parameters to be added to {{page.url}}.
         * The parameters are made url safe before injecting into the target url.
         * Using vanilla Dictionary definition since the schema generation util has a bug
         * with generics
         */
        query: {
            [key: string]: string;
        };
    };
}
export interface CtaClickDepRedirect extends BaseCtaClick, RetargetingCtaClick {
    type: 'dep-redirect';
    variableTarget: string;
}
/**
 * Next action simply closes the current overlay. When this action is called, the tag will
 * also trigger any following Overlays
 */
export interface CtaClickNext extends BaseCtaClick, RetargetingCtaClick {
    type: 'next';
}
/**
 * Dismiss action - closes the current overlay. No further overlays are triggered by it.
 */
export interface CtaClickDismiss extends BaseCtaClick, RetargetingCtaClick {
    type: 'dismiss';
}
export interface CtaClickNewTab extends BaseCtaClick {
    type: 'new-tab';
    target: uri | string;
}
/**
 * Click-to-call: the overlay stays open and the configured number is called.
 */
export interface CtaClickCall extends BaseCtaClick {
    type: 'click-to-call';
    /**
     * The phone number to be called. Accepted format: +1234566788. We do allow '-'
     * to be used as separator anywhere. Eg: +44-1231-3412343 is a valid number.
     */
    target: phoneNumber;
}
/**
 * No action - Dispatches a click event to be used by Wildfire hooks
 */
export interface CtaClickNoAction extends BaseCtaClick, RetargetingCtaClick {
    type: 'no-action';
    additionalAction: BaseAdditionalAction;
}
export declare type CtaClick = CtaClickRedirect | CtaClickDepRedirect | CtaClickDismiss | CtaClickNext | CtaClickNewTab | CtaClickCall | CtaClickNoAction;
export interface OverlayElementGroup extends OverlayElementBase {
    children: OverlayElement[];
}
export interface BodyElementBase extends ContentElement {
    type: 'body';
}
export declare type BodyElement = BodyElementBase & StyledOverlayElementBase;
/**
 * CTA is an actionable button on an overlay. It can trigger the tag to handle actions based
 * on the onClick definition
 */
export interface CTAElementBase extends ContentElement {
    type: 'cta';
    onClick: CtaClick;
    ariaLabel?: string;
}
export declare type CTAElement = CTAElementBase & StyledOverlayElementBase;
export interface FormElement extends OverlayElementGroup {
    type: 'form';
}
export interface InputLabelBase {
    /**
     * Defined when the text element is used as a label for an input.
     * Represents the id of the input.
     * This link helps render ADA compliant forms.
     */
    labeledInputId?: string;
}
export interface TextElementBase extends ContentElement, InputLabelBase {
    type: 'text';
}
export declare type TextElement = TextElementBase & StyledOverlayElementBase;
export interface RichTextElementBase extends OverlayElementBase, InputLabelBase {
    type: 'rich-text';
    text: QuillDelta;
    lineHeight?: string;
}
export declare type RichTextElement = RichTextElementBase & StyledBlockBase & PositionedOverlayElementBase;
export interface CouponElementBase extends ContentElement {
    type: 'coupon';
}
export declare type CouponElement = CouponElementBase & StyledOverlayElementBase;
export interface DynamicCouponElementBase extends OverlayElementBase {
    type: 'dynamic-coupon';
    couponListId: string;
}
export declare type DynamicCouponElement = DynamicCouponElementBase & StyledOverlayElementBase;
export interface ValidationMessageElementBase extends ContentElement {
    type: 'validation-message';
    elementId: string;
}
export declare type ValidationMessageElement = ValidationMessageElementBase & StyledOverlayElementBase;
export declare type ImageElement = ImageBaseElement & StyledOverlayElementBase;
export interface ImageBaseElement extends OverlayElementBase {
    type: 'image';
    altText?: string;
    src: uri;
}
export declare type DefaultInputElementName = 'email' | 'name' | 'first-name' | 'last-name' | 'phone' | 'postcode' | 'gender' | 'fax-number' | 'date-of-birth' | 'comments' | 'address-1' | 'address-2' | 'title' | 'reason-for-visit' | 'rating' | 'size' | 'day' | 'month' | 'year';
export declare type InputElementName = DefaultInputElementName | string;
export interface InputElementBase extends ContentElement {
    type: 'input';
    name: InputElementName;
    validationRules: ValidationRule[];
    placeholder?: string;
}
export declare type InputElement = InputElementBase & StyledOverlayElementBase;
export interface DropdownOption {
    label: string;
    value: string;
}
export interface DropdownElementBase extends ContentElement {
    type: 'dropdown';
    name: string;
    options: DropdownOption[];
    validationRules: ValidationRule[];
    placeholder?: string;
}
export declare type DropdownElement = DropdownElementBase & StyledOverlayElementBase;
export interface CheckableOption {
    label: string;
    value: string;
}
export interface RadioGroupElementBase extends ContentElement {
    type: 'radio-group';
    name: string;
    options: CheckableOption[];
    columns: number;
    validationRules: RequiredValidationRule[];
    /**
     * Defines the size for the radio elements.
     * Defaults are mapped to 'small': 12, 'medium': 20, 'large': 30
     * @default 20
     *
     */
    size: number;
}
export declare type RadioGroupElement = RadioGroupElementBase & StyledOverlayElementBase;
export interface CheckboxGroupElementBase extends ContentElement {
    type: 'checkbox-group';
    name: string;
    options: CheckableOption[];
    columns: number;
    validationRules: CheckboxGroupValidationRule[];
    /**
     * Defines the size for the checkbox elements.
     * Defaults are mapped to 'small': 12, 'medium': 20, 'large': 30
     * @default 20
     *
     */
    size: number;
}
export declare type CheckboxGroupElement = CheckboxGroupElementBase & StyledOverlayElementBase;
export declare type OptInCheckboxElementName = 'opt-in-checkbox';
export interface OptInCheckboxElementBase extends ContentElement {
    type: 'checkbox';
    name: OptInCheckboxElementName;
    validationRules: CheckedValidationRule[];
    /**
     * Defines the size for the checkbox.
     * Defaults are mapped to 'small': 12, 'medium': 20, 'large': 30
     * @default 20
     *
     */
    size?: number;
}
export declare type OptInCheckboxElement = OptInCheckboxElementBase & StyledOverlayElementBase;
export interface AdvancedElementBase extends OverlayElementBase {
    type: 'advanced-component';
    name: string;
    parameters: any;
}
export declare type AdvancedElement = AdvancedElementBase & PositionedOverlayElementBase;
/**
 * The CustomCloseButtonElement can have two states:
 * 1. `Styled`
 * 2. `Image`
 *
 * `src` defines if the element is an `Image`. You should omit these properties
 * as they will not be used when rendering.
 */
export interface CustomCloseButtonElement extends OverlayElementBase, PositionedOverlayElementBase, StyledBlockBase {
    type: 'custom-close-button';
    shape?: 'square' | 'circle';
    dropShadow?: boolean;
    iconSize?: number;
    iconColor?: string;
    iconThickness?: number;
    src?: uri;
}
export declare type OverlayElement = BodyElement | CTAElement | TextElement | RichTextElement | CouponElement | InputElement | DropdownElement | RadioGroupElement | CheckboxGroupElement | FormElement | AdvancedElement | DynamicCouponElement | OptInCheckboxElement | ValidationMessageElement | ImageElement | CustomCloseButtonElement;
export declare type PositionedOverlayElement = BodyElement | CTAElement | TextElement | RichTextElement | CouponElement | InputElement | DropdownElement | RadioGroupElement | CheckboxGroupElement | AdvancedElement | DynamicCouponElement | OptInCheckboxElement | ValidationMessageElement | ImageElement | CustomCloseButtonElement;
export declare type StyledOverlayElement = BodyElement | CTAElement | TextElement | CouponElement | InputElement | DropdownElement | RadioGroupElement | CheckboxGroupElement | DynamicCouponElement | OptInCheckboxElement | ValidationMessageElement | ImageElement | CustomCloseButtonElement;
export declare type ValidationRuleType = 'required' | 'regex' | 'email' | 'checked' | 'at-least-selected' | 'exactly-selected' | 'at-most-selected' | 'custom-regex' | 'default-regex';
export interface ValidationRuleBase {
    type: ValidationRuleType;
    message?: string;
}
export interface ConstrainedValidationRule<Constraint> extends ValidationRuleBase {
    constraint: Constraint;
}
export interface RequiredValidationRule extends ValidationRuleBase {
    type: 'required';
}
/**
 * Validate that the checkbox is checked.
 * If present in a checkbox's validation rules, it will be invalid if the checkbox value is
 * not "true"
 */
export interface CheckedValidationRule extends ValidationRuleBase {
    type: 'checked';
}
/**
 * Validate that the number of elements checked are greater or equal than "elements".
 */
export interface AtLeastSelectedValidationRule extends ValidationRuleBase {
    type: 'at-least-selected';
    elements: number;
}
/**
 * Validate the input as a valid email address.
 */
export interface EmailValidationRule extends ValidationRuleBase {
    type: 'email';
}
/**
 * constraint is JSON encoded RegularExp without delimiters, eg [a-z]+@[a-z]+\\.[a-z]+
 */
export interface RegexValidationRule extends ConstrainedValidationRule<string> {
    type: 'regex';
}
/**
 * Validation rule to be used (stored in the gendry-validator-util package)
 */
export declare type DefaultValidationName = 'less-than-10' | 'less-than-30' | 'numbers-only' | 'letters-only' | 'phone-number' | 'uk-post-code' | 'us-post-code' | 'ca-post-code' | 'date-day-month-year' | 'slashed-date-day-month-year' | 'date-month-day-year' | 'slashed-date-month-day-year' | 'date-year-month-day' | 'slashed-date-year-month-day' | 'day' | 'month' | 'year' | 'email' | 'url';
export interface DefaultRegexValidationRule extends ValidationRuleBase {
    type: 'default-regex';
    rule: DefaultValidationName;
}
/**
 * Custom regex rule for inputs
 */
export interface CustomRegexValidationRule extends ValidationRuleBase {
    type: 'custom-regex';
    id: uuid;
}
export declare type CheckboxValidationRule = CheckedValidationRule;
export declare type CheckboxGroupValidationRule = RequiredValidationRule | AtLeastSelectedValidationRule;
export declare type InputValidationRule = RequiredValidationRule | RegexValidationRule | EmailValidationRule | CheckedValidationRule | AtLeastSelectedValidationRule | CustomRegexValidationRule | DefaultRegexValidationRule;
export declare type ValidationRule = CheckboxValidationRule | InputValidationRule;
/**
 * Interface for direct upload to S3 with signed request
 */
export interface S3AuthorizedUpload {
    policy: string;
    signature: string;
    key: string;
    domain: string;
    access_key_id: string;
    s3_post_url: string;
}
/** The file data needed for generating the S3 signed request */
export interface S3UploadFileDescription {
    file_name: string;
    content_type: string;
}
export * from './user/user';
/**
 * Set of url parameters coming password change redirects
 */
export interface SessionParamsBase {
    config?: string;
    expiry?: 'true' | 'false';
    reset_password?: 'true' | 'false';
    [key: string]: string | undefined;
}
export interface SessionParamsAccessToken extends SessionParamsBase {
    token: string;
    client_id: string;
    uid: string;
}
export interface SessionsParamsJwt extends SessionParamsBase {
    jwtToken: string;
}
export declare type SessionParams = SessionParamsAccessToken | SessionsParamsJwt;
export interface LegacyJwtHeader {
    /**
     * Algorithm used to encode/decode the token
     *
     * HS256 is the only algorithm K-API supports for now
     */
    alg: 'HS256';
    /**
     * Token type. In this case Json Web Token
     */
    typ: 'JWT';
}
export interface Auth0JwtHeader {
    /**
     * Algorithm used to encode/decode the token
     *
     * HS256 is the only algorithm K-API supports for now
     */
    alg: 'RS256';
    /**
     * Token type. In this case Json Web Token
     */
    typ: 'JWT';
    /**
     * Key identifier. This is specific to JWKs and allows us to verify tokens using a public key
     */
    kid: string;
}
export declare type JwtHeader = LegacyJwtHeader | Auth0JwtHeader;
/**
 * JWT reserved claims used by our infrastructure
 */
export interface JwtBasePayload {
    /**
     * Token issuer
     */
    iss: string;
    /**
     * Token expiration time
     */
    exp: integer;
    /**
     * Id of the user the token was issued to.
     * This is treated as a `string` to match RFC of JWT
     */
    sub?: string;
    /**
     * Identifies the time at which the JWT was issued
     */
    iat: integer;
    /**
     * Token identification UUID
     */
    jti: uuid;
    /**
     * Scope of the token. Warden scope used by Viserion
     */
    scp: any;
}
export interface JwtTemporaryAuth extends JwtBasePayload {
    scp: 'TemporaryAuth';
}
export interface JwtUserPayload extends JwtBasePayload {
    scp: 'User';
}
export interface InternalUserJwtPayload extends JwtUserPayload {
    userType: 'InternalUser';
    userEmail: string;
}
export interface ExternalUserJwtPayload extends JwtUserPayload {
    userType: 'ExternalUser';
    userEmail: string;
    /**
     * Organisations the user has access to
     */
    organisations: OrganisationId[];
    /**
     * Websites the user has access to
     */
    websites: WebsiteId[];
}
export interface AdminUserJwtPayload extends JwtUserPayload {
    userType: 'AdminUser';
    userEmail: string;
}
export interface RobotUserJwtPayload extends JwtUserPayload {
    userType: 'RobotUser';
    userEmail: string;
}
export interface InternalAuth0UserData {
    email: string;
    roles: UserType[];
}
export interface ExternalAuth0UserData extends InternalAuth0UserData {
    roles: ['ExternalUser'];
    organisations: OrganisationId[];
    websites: WebsiteId[];
}
export interface Auth0Payload {
    /**
     * Id of the user the token was issued to.
     */
    sub?: string;
    /**
     * Token expiration time
     */
    exp: integer;
    /**
     * Identifies the time at which the JWT was issued
     */
    iat: integer;
    /**
     * Token issuer
     */
    iss: string;
    /**
     * Token audience. In our case 'ycp' because this token gives access to the entire platform
     */
    aud: 'ycp' | string[];
    azp?: string;
    gty?: string;
    scope?: string;
    /**
     * User permissions Array. For now its going to be empty but this will change
     * when we migrate to RBAC
     */
    permissions: string[];
    /**
     * Our own custom claims are now namespaced in this object
     */
    'https://auth.yieldify.com/userData': InternalAuth0UserData | ExternalAuth0UserData;
}
/**
 * JSON Web Token payload contents
 */
export declare type JwtPayload = InternalUserJwtPayload | ExternalUserJwtPayload | AdminUserJwtPayload | RobotUserJwtPayload | Auth0Payload;
export interface CompleteJwTToken {
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
}
/**
 * Session model as returned from login requests.
 *
 * Since we are supporting both JWT and Access Tokens right now (and until all the
 * API consumers are supporting JWT, the accesToken, client, uid and JWTToken fields
 * should be optional, but a Session must have (accessToken && client && uid) || jwtToken .
 */
export interface SessionBase {
    user: User;
}
export interface SessionJwt extends SessionBase {
    jwtToken: string;
}
export interface SessionAccessToken extends SessionBase {
    accessToken: string;
    client: string;
    uid: string;
}
export declare type Session = SessionJwt | SessionAccessToken;
/**
 * Request used for website creation
 */
export interface CreateWebsiteRequest {
    name: string;
    domain: uri;
    tag_active: boolean;
}
/**
 * Request used for organisation creation
 */
export interface CreateOrganisationRequest {
    name: string;
}
export interface CreateCampaignRequest {
    website_id: WebsiteId;
    template_id: TemplateId;
    clone: false;
    goal?: CampaignGoal;
}
export interface CloneCampaignRequest {
    website_id: WebsiteId;
    campaign_id: CampaignId;
    clone: true;
}
export interface CloneCampaignOutsideWebsiteRequest {
    copy_to_website_ids: WebsiteId[];
    campaign_id: CampaignId;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface ChangePasswordRequest {
    password: string;
    password_confirmation: string;
}
export interface ForgotPasswordRequest {
    email: string;
}
export interface ResetPasswordRequest extends ChangePasswordRequest {
    reset_token: string;
}
export interface NewUserPasswordRequest extends ChangePasswordRequest {
    invitation_token: string;
}
export interface ChangePasswordErrors {
    password: string[];
    full_messages: string[];
}
export interface ChangePasswordErrorResponse {
    success: boolean;
    errors: ChangePasswordErrors;
}
export interface ChangePasswordData {
    message: string;
    user: User;
}
export interface GenericResponse {
    success: boolean;
    message: string;
}
export interface ChangePasswordResponse extends GenericResponse {
    data: ChangePasswordData;
}
export interface ForgotPasswordResponse extends GenericResponse {
}
export interface ResetPasswordResponse extends GenericResponse {
}
export interface GenericErrorResponse {
    errors: string[];
}
export interface ForgotPasswordResponseError extends GenericErrorResponse {
    success: false;
}
export interface NewUserPasswordErrorResponse extends GenericErrorResponse {
}
export interface SignInErrorResponse extends GenericErrorResponse {
}
export interface SignOutErrorResponse extends GenericErrorResponse {
}
export declare type TagBuilderNotificationAction = 'created' | 'destroyed' | 'paused' | 'updated' | 'revision-applied';
export declare type TagBuilderNotificationEntityType = 'experiment' | 'campaign' | 'website';
export interface TagBuilderExperimentNotificationMessage {
    action: 'destroyed' | 'created';
    entityType: 'experiment';
    entityId: number;
    organizationId: number;
    websiteId: number;
}
export interface TagBuilderCampaignNotificationMessage {
    action: 'revision-applied' | 'paused';
    entityType: 'campaign';
    entityId: number;
    organizationId: number;
    websiteId: number;
}
export interface TagBuilderWebsiteNotificationMessage {
    action: 'created' | 'updated' | 'destroyed';
    entityType: 'website';
    entityId: number;
    organizationId: number;
}
export declare type TagBuilderNotificationMessage = TagBuilderExperimentNotificationMessage | TagBuilderCampaignNotificationMessage | TagBuilderWebsiteNotificationMessage;
export declare type Entity = Organisation | Website | Campaign | Experiment | EmailServiceProvider;
export interface PreviewGenerationMessage {
    path: string;
    overlaySettings: OverlaySettings;
    fontConfigurations: FontConfiguration[];
}
export interface EmailPreviewGenerationMessage {
    type: 'EmailCampaign';
    templatePath: string;
    previewPath: string;
}
export declare const ALLOWED_EMAIL_TEMPLATE_VARIABLES: string[];
export interface WebsiteAndOrganisationSearchResult {
    organisations: OrganisationSearchResult[];
    websites: WebsiteSearchResult[];
}
export interface WebsiteSearchResult {
    id: number;
    name: string;
    organisation: OrganisationSearchResult;
}
export interface OrganisationSearchResult {
    id: number;
    name: string;
}
export interface WebsiteConfig {
    apiEndpoint: string;
    bericApiEndpoint: string;
    couponServiceEndpoint: string;
    greywormApiEndpoint: string;
    env: string;
    tagCdnDomain: string;
    edgeEndpoint: string;
}
export interface WebUserGroupsProps {
    campaignType: 'web';
    openingGroups: UserGroups.Web[];
    closingGroups: UserGroups.Web[];
    enabledFeatureFlags: FeatureFlag[];
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
    campaign: Campaign;
}
export interface WebUserGroupsParcelState {
    configuration: UserGroups.Web[];
}
export interface EmailUserGroupsProps {
    campaignType: 'email';
    configuration: UserGroups.Email[];
    emailSources: EmailSource[];
    enabledFeatureFlags: FeatureFlag[];
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
}
export interface EmailUserGroupsParcelState {
    configuration: UserGroups.Email[];
    emailSources: EmailSource[];
}
export declare type UserGroupsParcelProps = WebUserGroupsProps | EmailUserGroupsProps;
export interface CampaignReviewPageProps {
    campaignConfig: CampaignConfiguration;
    campaignType: 'web' | 'email';
    enabledFeatureFlags: FeatureFlag[];
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
}
export declare type GoalId = nanoId10;
export interface CampaignSettingsPageProps {
    campaignConfig: CampaignConfiguration;
    enabledFeatureFlags: FeatureFlags;
    token: string;
    websiteConfig: WebsiteConfig;
    website: Website;
    userType: UserType;
}
export interface PerformanceIndicatorsPageProps {
    enabledFeatureFlags: FeatureFlags;
    website: Website;
    token: string;
    websiteConfig: WebsiteConfig;
    trackIndicator: (id: string) => void;
}
export interface AccountSettingsPageProps {
    enabledFeatureFlags: FeatureFlags;
    website: Website;
    token: string;
    websiteConfig: WebsiteConfig;
    userType: UserType;
}
export interface CampaignBuilderVariantSelectorProps {
    campaign: Campaign;
    enabledFeatureFlags: FeatureFlag[];
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
    isCampaignValid: () => boolean;
}
export interface DashboardCampaignListProps {
    enabledFeatureFlags: FeatureFlags;
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
    userType: UserType;
    onCampaignCreate: () => void;
    onCampaignSelect: (campaign: CampaignConfiguration) => void;
    onCampaignEdit: (campaign: CampaignConfiguration) => void;
    onCampaignPerformance: (campaign: Campaign) => void;
    onCampaignReview: (campaign: CampaignConfiguration) => void;
    onCampaignLaunch: () => void;
    onCampaignPreview: () => void;
}
export interface CampaignPerformancePageProps {
    campaign: Campaign;
    token: string;
    website: Website;
    websiteConfig: WebsiteConfig;
}
export interface AttributionPageProps {
    website: Website;
    token: string;
    websiteConfig: WebsiteConfig;
}
