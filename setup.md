# Configuração da aplicação
## Requisitos
- Docker
- Uma shell de verdade (quando configurando no Windows)
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
- Execute a aplicação:
  - Exponha a porta 8000, do container, para a internet (o servidor está configurado nessa porta)
  - Crie um volume/bind mount para a pasta `/data` do container. O banco de dados é armazenado em `/data/db.sqlite`, então é essencial que essa pasta tenha persistência.
  ```sh
    docker run \
        --name=vestib-app \
        --publish=8500:8000 \
        --mount type=bind,src=C:\\Users\\user\\Documents\\data,dst=/data \
        vestib
  ```
  O comando acima vai expor o servidor na porta 8500 do host, com o diretório `/data` mapeado para `C:\Users\user\Documents\data` do host. Quando a aplicação iniciar, será criado um banco de dados chamado `db.sqlite` nessa pasta. Feche o container e continue com a configuração.

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
        'mz0m3q0mmzb.stiedemann31@ethereal.email', -- <<< username smtp
        'Bbakn2eF0mzf9rme', -- <<< senha smtp
        1, --- <<< se 1, usará STARTTLS/TLS. ver documentação do nodemailer https://nodemailer.com/smtp/
        'mz0m3q0mmzb.stiedemann31@ethereal.email', -- <<< campo de "sender address" dos e-mails enviados
        0
    );
```
A aplicação sempre usa a última linha da tabela como configuração, independentemente das linhas anteriores.

## Configuração de usuário
A aplicação aceita múltiplos usuários. No entanto, atualmente não há uma interface para o cadastro deles, assim é preciso criar os perfis manualmente e inseri-los no banco de dados.

Utilize essa snippet, em Node.js, que gera o código SQL para a inserção no banco de dados (use um site como [Repl.it](https://replit.com/) ou execute localmente o código):

```js
// -------------------------------

// edite esses campos
const nome = "Fulano Silva";
const username = "fulano.silva";
const password = "12345678";
const roles = ["Admin"]; // não implementado no momento

// -------------------------------

const { randomBytes, createHash } = require("node:crypto");

/**
 * Gera um salt para o usuário, de 32 bytes.
 */
const generateSalt = () => {
  return randomBytes(16).toString("hex");
}

/**
 * Retorna uma hash de uma senha com sua salt.
 * @returns A senha com hash.
 */
const hashPassword = (plainTextPassword, salt) => {
  return createHash("sha512")
    .update(plainTextPassword + salt)
    .digest("hex");
}

const salt = generateSalt();
const hashed = hashPassword(password, salt);

const sql = `
INSERT INTO usuario
 (nome, roles, username, hash_senha, senha_salt)
VALUES
 ('${nome}', '${roles.join(",")}', '${username}', '${hashed}', '${salt}');`;

console.log("\n", sql, "\n");
```

Leve em consideração caracteres perigosos para o SQL no campos.

> ### IMPORTANTE
>
> A aplicação cria um usuário padrão chamado `root` com a senha `1234`. Mude a senha do usuário com o código acima.
> ```sql
> UPDATE usuario SET 
>    hash_senha = '<hash>', 
>    senha_salt = '<salt>' 
>   WHERE username = 'root';
> ```

## Documentos e painéis dentro do website
![Screenshot da página inicial agora](https://i.imgur.com/RF1Mdp8.png)

Acesse a seção restrita (link no fim da página). Faça login com um dos perfis criados anteriormente.

![Dashboard da seção restrito](https://i.imgur.com/mhRqKPH.png)

Coloque os arquivos apropriados em cada campo. Quando exportando arquivos do Word para HTML, **use o formato UTF-8 para a renderização correta nas páginas**.

Na seção *Dados do processo seletivo*, coloque os prazos dos processos seletivos e o tempo da redação.