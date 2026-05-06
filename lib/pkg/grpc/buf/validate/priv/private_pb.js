"use strict";
// Copyright 2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.field = exports.ConstraintSchema = exports.FieldConstraintsSchema = exports.file_buf_validate_priv_private = void 0;
const codegenv2_1 = require("@bufbuild/protobuf/codegenv2");
const wkt_1 = require("@bufbuild/protobuf/wkt");
/**
 * Describes the file buf/validate/priv/private.proto.
 */
exports.file_buf_validate_priv_private = (0, codegenv2_1.fileDesc)("Ch9idWYvdmFsaWRhdGUvcHJpdi9wcml2YXRlLnByb3RvEhFidWYudmFsaWRhdGUucHJpdiI+ChBGaWVsZENvbnN0cmFpbnRzEioKA2NlbBgBIAMoCzIdLmJ1Zi52YWxpZGF0ZS5wcml2LkNvbnN0cmFpbnQiPQoKQ29uc3RyYWludBIKCgJpZBgBIAEoCRIPCgdtZXNzYWdlGAIgASgJEhIKCmV4cHJlc3Npb24YAyABKAk6XAoFZmllbGQSHS5nb29nbGUucHJvdG9idWYuRmllbGRPcHRpb25zGIgJIAEoCzIjLmJ1Zi52YWxpZGF0ZS5wcml2LkZpZWxkQ29uc3RyYWludHNSBWZpZWxkiAEBQncKF2J1aWxkLmJ1Zi52YWxpZGF0ZS5wcml2QgxQcml2YXRlUHJvdG9QAVpMYnVmLmJ1aWxkL2dlbi9nby9idWZidWlsZC9wcm90b3ZhbGlkYXRlL3Byb3RvY29sYnVmZmVycy9nby9idWYvdmFsaWRhdGUvcHJpdmIGcHJvdG8z", [wkt_1.file_google_protobuf_descriptor]);
/**
 * Describes the message buf.validate.priv.FieldConstraints.
 * Use `create(FieldConstraintsSchema)` to create a new message.
 */
exports.FieldConstraintsSchema = (0, codegenv2_1.messageDesc)(exports.file_buf_validate_priv_private, 0);
/**
 * Describes the message buf.validate.priv.Constraint.
 * Use `create(ConstraintSchema)` to create a new message.
 */
exports.ConstraintSchema = (0, codegenv2_1.messageDesc)(exports.file_buf_validate_priv_private, 1);
/**
 * Do not use. Internal to protovalidate library
 *
 * @generated from extension: optional buf.validate.priv.FieldConstraints field = 1160;
 */
exports.field = (0, codegenv2_1.extDesc)(exports.file_buf_validate_priv_private, 0);
//# sourceMappingURL=private_pb.js.map