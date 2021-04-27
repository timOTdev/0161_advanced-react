import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At it's simplest, the access control returns a yes or no value depending on the users session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
  ...generatedPermissions,
  // Didn't work with line 33 for some reason, so commented.
  // isAwesome({ session }: ListAccessArgs): boolean {
  //   return session?.data.name.includes('wes');
  // },
};

// Rule based function
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // Do they have permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // If not, do they own this item?
    // We are returning a where filter we use in graphQL api.
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    return { status: 'AVAILABLE' };
  },
};

// We can use this but don't get intellisense and the top method is what we went with.
// export const permissions = {
// can(permission) {
//   return function () {
//     return session?.data.role[permission];
//   };
// }
// };
