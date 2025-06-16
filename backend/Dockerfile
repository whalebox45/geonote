# backend/Dockerfile
FROM node:22

# 設定工作目錄
WORKDIR /app

# 複製檔案
COPY package*.json ./
RUN npm install

COPY . .

# 開放 3000 port
EXPOSE 3000

# 使用 nodemon 方便開發（建議全域裝）
RUN npm install -g nodemon
CMD ["nodemon","--legacy-watch", "index.js"]
