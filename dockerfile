# Use uma imagem Node.js próxima da versão 20.16
FROM node:20-alpine

# Instale o pnpm e o Nest CLI globalmente
RUN npm install -g pnpm @nestjs/cli

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo .env para o contêiner
COPY .env .env

# Copie os arquivos do projeto para o contêiner
COPY . .

# Instale todas as dependências, incluindo as devDependencies
RUN pnpm install --frozen-lockfile

# Exclua as pastas node_modules e dist, caso estejam presentes na imagem, para garantir uma nova instalação
RUN rm -rf node_modules dist

# Instale novamente apenas as dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Compilar o projeto TypeScript utilizando o Nest CLI global
RUN pnpm run build

# Exponha a porta em que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
