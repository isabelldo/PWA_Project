/**
 * Registration of the service worker
 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => {
      console.log("service worker registriert");
    })
    .catch((err) => {
      console.error("Error with installing of service worker", err);
    });
}
