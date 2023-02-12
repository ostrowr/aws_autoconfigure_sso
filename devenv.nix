{ pkgs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.deno pkgs.awscli2 pkgs.gh ];

  enterShell = ''
    git --version
    deno --version
  '';

  languages.nix.enable = true;
  languages.typescript.enable = true;
  languages.deno.enable = true;

  scripts = {
    check = {
      exec = ''
        deno fmt --check src/ && deno lint src/ && deno check src/configure.ts
      '';
    };
    build = {
      exec = ''
        main="src/configure.ts"
        deno compile --allow-net --allow-run --allow-read --allow-env --target=aarch64-apple-darwin --output dist/aws_autoconfigure_sso_macos_arm $main
        deno compile --allow-net --allow-run --allow-read --allow-env --target=x86_64-apple-darwin --output dist/aws_autoconfigure_sso_macos_x86 $main
        deno compile --allow-net --allow-run --allow-read --allow-env --target=x86_64-pc-windows-msvc --output dist/aws_autoconfigure_sso_windows $main
        deno compile --allow-net --allow-run --allow-read --allow-env --target=x86_64-unknown-linux-gnu --output dist/aws_autoconfigure_sso_linux $main
      '';
    };
    run = {
      exec =
        "deno run --allow-net --allow-run --allow-read --allow-env src/configure.ts";
    };
  };

  pre-commit = { hooks.nixfmt.enable = true; };
}
