const axios = require("axios");
const ApiClient = require("../src/apiClient").default;

jest.mock("axios");

describe("ApiClient", () => {
  const baseUrl = "http://example.com/api";
  const timeout = 3000;
  const generateTokenPath = "/refresh-token";

  beforeEach(() => {
    axios.create.mockReturnThis();
  });

  it("should create an axios instance with given baseURL and timeout", () => {
    new ApiClient(baseUrl, timeout, generateTokenPath);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: baseUrl,
      timeout: timeout,
    });
  });

  it("calls API with correct URI and method", async () => {
    const apiClient = new ApiClient(baseUrl, timeout, generateTokenPath);
    const data = { id: 1, name: "Test" };
    axios.mockResolvedValue({
      response: { data: data, status: 200 },
    });

    const response = await apiClient.call("/test", "GET", "", "token");
    expect(response).toEqual({ data: data, status: 200 });
  });

  it("handles token refresh on 401 response", async () => {
    const apiClient = new ApiClient(baseUrl, timeout, generateTokenPath);

    axios.mockRejectedValueOnce({
      response: { status: 401, data: "Unauthorized" },
    });

    axios.mockResolvedValueOnce({
      response: { data: { token: "newToken" } },
    });

    axios.mockResolvedValueOnce({
      response: { data: "Success", status: 200 },
    });

    const response = await apiClient.call(
      "/test",
      "GET",
      "refreshToken",
      "expiredToken"
    );

    expect(response).toEqual({ data: "Success", status: 200 });
  });
});
