/**
 * Stub for buf/validate/validate.proto dependency.
 * The generated code references this for file descriptor linking; we export a minimal
 * placeholder so the SDK builds without the full buf validate proto source.
 */
import type { GenFile } from "@bufbuild/protobuf/codegenv2";

const NAME = "buf/validate/validate.proto";
const EMPTY_ARR: never[] = [];
export const file_buf_validate_validate: GenFile = {
  get name() { return NAME; },
  get syntax() { return "proto3"; },
  get dependency() { return []; },
  get enumType() { return EMPTY_ARR; },
  get messageType() { return EMPTY_ARR; },
  get service() { return EMPTY_ARR; },
  get extension() { return EMPTY_ARR; },
  get proto() {
    return {
      name: NAME,
      syntax: "proto3",
      enumType: EMPTY_ARR,
      messageType: EMPTY_ARR,
      service: EMPTY_ARR,
      extension: EMPTY_ARR,
    };
  },
} as unknown as GenFile;
