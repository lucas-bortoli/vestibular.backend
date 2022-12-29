import { createTransport } from "nodemailer";
import { ConfigDAO } from "./database/dao/ConfigDAO.js";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const LOGO_FACINDUSTRIA_DATAURI =
  "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbWFkYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjIyIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMjIgNjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0OCAtNjMpIj4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NDgsMTIzdi0yLjJoMjEuMWM0LjEsMCw0LjgtOC44LDEwLjItOC44aDE1OS4zYzQuMSwwLDQuOC04LjgsMTAuMi04LjhINjcwdjIuMmgtMjEuMgoJCWMtMy42LDAtNC40LDguNi0xMC4xLDguOHYwSDQ3OS4zYy0zLjYsMC00LjQsOC42LTEwLjEsOC44djBINDQ4eiBNNTM0LjIsOTUuNVY4My4xaDV2MTIuN2MwLDMuOCwxLjUsNS44LDQsNS44YzIuNiwwLDQtMS44LDQtNS44CgkJVjgzLjFoNXYxMi40YzAsNi44LTMuNCwxMC4xLTkuMiwxMC4xQzUzNy40LDEwNS43LDUzNC4yLDEwMi42LDUzNC4yLDk1LjVMNTM0LjIsOTUuNXogTTU1NS42LDEwNC4zbDEtNC4xYzEuNywwLjksMy42LDEuNCw1LjUsMS40CgkJYzIuMywwLDMuNS0wLjksMy41LTIuNGMwLTEuNC0xLTIuMi0zLjctMy4xYy0zLjctMS4zLTYuMS0zLjQtNi4xLTYuNmMwLTMuOCwzLjItNi43LDguMy02LjdjMS45LTAuMSwzLjksMC4zLDUuNiwxLjFsLTEuMSw0CgkJYy0xLjQtMC43LTMtMS4xLTQuNi0xLjFjLTIuMiwwLTMuMiwxLTMuMiwyLjFjMCwxLjQsMS4yLDIsNC4xLDMuMWMzLjksMS40LDUuNywzLjUsNS43LDYuNmMwLDMuNy0yLjgsNi45LTguOCw2LjkKCQlDNTU5LjYsMTA1LjcsNTU3LjUsMTA1LjIsNTU1LjYsMTA0LjN6IE01MTEuNCwxMDUuMlY4My41YzIuMi0wLjMsNC40LTAuNSw2LjctMC41YzQuMiwwLDcsMC44LDksMi40YzIuMywxLjcsMy43LDQuNCwzLjcsOC40CgkJYzAsNC4yLTEuNSw3LjItMy42LDljLTIuMywxLjktNS45LDIuOS0xMC4yLDIuOUM1MTUuMiwxMDUuNiw1MTMuMywxMDUuNSw1MTEuNCwxMDUuMnogTTUxNi40LDg3djE0LjVjMC42LDAuMSwxLjEsMC4xLDEuNywwLjEKCQljNC41LDAsNy41LTIuNSw3LjUtNy44YzAtNC42LTIuNy03LTctN0M1MTcuOSw4Ni44LDUxNy4xLDg2LjksNTE2LjQsODdMNTE2LjQsODd6IE02MzMuNywxMDUuM2wtMS43LTUuN2gtNi4zbC0xLjYsNS43SDYxOQoJCWw2LjctMjIuMmg2LjVsNi45LDIyLjJMNjMzLjcsMTA1LjN6IE02MjcuNyw5MS4ybC0xLjMsNC43aDQuOWwtMS40LTQuN2MtMC40LTEuMy0wLjgtMy0xLjEtNC4zaC0wLjEKCQlDNjI4LjQsODguMiw2MjguMSw4OS45LDYyNy43LDkxLjJMNjI3LjcsOTEuMnogTTYxMS4zLDEwNS4zVjgzLjFoNXYyMi4ySDYxMS4zeiBNNjAzLjUsMTA1LjNjLTAuNy0xLjctMS4yLTMuNC0xLjUtNS4yCgkJYy0wLjYtMi44LTEuNi0zLjUtMy42LTMuNmgtMS41djguN2gtNC45VjgzLjRjMi4yLTAuMyw0LjQtMC41LDYuNi0wLjVjMy4zLDAsNS42LDAuNSw3LjEsMS43YzEuNCwxLjEsMi4yLDIuOSwyLjEsNC43CgkJYzAsMi40LTEuNiw0LjYtMy45LDUuNHYwLjFjMS41LDAuNiwyLjQsMi4xLDIuOSw0LjFjMC43LDIuNSwxLjMsNS40LDEuOCw2LjNMNjAzLjUsMTA1LjN6IE01OTYuOSw4Ni45VjkzaDJjMi41LDAsMy45LTEuMywzLjktMy4yCgkJYzAtMi0xLjQtMy4xLTMuNy0zLjFDNTk4LjQsODYuNyw1OTcuNiw4Ni44LDU5Ni45LDg2LjlMNTk2LjksODYuOXogTTU3OC4zLDEwNS4zdi0xOGgtNS45di00LjJoMTYuOXY0LjJoLTZ2MThINTc4LjN6CgkJIE01MDEuOSwxMDUuM2wtNC43LTguNmMtMS40LTIuNS0yLjctNS4yLTMuOC03LjhoLTAuMWMwLjIsMywwLjIsNi4xLDAuMiw5Ljd2Ni43aC00LjZWODMuMWg1LjhsNC42LDguMWMxLjMsMi41LDIuNSw1LDMuNiw3LjZoMC4xCgkJYy0wLjMtMi45LTAuNC01LjktMC40LTkuM3YtNi41aDQuNnYyMi4ySDUwMS45eiBNNDc5LjYsMTA1LjNWODMuMWg1djIyLjJINDc5LjZ6IE01NDIsODMuMWwyLTNoMy44bC0yLjksM0g1NDJ6IE01MTUuMSw3Mi4xdi04LjkKCQloMnY4LjljMCwzLjQsMS41LDQuOCwzLjUsNC44YzIuMiwwLDMuNy0xLjUsMy43LTQuOHYtOC45aDJ2OC44YzAsNC42LTIuNCw2LjUtNS43LDYuNUM1MTcuNCw3OC42LDUxNS4xLDc2LjgsNTE1LjEsNzIuMXoKCQkgTTU5My40LDc3LjZsMC41LTEuNmMxLjEsMC42LDIuMywxLDMuNSwxYzIsMCwzLjItMS4xLDMuMi0yLjZjMC0xLjQtMC44LTIuMi0yLjgtM2MtMi41LTAuOS00LTIuMi00LTQuM2MwLTIuNCwxLjktNC4xLDQuOS00LjEKCQljMS4yLDAsMi4zLDAuMiwzLjMsMC43bC0wLjUsMS42Yy0wLjktMC41LTEuOS0wLjctMi45LTAuN2MtMi4xLDAtMi44LDEuMi0yLjgsMi4zYzAsMS40LDAuOSwyLjEsMywyLjljMi41LDEsMy44LDIuMiwzLjgsNC40CgkJYzAsMi4zLTEuNyw0LjMtNS4zLDQuM0M1OTUuOSw3OC42LDU5NC42LDc4LjMsNTkzLjQsNzcuNnogTTUwMS4yLDcwLjljLTAuMi00LjEsMi45LTcuNyw3LTcuOWMwLjMsMCwwLjUsMCwwLjgsMAoJCWMxLjItMC4xLDIuNSwwLjIsMy42LDAuN2wtMC41LDEuNmMtMS0wLjQtMi0wLjYtMy0wLjZjLTMuNSwwLTUuOSwyLjMtNS45LDYuMmMwLDMuNywyLjEsNi4xLDUuOCw2LjFjMS4xLDAsMi4yLTAuMiwzLjItMC42CgkJbDAuNCwxLjVjLTEuMywwLjUtMi42LDAuOC00LDAuN0M1MDQuNCw3OC42LDUwMS4yLDc1LjksNTAxLjIsNzAuOXogTTYxMCw3OC4zVjYzLjVjMS40LTAuMiwyLjctMC4zLDQuMS0wLjNjMi44LDAsNC44LDAuNyw2LjEsMS45CgkJYzEuNSwxLjQsMi4yLDMuNCwyLjEsNS40YzAuMSwyLjItMC43LDQuMy0yLjIsNS45Yy0xLjQsMS40LTMuNywyLjItNi43LDIuMkM2MTIuMyw3OC41LDYxMS4xLDc4LjQsNjEwLDc4LjN6IE02MTEuOSw2NC45djExLjkKCQljMC43LDAuMSwxLjMsMC4xLDIsMC4xYzQuMiwwLDYuNC0yLjMsNi40LTYuNGMwLTMuNi0yLTUuOC02LjEtNS44QzYxMy40LDY0LjcsNjEyLjcsNjQuNyw2MTEuOSw2NC45eiBNNTY4LjMsNzguM1Y2My41CgkJYzEuNC0wLjIsMi44LTAuMyw0LjEtMC4zYzIuOCwwLDQuOCwwLjcsNi4xLDEuOWMxLjUsMS40LDIuMiwzLjQsMi4xLDUuNGMwLjEsMi4yLTAuNyw0LjMtMi4yLDUuOWMtMS40LDEuNC0zLjcsMi4yLTYuNywyLjIKCQlDNTcwLjcsNzguNSw1NjkuNSw3OC40LDU2OC4zLDc4LjN6IE01NzAuMyw2NC45djExLjljMC43LDAuMSwxLjMsMC4xLDIsMC4xYzQuMiwwLDYuNC0yLjMsNi40LTYuNGMwLTMuNi0yLTUuOC02LjEtNS44CgkJQzU3MS44LDY0LjcsNTcxLDY0LjcsNTcwLjMsNjQuOXogTTU0MC4xLDc4LjNWNjMuNWMxLjQtMC4yLDIuNy0wLjMsNC4xLTAuM2MyLjgsMCw0LjgsMC43LDYuMSwxLjljMS41LDEuNCwyLjIsMy40LDIuMSw1LjQKCQljMC4xLDIuMi0wLjcsNC4zLTIuMiw1LjljLTEuNCwxLjQtMy43LDIuMi02LjcsMi4yQzU0Mi40LDc4LjUsNTQxLjMsNzguNCw1NDAuMSw3OC4zeiBNNTQyLDY0Ljl2MTEuOWMwLjcsMC4xLDEuMywwLjEsMiwwLjEKCQljNC4yLDAsNi40LTIuMyw2LjQtNi40YzAtMy42LTItNS44LTYuMS01LjhDNTQzLjUsNjQuNyw1NDIuOCw2NC43LDU0Miw2NC45TDU0Miw2NC45eiBNNjMzLjksNzguNGwtMS42LTQuN0g2MjdsLTEuNiw0LjdoLTIKCQlsNS4xLTE1LjFoMi4zbDUuMSwxNS4xSDYzMy45eiBNNjI4LjgsNjcuN2wtMS41LDQuNGg0LjVsLTEuNS00LjNjLTAuMy0xLTAuNi0xLjktMC44LTIuOGgwQzYyOS40LDY1LjksNjI5LjEsNjYuOCw2MjguOCw2Ny43egoJCSBNNTgzLjIsNzguNFY2My4zaDguMXYxLjZoLTYuMnY0LjhoNS45djEuNmgtNS45djUuNGg2LjV2MS42SDU4My4yeiBNNTY0LDc4LjRsLTEuNi00LjdoLTUuM2wtMS42LDQuN2gtMmw1LjEtMTUuMWgyLjNsNS4xLDE1LjEKCQlMNTY0LDc4LjR6IE01NTksNjcuN2wtMS41LDQuNGg0LjVsLTEuNS00LjNjLTAuMy0xLTAuNi0xLjktMC44LTIuOGgwQzU1OS41LDY1LjksNTU5LjMsNjYuOCw1NTksNjcuN3ogTTUyOS41LDc4LjRWNjMuM2gxLjl2MTMuNQoJCWg2LjR2MS42SDUyOS41eiBNNDk4LjIsNzguNGwtMS42LTQuN2gtNS4zbC0xLjYsNC43aC0ybDUuMS0xNS4xaDIuM2w1LjEsMTUuMUw0OTguMiw3OC40eiBNNDkzLjEsNjcuN2wtMS41LDQuNGg0LjVsLTEuNS00LjMKCQljLTAuMy0xLTAuNi0xLjktMC44LTIuOGgwQzQ5My42LDY1LjksNDkzLjQsNjYuOCw0OTMuMSw2Ny43eiBNNDc5LjYsNzguNFY2My4zaDguMXYxLjZoLTYuMnY1aDUuN3YxLjZoLTUuN3Y2LjhMNDc5LjYsNzguNHoiLz4KPC9nPgo8L3N2Zz4K";

