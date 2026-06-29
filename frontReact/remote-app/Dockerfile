FROM node:krypton-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Executa o build para gerar a pasta 'dist' contendo o remoteEntry.js
RUN npm run build

EXPOSE 5001

# O comando 'vite preview' serve a pasta dist gerada. 
# --host permite conexões externas e --port fixa a porta.
CMD ["npm", "run", "preview", "--", "--port", "5001", "--host"]