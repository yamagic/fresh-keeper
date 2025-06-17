FROM golang:1.24.3-alpine AS builder

WORKDIR /app

# モジュールファイルをコピー
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# バイナリをビルド
RUN go build -o main .

# 実行用の軽量イメージ
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# ビルドしたバイナリをコピー
COPY --from=builder /app/main .

# ポートを公開
EXPOSE 8080

CMD ["./main"]
