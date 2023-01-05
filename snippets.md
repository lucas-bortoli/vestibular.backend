# Popular banco de dados com participantes
1. Vá para a página https://www.4devs.com.br/gerador_de_pessoas
2. Configure o gerador com os campos
3. Selecione output - JSON
4. Gere os dados
5. Execute o seguinte no console:
```js
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var lista = JSON.parse(document.querySelector("#dados_json").value);

var lista2 = lista.map(p => ({
    nome: p.nome,
    cpf: p.cpf,
    email: p.email,
    telefone: p.celular,
    dataNascimento: p.data_nasc.split("/").reverse().join("-"),
    provaOnline: Math.random() > 0.5,
    cursoId: randomIntFromInterval(1, 21)
}));

var sql = lista2.map(v => `INSERT INTO participante (nome, email, cpf, telefone, dataNascimento, provaOnline, cursoId) VALUES ('${v.nome}', '${v.email}', '${v.cpf}', '${v.telefone}', '${v.dataNascimento}', ${v.provaOnline}, ${v.cursoId});`).join("\n")
```