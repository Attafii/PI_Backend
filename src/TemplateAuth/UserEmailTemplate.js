const UserEmailTemplate = (nom, email, API_ENDPOINT, token) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #007bff;
    }

    p {
      color: #333333;
    }

    .code {
      font-size: 24px;
      font-weight: bold;
      color: #28a745; /* vert */
    }

    .redirect-link {
      display: block;
      margin-top: 20px;
      color: #007bff;
      text-decoration: none;
    }

    .redirect-link:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Réinitialisation de mot de passe</h1>
    <p>Bonjour ${nom},</p>
    <p>Vous avez demandé une réinitialisation de mot de passe pour votre compte. Veuillez utiliser le code ci-dessous pour réinitialiser votre mot de passe : ${email}</p>
    <p class="code">${token}</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
    <a class="redirect-link" href="${API_ENDPOINT}/reset-password">Cliquez ici pour réinitialiser votre mot de passe</a>
  </div>
</body>

</html>
`;
module.exports = UserEmailTemplate;
