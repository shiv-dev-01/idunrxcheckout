import React, { useEffect } from "react";
import Intercom from "@intercom/messenger-js-sdk";

// const Messenger = () => {
//   useEffect(() => {
//     const user = {
//       id: "12345", // Replace with dynamic user ID
//       name: "John Doe", // Replace with dynamic user name
//       email: "john.doe@example.com", // Replace with dynamic user email
//       createdAt: 1704067200, // Replace with dynamic timestamp
//     };

//     console.log("User Object:", user);
//     console.log("Intercom Params:", {
//       app_id: "r2p0ub4f",
//       user_id: "1",
//       name: "ravi nimavat",
//       email: "ravi@whitelabelmd.com",
//       created_at: user.createdAt,
//     });

//     Intercom({
//       app_id: "r2p0ub4f",
//       user_id: "1",
//       name: "ravi nimavat",
//       email: "ravi@whitelabelmd.com",
//       created_at: user.createdAt,
//     });
//   }, []);

//   return <div>Intercom Messenger Initialized</div>;
// };

export default function Messenger() {
    Intercom({
      app_id: 'r2p0ub4f',
      region: "us",
      user_hash: "a595c3152ae77a2582d72b3cfc2cbd2426051a266a6fc351a9783f3bcdb50b9b",
      user_id: '123', 
      name: 'ravi', 
      email: 'user@example.com', 
      created_at: "123456789", 
    });
  
    return <div>Example App</div>;
  }


//export default Messenger;
