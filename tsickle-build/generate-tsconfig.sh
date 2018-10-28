PWD=$(pwd | sed "s/\//\\\\\//g")
sed "s/{{ROOT_DIR}}/$PWD/g" tsconfig.tpl.json > tsconfig.json
