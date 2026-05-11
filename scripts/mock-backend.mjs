import http from "node:http";

const port = Number(process.env.MOCK_BACKEND_PORT ?? 4100);

function json(response, status, body, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    ...headers,
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer((request, response) => {
  if (!request.url) {
    response.writeHead(400).end();
    return;
  }

  const url = new URL(request.url, `http://127.0.0.1:${port}`);

  if (request.method === "POST" && url.pathname === "/api/auth/refresh") {
    let payload = "";
    request.on("data", (chunk) => {
      payload += chunk;
    });
    request.on("end", () => {
      const parsed = payload ? JSON.parse(payload) : {};
      if (parsed.refreshToken !== "valid-refresh") {
        json(response, 401, { title: "Unauthorized" });
        return;
      }

      json(response, 200, {
        access_token: "header.eyJleHAiIjo0MTAyNDQ0ODAwfQ.signature",
        refresh_token: "valid-refresh",
        session_id: "session-123",
        expires_in: 3600,
      });
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/account/me") {
    if (request.headers.authorization !== "Bearer header.eyJleHAiIjo0MTAyNDQ0ODAwfQ.signature") {
      json(response, 401, { title: "Unauthorized" });
      return;
    }

    json(response, 200, {
      id: "user-123",
      email: "hello@example.test",
      firstName: "Demo",
      lastName: "User",
      roles: ["ROLE_USER"],
      emailVerified: true,
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    json(response, 200, { status: "ok" });
    return;
  }

  json(response, 404, { title: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`mock-backend listening on ${port}\n`);
});
