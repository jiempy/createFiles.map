const fs = require("fs");
const path = require("path");

const directory = "files"; // Directorio donde están los archivos JavaScript
const files = fs.readdirSync(directory).filter((file) => file.endsWith(".js"));

const tasks = files.map((file) => {
  const filePath = path.posix.join(directory, file);
  const minifiedFile = path.posix.join(
    directory,
    path.parse(file).name + ".js"
  );
  const sourceMapFile = minifiedFile + ".map";

  return {
    label: `minify-${file}`,
    type: "shell",
    command: `uglifyjs ${filePath} --source-map "filename='${sourceMapFile}'" -o "${minifiedFile}"`,
    group: "none",
    problemMatcher: [],
  };
});

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

