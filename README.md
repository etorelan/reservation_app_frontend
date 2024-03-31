# Hotel Reservation App Frontend

This is a full-stack web application's frontend built with React, Firestore, and integrated with Stripe for payment processing. The application allows users to search for hotels, view details, make reservations, and process payments securely.

## Features

- User Authentication: Users can sign up, log in, and manage their accounts.
- Hotel Search: Users can search for hotels based on location, dates, and other criteria.
- Hotel Details: Information about each hotel, room types, and availability.
- Reservation Management & Payment Processing: Secure payment processing using Stripe integration.
- Background Task Processing: Celery with Redis integration for handling background tasks and asynchronous processing.

## Technologies Used

- React: Frontend user interface built with React framework.
- Firebase Authentication: Used for user authentication and authorization.
- Stripe: Payment processing integration for handling secure transactions.

## Installation

1. Clone the repository:

```
git clone https://github.com/etorelan/reservation_app_frontend.git
```

2. Install frontend dependencies:

```
cd reservation_app_frontend/
npm install
```

3. Set up Firebase Firestore:

- Create a Firebase project and set up Firestore.
- Copy the Firebase configuration details into your frontend settings.
- Ensure Firestore rules allow read and write access as required.



4. Set up environment variables:

   - Create a `.env` file in the root directory and set the variables defined in cloudConfig.js:


5. Start the frontend development server:

```
npm start
```


## License

This project is licensed under the MIT License

## Acknowledgments

- Special thanks to the developers of React, Firestore, and Stripe for their amazing tools and documentation.
- Thanks to the open-source community for providing helpful resources and tutorials.
