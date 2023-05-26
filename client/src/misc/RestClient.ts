type UserCredentials = { userName: string; password: string; };

export default class RestClient {
  static URL: string = import.meta.env.VITE_BACKEND_URL;

  static async register(credentials: UserCredentials) {
    const response = await fetch(`${RestClient.URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({ userName: credentials.userName, password: credentials.password }),
      credentials: "include",
      headers: { "Content-Type": "application/json", }
    });

    const json = await response.json();
    console.log(json, 'in RestClient!');
    return json;
  }

  static async login(credentials: UserCredentials) {
    const response = await fetch(`${RestClient.URL}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    console.log(json, 'in RestClient!');
    return json;
  }

  static async getAllUsers() {
    const response = await fetch(`${RestClient.URL}/users/allUsers`, {
      method: "GET",
      headers: { "Content-Type": "application/json", },
    });
    const json = await response.json();
    console.log("message: ", json.message, ' - from RestClient!');

    return json.users;
  }

  static async deleteManyUsers(users: string[]) {
    const response = await fetch(`${RestClient.URL}/users/deleteMany`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNames: users })
    });

    const json = await response.json();
    console.log(json, "in RestClient!");
    return json;
  }

  static async blockManyUsers(users: string[], block: boolean) {
    const response = await fetch(`${RestClient.URL}/users/blockMany`, {
      method: "PATCH",
      credentials: "include",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNames: users, block: block })
    });

    const json = await response.json();
    console.log(json, "in RestClient!");
    return json;
  }
}
