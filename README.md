# Aws MFA
    Small script to update your MFA from aws. Keep in mind if you don't have one it will add you one.
    

# Run Locally
If you want to setup locally this server, you need the following.

    - Nodejs
    - npm / yarn
    - aws cli configured and its own credentials.

▶️ Fill out the .env.example and rename it to .env

❗Note: SERIAL_AWS_NUMBER Can be found running the following command: ***aws iam list-mfa-devices***

▶️ Then, run from the terminal:
    - npm run install / yarn install
    - npm run mfa / yarn mfa

# User stories
```
As a developer,
So I can use my aws cli with MFA,
I would like to be able to update/register a new profile with MFA adding a prefix as this: `${profileName}-mfa`
```