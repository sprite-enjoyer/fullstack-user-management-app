type UserCredentials = { userName: string; password: string; };
type BlockUserRequestBodyType = { userName: string; blocked: boolean };

export default class RestClient {
  static URL: string = import.meta.env.VITE_BACKEND_URL;

  static async register(credentials: UserCredentials) {
    const response = await fetch(`${RestClient.URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({ userName: credentials.userName, password: credentials.password }),
      credentials: "include",
      headers: { "Content-Type": "application/json", }
    });

    return await response.json();
  }

  static async login(credentials: UserCredentials) {
    const response = await fetch(`${RestClient.URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  }

  static async deleteUser(userName: string) {
    const response = await fetch(`${RestClient.URL}/delete-user`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ userName }),
    });

    return await response.json();
  }

  static async blockUser(requestBody: BlockUserRequestBodyType) {
    const response = await fetch(`${RestClient.URL}/block-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }
}
