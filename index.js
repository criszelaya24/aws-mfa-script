require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { STSClient, GetSessionTokenCommand } = require('@aws-sdk/client-sts');
const sts = new STSClient({});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const mfaPromptCode = () => {
    return new Promise(resolve => {
        rl.question('Enter MFA code: ', code => {
            resolve(code);
        });
    });
};

const updateAWSCredentials = async () => {
    const TokenCode = await mfaPromptCode();
    const profileName = `${process.env.AWS_PROFILE_NAME ?? 'default'}`;

    const command = new GetSessionTokenCommand({
        SerialNumber: `${process.env.SERIAL_AWS_NUMBER}`,
        TokenCode,
    });
    const { Credentials } = await sts.send(command);
    const { AccessKeyId, SecretAccessKey, SessionToken } = Credentials;
    const awsConfigFilePath = path.join(process.env.HOME, '.aws', 'credentials');

    // Replace existing credentials with temporary credentials
    const newCredentials = `[${profileName}-mfa]\naws_access_key_id=${AccessKeyId}\naws_secret_access_key=${SecretAccessKey}\naws_session_token=${SessionToken}`;
    let profiles = fs.readFileSync(awsConfigFilePath).toString();

    const startLine = profiles.indexOf(`[${profileName}-mfa]\n`);
    const endLine = profiles.indexOf('\n\n', startLine);

    if (startLine > -1) {
        const existingCredentials = profiles.substring(startLine, endLine != -1 ? endLine : profiles.length);

        profiles = profiles.replace(existingCredentials, newCredentials);
    } else {
        profiles = profiles.concat(`\n${newCredentials}`);
    }

    await fs.writeFileSync(awsConfigFilePath, profiles);

    console.log(`Updated MFA credentials for profile '${profileName}'`);
};

updateAWSCredentials()
    .then(() => process.exit(0))
    .catch(error => console.log({ error }));
