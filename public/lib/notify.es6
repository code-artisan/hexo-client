module.exports = function (title, options) {
  Notification.requestPermission();

  return new Notification(title, {
    ...options,
    badge: '../assets/icons/icon.png'
  });
};
