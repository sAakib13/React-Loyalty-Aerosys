import React from 'react';
import Intercom from '@intercom/messenger-js-sdk';

export default function Component() {
  Intercom({
    app_id: 'bzth8jha',
    user_id: "12345", // IMPORTANT: Replace "user.id" with the variable you use to capture the user's ID
    name: "Aakib", // IMPORTANT: Replace "user.name" with the variable you use to capture the user's name
    email: "aakib@gmail.com", // IMPORTANT: Replace "user.email" with the variable you use to capture the user's email
    created_at: "2025/02/19", // IMPORTANT: Replace "user.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200
  });

  return <div></div>;
}