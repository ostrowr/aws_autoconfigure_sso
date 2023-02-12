# aws_autoconfigure_sso

Autogenerate AWS SSO config for all roles you have access to.

## Installation

Grab the binary for your system from the [releases](https://github.com/ostrowr/aws_autoconfigure_sso/releases) page.

## Usage

`./aws_autoconfigure_sso`

This will prompt you for an SSO Start URL (e.g. https://yourcompany.awsapps.com/start) and an SSO region (e.g. us-west-2) and will automatically generate entries for each role that you can access.

Example

```bash
$ ./aws_autoconfigure_sso_macos_arm
Enter SSO start URL: https://yourcompany.awsapps.com/start
Enter SSO region: us-west-2

---- output is sent to stdout and can be appended to ~/.aws/config

# Access to the dev account (1234567)
# with the role AWSAdministratorAccess
[profile dev-AWSAdministratorAccess]
sso_start_url = https://yourcompany.awsapps.com/start
sso_region = us-west-2
sso_account_id = 1234567
sso_role_name = AWSAdministratorAccess
region = us-west-2
output = json

# Access to the dev account (1234567)
# with the role ReadOnlyAccess
[profile dev-ReadOnlyAccess]
sso_start_url = https://yourcompany.awsapps.com/start
sso_region = us-west-2
sso_account_id = 1234567
sso_role_name = ReadOnlyAccess
region = us-west-2
output = json

# Access to the prod account (98765)
# with the role ReadOnlyAccess
[profile prod-ReadOnlyAccess]
sso_start_url = https://yourcompany.awsapps.com/start
sso_region = us-west-2
sso_account_id = 98765
sso_role_name = ReadOnlyAccess
region = us-west-2
output = json
```

## Developing

Messing around with [devenv](https://devenv.sh/getting-started/)

(Vast overkill for this project which is basically one script, but wanted to check it out)
