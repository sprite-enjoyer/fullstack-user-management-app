import { User } from "./usersReducer";

type UserCredentials = { userName: string; password: string; };
export type RestClientStandardResponse = { response: any, success: boolean };

export default class RestClient {
  static URL: string = import.meta.env.VITE_BACKEND_URL;

  static async register(credentials: UserCredentials): Promise<RestClientStandardResponse> {
    const response = await fetch(`${RestClient.URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({ userName: credentials.userName, password: credentials.password }),
      credentials: "include",
      headers: { "Content-Type": "application/json", }
    });

    const json = await response.json();
    return { response: json, success: response.ok };
  }

  static async login(credentials: UserCredentials): Promise<RestClientStandardResponse> {
    const response = await fetch(`${RestClient.URL}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    return { response: json, success: response.ok };
  }

  static async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${RestClient.URL}/users/allUsers`, {
      method: "GET",
      headers: { "Content-Type": "application/json", },
    });
    const json = await response.json();

    return json.users;
  }

  static async deleteManyUsers(users: string[]): Promise<RestClientStandardResponse> {
    const response = await fetch(`${RestClient.URL}/users/deleteMany`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNames: users })
    });

    const json = await response.json();
    return { response: json, success: response.ok };
  }

  static async blockManyUsers(users: string[], block: boolean): Promise<RestClientStandardResponse> {
    const response = await fetch(`${RestClient.URL}/users/blockMany`, {
      method: "PATCH",
      credentials: "include",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNames: users, block: block })
    });

    const json = await response.json();
    return { response: json, success: response.ok };
  }

  static async checkUser(): Promise<boolean> {
    const response = await fetch(`${RestClient.URL}/users/checkUser`, {
      method: "GET",
      credentials: "include"
    });

    const { signOut } = await response.json();
    return signOut;
  }
}
