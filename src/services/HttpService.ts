import axios from "axios";

export default class HttpService {
  static async post(url: string, payload: any, headers: any) {
    try {
      const response = await axios.post(url, payload, {
        headers: headers
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  }

  static async get(url: string, headers: any) {
    try {
      const response = await axios.get(url, {
        headers: headers
      });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw new Error(error.response?.data?.message);
    }
  }

  static async patch(url: string, payload: any, headers: any) {
    try {
      const response = await axios.patch(url, payload, {
        headers: headers
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  }

  static async delete(url: string, headers: any) {
    try {
      const response = await axios.delete(url, {
        headers: headers
      });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw new Error(error.response?.data?.message);
    }
  }
}