import React, { useEffect, useState } from 'react';

export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/notifications/${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [userId]);

  return (
    <div style={{ border: '1px solid gray', padding: '10px', height: '400px', overflowY: 'scroll' }}>
      <h3>Notifications</h3>
      {notifications.map((n, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <b>{n.title}</b>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
