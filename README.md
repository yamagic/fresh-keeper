# Fresh Keeper

食品の賞味期限を追跡するためのフルスタックWebアプリケーション

## 概要

Fresh Keeperは、食品の在庫管理と賞味期限追跡を行うWebアプリケーションです。ユーザーは食品の賞味期限を効率的に管理し、期限切れ前に適切な通知を受け取ることができます。

## 技術スタック

### バックエンド
- **Go** (Echo + GORM + PostgreSQL)
- **JWT認証** & **CSRF保護**
- **クリーンアーキテクチャ**パターン

### フロントエンド
- **React 18** + **TypeScript**
- **Vite** (開発環境)
- **Material-UI** (UIコンポーネント)
- **React Router** (ルーティング)
- **React Query** (データフェッチング・キャッシュ)
- **Zustand** (状態管理)
- **React Hook Form + Zod** (フォーム管理・バリデーション)

### インフラ
- **PostgreSQL** (データベース)
- **Docker + Docker Compose** (コンテナ化)

## 開発履歴

- **バックエンドAPI**: 手動開発
- **フロントエンド**: Claude Code (claude.ai/code) によって完全に設計・実装

## 主要機能

- **ユーザー認証** (登録・ログイン・ログアウト)
- **食品在庫管理** (追加・編集・削除)
- **賞味期限追跡** (消費期限・賞味期限対応)
- **期限切れ通知**
- **ダッシュボード** (統計・急を要する製品表示)

## クイックスタート

### 必要要件

- Docker & Docker Compose
- Node.js (フロントエンド開発用)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fresh-keeper
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```bash
PORT=8080
POSTGRES_USER=postgres
POSTGRES_PW=postgres
POSTGRES_DB=expiry_tracker
POSTGRES_PORT=5434
POSTGRES_HOST=localhost
SECRET=your-jwt-secret-key
GO_ENV=dev
API_DOMAIN=localhost
FE_URL=http://localhost:5173
```

### 3. アプリケーションの起動

```bash
# バックエンド + データベースを起動
docker-compose up -d

# フロントエンドを起動 (別ターミナル)
cd fresh-keeper-frontend
npm install
npm run dev
```

### 4. アクセス

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8080

## アーキテクチャ

### バックエンド構成

```
controller/ → router/ → usecase/ → repository/ → model/
                    ↓
                validator/
```

### フロントエンド構成

```
pages/ → hooks/ → services/ → API (バックエンド)
  ↓       ↓
components/ stores/
```

## API エンドポイント

### パブリック
- `POST /signup` - ユーザー登録
- `POST /login` - ログイン
- `POST /logout` - ログアウト
- `GET /csrf` - CSRFトークン取得

### 認証必須
- `GET /products` - 製品一覧
- `POST /products` - 製品作成
- `GET /products/:id` - 製品詳細
- `PUT /products/:id` - 製品更新
- `DELETE /products/:id` - 製品削除

## データベース

PostgreSQLを使用し、以下のテーブルで構成：

- **users** - ユーザー情報
- **products** - 食品・製品情報

## 開発コマンド

### バックエンド

```bash
# ローカル実行
go run main.go

# ビルド
go build -o main .

# Docker実行
docker-compose up -d
```

### フロントエンド

```bash
cd fresh-keeper-frontend

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## セキュリティ

- **JWT認証** (HTTPOnly Cookie)
- **CSRF保護** (トークンベース)
- **CORS設定** (フロントエンド統合)
- **型安全性** (TypeScript)
- **入力検証** (バックエンド・フロントエンド両方)