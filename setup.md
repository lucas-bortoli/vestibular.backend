# Configuração da aplicação
## Requisitos
- Docker
- Git Bash (quando configurando no Windows)
- Node.js LTS mais recente, npm
- Servidor SMTP configurado

## Configuração do Docker
- Clone o repositório do backend com submódulos:
  ```sh
  git clone --recurse-submodules https://github.com/lucas-bortoli/br.org.faculdadesdaindustria.vestibular.backend
  ```
- Crie o container da aplicação:
    ```sh
    docker build -t vestib .
    ```
- Crie a imagem Docker
    ```sh
    npm run build
    (cd ./frontend && npm run build)
    ```
- Execute a aplicação
  - Exponha a porta 8000, do container, para a internet (o servidor está configurado nessa porta)
  - Crie um volume/bind mount para a pasta `/data` do container. O banco de dados é armazenado em `/data/db.sqlite`, então é essencial que essa pasta tenha persistência.
  ```sh
    docker run \
        --name=vestib-app \
        --publish=8500:8000 \
        --mount type=bind,src=C:\\Users\\user\\Documents\\data,dst=/data \
        vestib
  ```
  O comando acima vai expor o servidor na porta 8500 do host, com o diretório `/data` mapeado para `C:\Users\user\Documents\data` do host.

## Configuração SMTP
Os parâmetros SMTP estão armazenados no banco de dados, na tabela `config`. Para editá-los, abra o banco em um programa como DB Browser for SQLite e execute o seguinte código, alterando os parâmetros conforme necessário:
```sql
INSERT INTO
    config (
        processoSeletivoInicioUnix,
        processoSeletivoFimUnix,
        processoSeletivoDescricaoHtml,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpSecure,
        smtpSenderAddress,
        redacaoTempo
    )
VALUES
    (
        0,
        0,
        '',
        'smtp.ethereal.email', -- <<< host smtp
        587, -- <<< porta smtp
        'letha.stiedemann31@ethereal.email', -- <<< username smtp
        'Bb8JksVvw6QtQVDrme', -- <<< senha smtp
        1, --- <<< se 1, usará STARTTLS/TLS. ver documentação do nodemailer https://nodemailer.com/smtp/
        'letha.stiedemann31@ethereal.email', -- <<< campo de "sender address" dos e-mails enviados
        0
    );
```
A aplicação sempre usa a última linha da tabela como configuração, independentemente das linhas anteriores.