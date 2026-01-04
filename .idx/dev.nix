{ pkgs, ... }: {
  channel = "stable-23.11";
  
  packages = [
    pkgs.nodejs_20
    pkgs.postgresql
  ];
  
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "Prisma.prisma"
    ];
    
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        run-dev = "npm run dev";
      };
    };
    
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
