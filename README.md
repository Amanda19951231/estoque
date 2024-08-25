# estoque

Configurar para Executar na Inicialização do Sistema

Para que a aplicação seja executada automaticamente quando o sistema for iniciado, você pode criar um atalho para o script e colocá-lo na pasta de inicialização do sistema.

No Windows:

Crie um arquivo start.bat com o seguinte conteúdo:

@echo off
cd C:\caminho\para\seu\projeto
node index.js

Coloque esse arquivo start.bat na pasta de inicialização do Windows:

%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
