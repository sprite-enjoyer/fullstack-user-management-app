export type UserCredentials = { userName: string, password: string };
export type ShouldUserBeSignedOutLocalsType = { userNames: string[], jwtUserName: string };
export type ShouldUserBeSignedOutResponseBodyType = { message: string, signOut: boolean };
export type ModifyManyUsersRequestBodyType = { userNames: string[], block: boolean };