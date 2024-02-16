import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as url from "../url_helper";

const fakeBackend = () => {
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onPost(url.POST_FAKE_LOGIN).reply((config) => {
    const user = JSON.parse(config["data"]);
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.email,
        password: user.password,
        faCode: user.faCode || "",
      }),
    };

    // Replace the URL below with the actual authentication API endpoint
    return fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/validation", requestOptions)
      .then(response => {
        return response.text();
      })
      .then(result => {
        console.log(result);
        if (result.includes("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9")) {
          let userData = {
            username: user.email,
            access_token: result
          }
          return [200, userData];
        } else if (result === "Username is not exist" || result === "Password is not correct") {
          return [401, "Tài khoản hoặc mật khẩu không hợp lệ!"];
        } else if (result === "Wrong 2FA") {
          return [402, "Mã 2FA không chính xác!"];
        } else if (result === "This account wasn't ROLE_ADMIN") {
          return [403, "Tài khoản không phải ADMIN, không có quyền truy cập tài nguyên này!"];
        }
      })
      .catch(error => {
        console.error(error);

        return [500, "Internal Server Error"];
      });
  });
};

export default fakeBackend;
