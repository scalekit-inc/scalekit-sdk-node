import type { GenExtension, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { FieldOptions } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file buf/validate/priv/private.proto.
 */
export declare const file_buf_validate_priv_private: GenFile;
/**
 * Do not use. Internal to protovalidate library
 *
 * @generated from message buf.validate.priv.FieldConstraints
 */
export type FieldConstraints = Message<"buf.validate.priv.FieldConstraints"> & {
    /**
     * @generated from field: repeated buf.validate.priv.Constraint cel = 1;
     */
    cel: Constraint[];
};
/**
 * Describes the message buf.validate.priv.FieldConstraints.
 * Use `create(FieldConstraintsSchema)` to create a new message.
 */
export declare const FieldConstraintsSchema: GenMessage<FieldConstraints>;
/**
 * Do not use. Internal to protovalidate library
 *
 * @generated from message buf.validate.priv.Constraint
 */
export type Constraint = Message<"buf.validate.priv.Constraint"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    /**
     * @generated from field: string expression = 3;
     */
    expression: string;
};
/**
 * Describes the message buf.validate.priv.Constraint.
 * Use `create(ConstraintSchema)` to create a new message.
 */
export declare const ConstraintSchema: GenMessage<Constraint>;
/**
 * Do not use. Internal to protovalidate library
 *
 * @generated from extension: optional buf.validate.priv.FieldConstraints field = 1160;
 */
export declare const field: GenExtension<FieldOptions, FieldConstraints>;
