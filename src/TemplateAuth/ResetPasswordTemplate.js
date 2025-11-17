const resetPasswordTemplate = (nom) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réinitialisation de mot de passe</title>
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

    .message {
      margin-top: 20px;
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
    <h1>Confirmation de réinitialisation de mot de passe</h1>
    <p>Bonjour ${nom},</p>
    <p>Votre mot de passe a été réinitialisé avec succès.</p>
    <p class="message">Si vous n'avez pas effectué cette action, veuillez contacter l'assistance immédiatement.</p>
    <a class="redirect-link" href="http://localhost:8001/api/signin">Cliquez ici pour vous connecter</a>
  </div>
</body>

</html>
`;

module.exports = resetPasswordTemplate;
