const { ipcRenderer } = require("electron");

const textarea = document.getElementById("editor");

// Receber o conteúdo do arquivo aberto
ipcRenderer.on("arquivo-aberto", (event, conteudo) => {
  textarea.value = conteudo;
});

// Atualizar o caminho do arquivo ao salvar
ipcRenderer.on("salvar-arquivo", (event, caminho) => {
  textarea.dataset.caminho = caminho;
  ipcRenderer.send("conteudo-para-salvar", caminho, textarea.value);
});

// Exibir resposta do salvamento
ipcRenderer.on("salvar-resposta", (event, mensagem) => {
  alert(mensagem);
});
