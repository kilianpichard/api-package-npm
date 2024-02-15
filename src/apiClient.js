const axios = require("axios");

export default class ApiClient {
  generateTokenPath;
  axiosClient;

  constructor(baseUrl, timeout, generateTokenPath) {
    this.generateTokenPath = generateTokenPath;
    this.axiosClient = axios.create({
      baseURL: baseUrl,
      timeout: timeout,
    });
  }

  call = async (
    uri,
    method = "GET",
    refreshToken = "",
    token = "",
    data = null
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { response } = await this.axiosClient(uri, {
        method,
        headers,
        data,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (error.response.status === 401 && refreshToken) {
        const newToken = await this.regenerateToken(refreshToken);
        return this.call(uri, method, refreshToken, newToken, data);
      }
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
  };

  regenerateToken = async (refreshToken) => {
    const { response } = await this.axiosClient(this.generateTokenPath, {
      method: "POST",
      data: { refreshToken },
    });
    return response.data.token;
  };
}
