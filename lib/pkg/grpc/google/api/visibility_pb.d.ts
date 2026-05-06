import type { GenExtension, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { FieldOptions, MethodOptions } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file google/api/visibility.proto.
 */
export declare const file_google_api_visibility: GenFile;
/**
 * A visibility rule provides visibility configuration for an individual API
 * element.
 *
 * @generated from message google.api.VisibilityRule
 */
export type VisibilityRule = Message<"google.api.VisibilityRule"> & {
    /**
     * Selects methods, messages, fields, enums, etc. to which this rule applies.
     *
     * Refer to [selector][google.api.DocumentationRule.selector] for syntax
     * details.
     *
     * @generated from field: string selector = 1;
     */
    selector: string;
    /**
     * A comma-separated list of visibility labels that apply to the `selector`.
     * Any of the listed labels can be used to grant the visibility.
     *
     * If a rule has multiple labels, removing one of the labels but not all of
     * them can break clients.
     *
     * Example:
     *
     *     visibility:
     *       rules:
     *       - selector: google.calendar.Calendar.EnhancedSearch
     *         restriction: INTERNAL, PREVIEW
     *
     * Removing INTERNAL from this restriction will break clients that rely on
     * this method and only had access to it through INTERNAL.
     *
     * @generated from field: string restriction = 2;
     */
    restriction: string;
};
/**
 * Describes the message google.api.VisibilityRule.
 * Use `create(VisibilityRuleSchema)` to create a new message.
 */
export declare const VisibilityRuleSchema: GenMessage<VisibilityRule>;
/**
 * See `VisibilityRule`.
 *
 * @generated from extension: google.api.VisibilityRule field_visibility = 72295727;
 */
export declare const field_visibility: GenExtension<FieldOptions, VisibilityRule>;
/**
 * See `VisibilityRule`.
 *
 * @generated from extension: google.api.VisibilityRule method_visibility = 72295727;
 */
export declare const method_visibility: GenExtension<MethodOptions, VisibilityRule>;
