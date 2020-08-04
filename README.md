Link do figma (UX):

# Recuperação de senha

**Requisitos Funcionais (RF)**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve poder receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos Não Funcionais (RNF)**

- Utilizar Mailtrap para testar envio de email em ambiente de desenvolvimento;
- Utilizar Amazon SES para enviar email em produção;
- O envio de e-mail deve acontecer em segundo plano (background job);


**Regras de negócio (RF)**

- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**Requisitos Funcionais (RF)**

- O usuário deve poder atualizar o seu nome, email e password.

**Requisitos Não Funcionais (RNF)**

**Regras de negócio (RF)**

- O usuário não pode alterar seu email para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;


# Painel do prestador

**Requisitos Funcionais (RF)**

- O usuário deve poder listar seus agendamento de um dia específico;
- O prestador deve poder receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;


**Requisitos Não Funcionais (RNF)**

- Os agendamentos do prestador no dia devem ser armazenados no cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;

**Regras de negócio (RF)**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# Agendamento de serviços

**Requisitos Funcionais (RF)**

- O usuário deve poder listar todos prestadores de serviços cadastrados;
- O usuário deve poder listar os dias de um mês com com pelo menos um horáio disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**Requisitos Não Funcionais (RNF)**

- A listagem de prestadores deve ser armazenada em cache;

**Regras de negócio (RF)**

- Cada agendamento deve durar 1h;
- Os agendamentos devem estar disponíveis entre 8h e 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
