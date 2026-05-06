import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file buf/validate/expression.proto.
 */
export declare const file_buf_validate_expression: GenFile;
/**
 * `Constraint` represents a validation rule written in the Common Expression
 * Language (CEL) syntax. Each Constraint includes a unique identifier, an
 * optional error message, and the CEL expression to evaluate. For more
 * information on CEL, [see our documentation](https://github.com/bufbuild/protovalidate/blob/main/docs/cel.md).
 *
 * ```proto
 * message Foo {
 *   option (buf.validate.message).cel = {
 *     id: "foo.bar"
 *     message: "bar must be greater than 0"
 *     expression: "this.bar > 0"
 *   };
 *   int32 bar = 1;
 * }
 * ```
 *
 * @generated from message buf.validate.Constraint
 */
export type Constraint = Message<"buf.validate.Constraint"> & {
    /**
     * `id` is a string that serves as a machine-readable name for this Constraint.
     * It should be unique within its scope, which could be either a message or a field.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * `message` is an optional field that provides a human-readable error message
     * for this Constraint when the CEL expression evaluates to false. If a
     * non-empty message is provided, any strings resulting from the CEL
     * expression evaluation are ignored.
     *
     * @generated from field: string message = 2;
     */
    message: string;
    /**
     * `expression` is the actual CEL expression that will be evaluated for
     * validation. This string must resolve to either a boolean or a string
     * value. If the expression evaluates to false or a non-empty string, the
     * validation is considered failed, and the message is rejected.
     *
     * @generated from field: string expression = 3;
     */
    expression: string;
};
/**
 * Describes the message buf.validate.Constraint.
 * Use `create(ConstraintSchema)` to create a new message.
 */
export declare const ConstraintSchema: GenMessage<Constraint>;
