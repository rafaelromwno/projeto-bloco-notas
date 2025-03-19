const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const fs = require("fs");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Permitir comunicação entre processos
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile("index.html");

  // Criar menu personalizado
  const menu = Menu.buildFromTemplate([
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Abrir",
          click: () => abrirArquivo(),
        },
        {
          label: "Salvar",
          click: () => salvarArquivo(),
        },
        { type: "separator" },
        {
          label: "Sair",
          role: "quit",
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
});

// Função para abrir um arquivo
function abrirArquivo() {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    })
    .then((file) => {
      if (!file.canceled) {
        const conteudo = fs.readFileSync(file.filePaths[0], "utf8");
        mainWindow.webContents.send("arquivo-aberto", conteudo);
      }
    })
    .catch((err) => console.error("Erro ao abrir o arquivo:", err));
}

// Função para salvar um arquivo
function salvarArquivo() {
  dialog
    .showSaveDialog({
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    })
    .then((file) => {
      if (!file.canceled && file.filePath) {
        mainWindow.webContents.send("salvar-arquivo", file.filePath);
      }
    })
    .catch((err) =>
      console.error("Erro ao escolher o local de salvamento:", err)
    );
}

// Receber o conteúdo e salvar no arquivo
ipcMain.on("conteudo-para-salvar", (event, caminho, conteudo) => {
  try {
    fs.writeFileSync(caminho, conteudo, { encoding: "utf8" });
    event.reply("salvar-resposta", "Arquivo salvo com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar o arquivo:", err);
    event.reply("salvar-resposta", "Erro ao salvar o arquivo!");
  }
});

// Fechar a aplicação no macOS quando todas as janelas forem fechadas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
