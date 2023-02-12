import * as path from "https://deno.land/std@0.177.0/path/mod.ts";
import { $, colors, question } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";

$.verbose = false;
const tempProfileName = crypto.randomUUID().replaceAll("-", "");

const ssoStartUrl = Deno.env.get("SSO_START_URL") ??
  (await question("Enter SSO start URL:"));
const region = Deno.env.get("SSO_REGION") ??
  (await question("Enter SSO region:"));
await $`aws configure set sso_start_url ${ssoStartUrl} --profile ${tempProfileName}`;
await $`aws configure set sso_region ${region} --profile research --profile ${tempProfileName}`;
await $`aws sso login --profile ${tempProfileName}`;
// TODO remove `tempProfileName` from ~/.aws/config

const getAccessToken = async (startUrl: string) => {
  const ssoCacheDir = path.join(Deno.env.get("HOME") ?? "", ".aws/sso/cache");

  const files = Deno.readDir(ssoCacheDir);
  for await (const file of files) {
    if (!file.isFile || !file.name.endsWith(".json")) {
      continue;
    }
    try {
      const contents = JSON.parse(
        Deno.readTextFileSync(path.join(ssoCacheDir, file.name)),
      );
      if (contents.startUrl === startUrl) {
        return contents.accessToken;
      }
    } catch {
      // console.error
    }
  }
  throw new Error("No access token found");
};

const accessToken = await getAccessToken(ssoStartUrl);

const listAccountsOutput =
  await $`aws sso list-accounts --access-token ${accessToken} --region ${region} --no-cli-pager --output json`;

const accounts: {
  accountId: string;
  accountName: string;
  emailAddress: string;
}[] = JSON.parse(listAccountsOutput.stdout).accountList;

for (const account of accounts) {
  const rolesOutput =
    await $`aws sso list-account-roles --access-token ${accessToken} --account-id ${account.accountId} --region ${region} --no-cli-pager --output json`;
  const roles: { roleName: string; accountId: string }[] = JSON.parse(
    rolesOutput.stdout,
  ).roleList;
  for (const role of roles) {
    const options = {
      sso_start_url: ssoStartUrl,
      sso_region: region,
      sso_account_id: account.accountId,
      sso_role_name: role.roleName,
      region: region,
      output: "json",
    };
    const comment = colors.yellow(
      `# Access to the ${account.accountName} account (${account.accountId})
# with the role ${role.roleName}`,
    );
    const header = colors.blue(
      `[profile ${account.accountName}-${role.roleName}]`, // todo ensure names are unique
    );
    const body = Object.entries(options)
      .map(([name, value]) => `${colors.green(name)} = ${value}`)
      .join("\n");
    console.log(
      `${comment}
${header}
${body}
`,
    );
  }
}
