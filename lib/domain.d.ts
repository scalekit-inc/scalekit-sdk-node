import GrpcConnect from "./connect";
import CoreClient from "./core";
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse, DomainType } from "./pkg/grpc/scalekit/v1/domains/domains_pb";
import { Empty } from "@bufbuild/protobuf";
/**
 * Client for managing domains for organizations.
 *
 * Domains enable automatic organization identification during SSO flows based on user email addresses.
 * You can configure domains as ORGANIZATION_DOMAIN (for SSO routing) or ALLOWED_EMAIL_DOMAIN
 * (for restricting which email domains can automatically join an organization).
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const domainClient = scalekitClient.domain;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/domains | Domain API Documentation}
 */
export default class DomainClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Adds a new domain configuration to an organization for SSO routing or user suggestions.
     *
     * Domains serve two purposes based on their type:
     * - **ORGANIZATION_DOMAIN**: Used to identify the SSO connection for the organization. When users
     *   authenticate with email addresses from this domain, they're automatically routed to the
     *   organization's SSO provider.
     * - **ALLOWED_EMAIL_DOMAIN**: Enables users to join the organization with automatic suggestions
     *   in the organization switcher during signup/login.
     *
     * Note: Public disposable domains (gmail.com, outlook.com, etc.) are automatically blocked for security.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} name - The domain name (e.g., "acme.com", "example.org")
     * @param {object} [options] - Optional domain configuration
     * @param {DomainType | string} [options.domainType] - Domain type: 'ALLOWED_EMAIL_DOMAIN' or 'ORGANIZATION_DOMAIN'
     *
     * @returns {Promise<CreateDomainResponse>} The created domain with ID and verification status
     *
     * @throws {Error} If domain type is invalid
     * @throws {Error} If domain is a blocked public domain (gmail.com, etc.)
     *
     * @example
     * // Add SSO routing domain
     * const response = await scalekitClient.domain.createDomain(
     *   'org_123456',
     *   'acme.com',
     *   { domainType: 'ORGANIZATION_DOMAIN' }
     * );
     * console.log('Domain created:', response.domain.id);
     * console.log('Verification required:', response.domain.verificationStatus);
     *
     * @example
     * // Add allowed email domain for user suggestions
     * await scalekitClient.domain.createDomain(
     *   'org_123456',
     *   'acme.io',
     *   { domainType: 'ALLOWED_EMAIL_DOMAIN' }
     * );
     *
     * @example
     * // Create domain with default type
     * await scalekitClient.domain.createDomain('org_123456', 'company.com');
     *
     * @example
     * // Configure multiple domains for an organization
     * const domains = ['acme.com', 'acme.io', 'acme.net'];
     * for (const domain of domains) {
     *   await scalekitClient.domain.createDomain('org_123456', domain, {
     *     domainType: 'ORGANIZATION_DOMAIN'
     *   });
     * }
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/domains | Create Domain API}
     * @see {@link listDomains} - List all domains for an organization
     * @see {@link deleteDomain} - Remove a domain
     */
    createDomain(organizationId: string, name: string, options?: {
        domainType?: DomainType | string;
    }): Promise<CreateDomainResponse>;
    /**
     * Retrieves detailed information about a specific domain configuration.
     *
     * Returns complete domain details including the domain name, type (ORGANIZATION_DOMAIN or
     * ALLOWED_EMAIL_DOMAIN), verification status, and when it was created/updated. Use this to
     * check domain configuration status or verification requirements.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} domainId - The domain ID (format: "domain_...")
     *
     * @returns {Promise<GetDomainResponse>} Complete domain configuration and status
     *
     * @example
     * // Check domain verification status
     * const response = await scalekitClient.domain.getDomain(
     *   'org_123456',
     *   'domain_abc123'
     * );
     * console.log('Domain:', response.domain.domain);
     * console.log('Type:', response.domain.domainType);
     * console.log('Verified:', response.domain.verificationStatus);
     *
     * @example
     * // Verify domain configuration after creation
     * const created = await scalekitClient.domain.createDomain(
     *   'org_123456',
     *   'acme.com',
     *   { domainType: 'ORGANIZATION_DOMAIN' }
     * );
     *
     * // Later, check if domain has been verified
     * const domain = await scalekitClient.domain.getDomain(
     *   'org_123456',
     *   created.domain.id
     * );
     * if (domain.domain.verificationStatus === 'VERIFIED') {
     *   console.log('Domain is ready for SSO routing');
     * }
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/domains | Get Domain API}
     * @see {@link createDomain} - Add a new domain
     * @see {@link listDomains} - List all domains for an organization
     */
    getDomain(organizationId: string, domainId: string): Promise<GetDomainResponse>;
    private resolveDomainType;
    /**
     * Retrieves all domain configurations for an organization.
     *
     * Returns a complete list of domains configured for the organization, including both
     * ORGANIZATION_DOMAIN (for SSO routing) and ALLOWED_EMAIL_DOMAIN (for user suggestions).
     * Each domain includes its verification status, type, and configuration details.
     *
     * Use this to audit domain configuration, check which domains are verified, or display
     * domain settings in an admin dashboard.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     *
     * @param options Optional parameters for filtering domains
     * @param {DomainType | string} options.domainType Filter domains by type (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
     * @returns {Promise<ListDomainResponse>} List of all domains with their configurations
     *
     * @example
     * // List all domains for an organization
     * const response = await scalekitClient.domain.listDomains('org_123456');
     * console.log(`Found ${response.domains.length} domains`);
     * response.domains.forEach(domain => {
     *   console.log(`- ${domain.domain} (${domain.domainType}): ${domain.verificationStatus}`);
     * });
     *
     * @example
     * // Check which domains are verified for SSO
     * const response = await scalekitClient.domain.listDomains('org_123456');
     * const verifiedSSODomains = response.domains.filter(
     *   d => d.domainType === 'ORGANIZATION_DOMAIN' && d.verificationStatus === 'VERIFIED'
     * );
     * console.log('Verified SSO domains:', verifiedSSODomains.map(d => d.domain));
     * @see {@link https://docs.scalekit.com/apis/#tag/domains | List Domains API}
     * @see {@link createDomain} - Add a new domain
     * @see {@link getDomain} - Get details for a specific domain
     * @see {@link deleteDomain} - Remove a domain
     */
    listDomains(organizationId: string, options?: {
        domainType?: DomainType | string;
    }): Promise<ListDomainResponse>;
    /**
     * Deletes a domain from an organization.
     *
     * Removes the domain configuration from the organization. Users with email addresses from
     * this domain will no longer be automatically routed to this organization's SSO connection.
     *
     * @param {string} organizationId - The organization ID
     * @param {string} domainId - The domain ID to delete
     *
     * @returns {Promise<Empty>} Empty response on successful deletion
     *
     * @example
     * // Remove a domain from an organization
     * await scalekitClient.domain.deleteDomain('org_123456', 'domain_abc123');
     * console.log('Domain deleted successfully');
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/domains | Delete Domain API}
     * @see {@link createDomain} - Add a new domain
     * @see {@link listDomains} - List all domains for an organization
     */
    deleteDomain(organizationId: string, domainId: string): Promise<Empty>;
}
