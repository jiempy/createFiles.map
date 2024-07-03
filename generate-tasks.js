const fs = require("fs");
const path = require("path");
const os = require("os");

const directory = "files"; // Directorio donde están los archivos CSS y JavaScript
const jsOutputDirectory = path.join(directory, "js");
const cssOutputDirectory = path.join(directory, "css");

// Crear directorios de salida si no existen
if (!fs.existsSync(jsOutputDirectory)) {
  fs.mkdirSync(jsOutputDirectory);
}

if (!fs.existsSync(cssOutputDirectory)) {
  fs.mkdirSync(cssOutputDirectory);
}

// TRABAJANDO CON LOS .JS

const uglifyjsExecutable = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "npm",
  "uglifyjs"
);

const jsFiles = fs
  .readdirSync(directory)
  .filter((file) => file.endsWith(".js"));

const jsTasks = jsFiles.map((file) => {
  const filePath = path.posix.join(directory, file);
  const minifiedFile = path.posix.join(
    jsOutputDirectory,
    path.parse(file).name.replace(".min", "") + ".min.js"
  );
  const sourceMapFile = `${minifiedFile}.map`; // Archivo de mapa

  // Verificar si ya existe el archivo .min.js
  const jsMinExists = fs.existsSync(minifiedFile);

  if (jsMinExists) {
    // Crear tarea solo para generar el archivo .map
    return {
      label: `generate-map-js-${file}`,
      type: "shell",
      command: `& "${uglifyjsExecutable}" "${filePath}" --source-map "filename='${sourceMapFile.replace("\\","/")}'" -o "${minifiedFile.replace("\\","/")}"`,

      group: "none",
      problemMatcher: [],
      presentation: {
        reveal: "always",
        panel: "shared",
        clear: false,
      },
    };
  } else {
    // Crear tarea para minificar y generar el archivo .map
    return {
      label: `minify-js-${file}`,
      type: "shell",
      command: `& "${uglifyjsExecutable}" "${filePath}" --source-map "filename='${sourceMapFile.replace("\\","/")}'" -o "${minifiedFile.replace("\\","/")}"`,
      group: "none",
      problemMatcher: [],
      presentation: {
        reveal: "always",
        panel: "shared",
        clear: false,
      },
    };
  }
});

//TRABAJANDO CON LOS .CSS

const cleancssExecutable = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "npm",
  "cleancss"
);

const cssFiles = fs
  .readdirSync(directory)
  .filter((file) => file.endsWith(".css"));

const cssTasks = cssFiles.map((file) => {
  const filePath = path.posix.join(directory, file);
  const minifiedFile = path.posix.join(
    cssOutputDirectory,
    path.parse(file).name.replace(".min", "") + ".min.css"
  );
  const sourceMapFile = `${minifiedFile}.map`; // Archivo de mapa

  // Verificar si ya existe el archivo .min.css
  const cssMinExists = fs.existsSync(minifiedFile);

  if (cssMinExists) {
    // Crear tarea solo para generar el archivo .map
    return {
      label: `generate-map-css-${file}`,
      type: "shell",
      command: `& "${cleancssExecutable}" ${filePath} --source-map --source-map-inline-sources`,
      group: "none",
      problemMatcher: [],
    };
  } else {
    // Crear tarea para minificar y generar el archivo .map
    return {
      label: `minify-css-${file}`,
      type: "shell",
      command: `& "${cleancssExecutable}" ${filePath} -o "${minifiedFile}" --source-map --source-map-inline-sources`,
      group: "none",
      problemMatcher: [],
    };
  }
});

const tasks = [...jsTasks, ...cssTasks];

// Añadir tarea compuesta que ejecute todas las tareas individuales
const compoundTask = {
  label: "minify-all",
  dependsOrder: "sequence",
  dependsOn: tasks.map((task) => task.label),
  group: {
    kind: "build",
    isDefault: true,
  },
};

const tasksJson = {
  version: "2.0.0",
  tasks: [...tasks, compoundTask],
};

if (!fs.existsSync(".vscode")) {
  fs.mkdirSync(".vscode");
}

fs.writeFileSync(".vscode/tasks.json", JSON.stringify(tasksJson, null, 2));

console.log("Tareas generadas exitosamente en tasks.json.");
