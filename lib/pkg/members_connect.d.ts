import { CreateMemberRequest, CreateMemberResponse, DeleteMemberRequest, GetCurrentMemberRequest, GetMemberRequest, GetMemberResponse, ListMemberRequest, ListMemberResponse, UpdateCurrentMemberRequest, UpdateMemberRequest, UpdateMemberResponse } from "./members_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.members.MembersService
 */
export declare const MembersService: {
    readonly typeName: "scalekit.v1.members.MembersService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.members.MembersService.CreateMember
         */
        readonly createMember: {
            readonly name: "CreateMember";
            readonly I: typeof CreateMemberRequest;
            readonly O: typeof CreateMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.UpdateCurrentMember
         */
        readonly updateCurrentMember: {
            readonly name: "UpdateCurrentMember";
            readonly I: typeof UpdateCurrentMemberRequest;
            readonly O: typeof UpdateMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.UpdateMember
         */
        readonly updateMember: {
            readonly name: "UpdateMember";
            readonly I: typeof UpdateMemberRequest;
            readonly O: typeof UpdateMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.GetCurrentMember
         */
        readonly getCurrentMember: {
            readonly name: "GetCurrentMember";
            readonly I: typeof GetCurrentMemberRequest;
            readonly O: typeof GetMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.GetMember
         */
        readonly getMember: {
            readonly name: "GetMember";
            readonly I: typeof GetMemberRequest;
            readonly O: typeof GetMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.ListMembers
         */
        readonly listMembers: {
            readonly name: "ListMembers";
            readonly I: typeof ListMemberRequest;
            readonly O: typeof ListMemberResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.members.MembersService.DeleteMember
         */
        readonly deleteMember: {
            readonly name: "DeleteMember";
            readonly I: typeof DeleteMemberRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