const EMAIL_TEMPLATE = `
  <!DOCTYPE html>
  <html lang="br">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <div style="padding: 32px; background-color: #403f82">
        <img src="cid:logoindustria.svg" style="max-width: 200px; width: 100%" />
      </div>
      {{emailBody}}
    </body>
  </html>
`;

export class Mail {
  private async create() {
    const config = await new ConfigDAO().getConfig();
    const smtpSenderAddress = config.smtpSenderAddress;

    const secure = config.smtpPort === 465;

    const transport = createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: secure,
      auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
      },
    });

    return { transport, smtpSenderAddress };
  }

  /**
   * Envia um e-mail de registro.
   * @param destinationEmail E-mail de destino.
   * @param userInfo
   */
  async sendRegisterMail(destinationEmail: string, userInfo: { name: string }) {
    const { transport, smtpSenderAddress } = await this.create();

    return transport.sendMail({
      sender: smtpSenderAddress,
      to: destinationEmail,
      subject: "Inscrição confirmada!",
      text: `Parabéns ${userInfo.name}! Sua inscrição no vestibular das Faculdades da Indústria foi confirmada!`,
      html: EMAIL_TEMPLATE.replace(
        "{{emailBody}}",
        `<h1>Inscrição confirmada</h1>
        <p>Parabéns ${escapeHtml(userInfo.name)}!</p>
        <p>Sua inscrição para o vestibular das Faculdades da Indústria foi confirmada.</p>`
      ),
      attachments: [
        {
          filename: "logoindustria.svg",
          cid: "logoindustria.svg",
          content: Buffer.from(LOGO_FACINDUSTRIA_DATAURI, "base64"),
        },
      ],
    });
  }
}
