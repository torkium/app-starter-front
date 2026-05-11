self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  const payload = readPushPayload(event.data);
  const title = payload.title || "Starter Front";
  const body = payload.body || "New notification";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg",
      data: payload.url ? { url: payload.url } : undefined,
    }),
  );
});

function readPushPayload(data) {
  if (!data) {
    return {};
  }

  try {
    return data.json();
  } catch {
    try {
      const text = data.text();
      return text ? { body: text } : {};
    } catch {
      return {};
    }
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = resolveNotificationTarget(event.notification.data?.url);

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});

function resolveNotificationTarget(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return "/";
  }

  try {
    const resolved = new URL(rawUrl, self.location.origin);
    if (resolved.origin !== self.location.origin) {
      return "/";
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return "/";
  }
}
