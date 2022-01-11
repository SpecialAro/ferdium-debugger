function sendTestNotification(title = "Test notification title", body = "Test notification body", icon){
  if (!("Notification" in window)) {
    console.warn("Browser does not support notifications")
  }
  else if (Notification.permission === "granted") {
    new Notification(title, { body, icon });
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      if (permission === "granted") {
        new Notification(title, { body, icon });
      }
    });
  }
  else {
    console.warn(`Failed, notification permission is ${Notification.permission}`);
  }

  if (window.ferdi && window.ferdi.setBadge) {
    window.ferdi.setBadge(0, 1);
  }
}
