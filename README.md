# INTRUCCIONES DE USO en vsCode

## Verifica si tienes instalado uglify-js y clean-css-cli
- Para instalar ejecutar "npm install -g clean-css-cli uglify-js" y "npm install -g uglify-js clean-css"

## Codigo a ejecutar para crear taks en .vscode los .map
- Agregar al directorio files todos los .css y .js que deseas obtener los .min y/o los .map 
- Para ejecutar las Tasks usar comando: "node generate-tasks.js"

## Ejecutar Tasks para crear los .min y los .map correspondientes
- Presiona "Ctrl+Shift+P" para abrir la paleta de comandos de VS Code.
- Escribe "Tasks: Run Task" y selecciona esa opción.
- Luego selecciona la tarea minify-all que configuraste.

## Output
- Se crearan 2 carpetas (files/css y files/js) automaticamente donde se dejaran los archivos .min y .map

