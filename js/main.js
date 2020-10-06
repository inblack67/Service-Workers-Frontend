const publicVapidKey =
  'BM2yppdo6Jf1Jld2lZ5pEnNbTQg6avowoUHiuQSW9cB8chkCUlPf0oShJMfA2DkAHd1YSxw5SlZuM_JhIfXhgPc';

const requestNotification = async (register) => {
  // Register Push
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log('Push Registered...');

  // Send Push Notification
  await fetch('https://morning-hollows-31947.herokuapp.com/api', {
    method: 'POST',
    body: JSON.stringify(subscription),
    icon: '../icons/github.png',
    headers: {
      'content-type': 'application/json',
    },
  });
  console.log('Push Sent...');
};

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('../sw_cached_site.js')
    .then((reg) => {
      requestNotification(reg);
    })
    .catch((err) => console.error(err));
}

const showNotication = (e) => {
  console.log(`Notification permission granted`);
  const newNoti = new Notification('inblack67', {
    body: 'Github',
    icon: '../icons/github.png', // svg doesnt work here
  });

  newNoti.onclick = (e) => {
    console.log(`Notification clicked`);
  };
};

if (window.Notification) {
  // permissions - granted, denied, default(whatever is configured in the browser)

  if (Notification.permission === 'granted') {
    showNotication();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotication();
      }
    });
  }
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
