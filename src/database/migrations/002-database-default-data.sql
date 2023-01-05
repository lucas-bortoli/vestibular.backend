--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
INSERT INTO
    campus (nome)
VALUES
    ('Curitiba - Campus da Indústria'),
    ('Curitiba - CIC'),
    ('Londrina'),
    ('São José dos Pinhais');

INSERT INTO
    curso (campusId, nome)
VALUES
    (1, 'Design de Moda'),
    (1, 'Engenharia Automotiva'),
    (1, 'Engenharia de Energias'),
    (2, 'Automação Industrial'),
    (2, 'Engenharia de Produção'),
    (2, 'Engenharia de Software'),
    (2, 'Engenharia Mecânica'),
    (2, 'Engenharia Mecatrônica'),
    (2, 'Fabricação Mecânica'),
    (3, 'Automação Industrial'),
    (3, 'Engenharia de Software'),
    (3, 'Engenharia Elétrica'),
    (3, 'Engenharia Mecânica'),
    (4, 'Administração'),
    (4, 'Ciências Contábeis'),
    (4, 'Direito'),
    (4, 'Engenharia de Produção'),
    (4, 'Engenharia de Software'),
    (4, 'Logística'),
    (4, 'Pedagogia'),
    (4, 'Sistemas de Informação');

INSERT INTO
    usuario (nome, roles, username, hash_senha, senha_salt)
VALUES
    (
        'usuário padrão',
        'Admin',
        'root',
        '961eeaa0a0ffc1cf292d0468c3c3e8997c9d2849de98b75a7699171f7507b611e7e7523eac04a64d4d25154c9fb5c44825cbf198373aed99da8c4b3d7b54eb6c',
        'cb20724e9c8a414c30106a8a8b6b1432'
    );

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
        1672620815052,
        1673225622094,
        '<h1>Configurar aplicação</h1><p>A aplicação não está configurada devidamente.</p>',
        'smtp.ethereal.email',
        587,
        'letha.stiedemann31@ethereal.email',
        'Bb8JksVvw6QtQVDrme',
        1,
        'letha.stiedemann31@ethereal.email',
        60000
    );

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DELETE FROM
    usuario
WHERE
    username = 'root'
    AND senha = '961eeaa0a0ffc1cf292d0468c3c3e8997c9d2849de98b75a7699171f7507b611e7e7523eac04a64d4d25154c9fb5c44825cbf198373aed99da8c4b3d7b54eb6c';

DELETE FROM
    config
WHERE
    smtpUser = 'letha.stiedemann31@ethereal.email';