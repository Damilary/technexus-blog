import { UserRole } from "../graphql/types";
import { GraphQLError } from "graphql";

export function checkRole(user: any, allowedRoles: UserRole[]) {
  if (!user) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError("Not authorized", {
      extensions: { code: "FORBIDDEN" },
    });
  }
}
