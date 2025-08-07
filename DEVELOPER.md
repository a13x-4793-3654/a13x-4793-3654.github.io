# 開発者向け README

## 新しいファイル構造

コードの重複を減らし、メンテナンスを簡素化するために、共通部分を別ファイルに分離しました。

### 主な変更点

1. **共通データの集約** (`data/common.json`)
   - ヘッダー、フッター、メタデータの一元管理
   - ページタイトルとアクティブ状態の管理

2. **共通機能** (`js/common.js`)
   - ヘッダー・フッターの動的読み込み
   - メタタグの自動生成
   - ナビゲーションのアクティブ状態管理
   - サブディレクトリのパス対応

3. **簡潔なHTMLページ**
   - 各ページはプレースホルダーとメインコンテンツのみ
   - 重複コードの大幅削減

### ファイル構造

```
├── data/
│   ├── common.json      # 共通データ（ヘッダー、フッター、メタデータ）
│   └── articles.json    # 記事メタデータ
├── js/
│   ├── common.js        # 共通機能ライブラリ
│   └── script.js        # ページ固有の機能
├── templates/
│   ├── base.html        # ベーステンプレート
│   └── article-template.html  # 記事テンプレート
├── css/
│   └── style.css        # 共通スタイル
├── howto/
│   └── *.html          # Howto記事
├── index.html          # ホームページ
├── about.html          # 自己紹介ページ
└── howto.html          # Howto一覧ページ
```

## 新しいページの作成方法

### 1. 通常のページを作成

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <!-- Meta tags and styles will be loaded by common.js -->
</head>
<body>
    <!-- Header Placeholder -->
    <div id="header-placeholder"></div>

    <main>
        <!-- ページ固有のコンテンツ -->
    </main>

    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>

    <!-- Load common functionality first -->
    <script src="js/common.js"></script>
    <!-- Then load page-specific script -->
    <script src="js/script.js"></script>
</body>
</html>
```

### 2. common.jsonにページ情報を追加

```json
{
  "pages": {
    "new-page": {
      "title": "新しいページ - a13x",
      "active": "new-page"
    }
  }
}
```

### 3. Howto記事の作成

1. `templates/article-template.html`をコピー
2. `howto/`フォルダーに保存
3. 内容を編集

## 利点

- **コード重複の削減**: 共通部分は1箇所のみで管理
- **メンテナンスの簡素化**: ヘッダー・フッター変更時は1ファイルのみ編集
- **一貫性の向上**: 全ページで統一されたレイアウト
- **新規ページ作成の高速化**: テンプレートを使用して素早く作成

## 技術仕様

- **ES6+**: モダンなJavaScript機能を使用
- **Fetch API**: 非同期データ読み込み
- **DOM操作**: 動的なコンテンツ生成
- **相対パス対応**: サブディレクトリのファイルも正しく動作

これにより、コーディング量を大幅に削減し、サイトの拡張と保守が容易になりました。
