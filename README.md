# textlint-rule-no-doubled-conjunctive-particle-ga

This module is a textlint plugin to check duplicated conjunctive particle `ga(が)` in a sentence.

逆接の接続助詞「が」は、特に否定の意味ではなくても安易に使われてしまいがちです。これが同一文中に複数回出現していないかどうかをチェックするための[textlint](https://github.com/textlint/textlint "textlint")ルールです。

例

> 今日は早朝から出発した**が**、定刻には間に合わなかった**が**、無事会場に到着した。

"出発した**が**" と "間に合わなかった**が**" が 同じ接続助詞の「が」が連続しています。

> キーワードが多く抽出された**が**、クラスタの数が10ということもある**が**、逆に欠点となるようなキーワードが表示されなかった。

"抽出された**が**" と "こともある**が**" が 同じ接続助詞の「が」が連続しています。

Note: In generally, using same conjunctive particles is not an issue. `ga` is special case.

## Installation

    npm install textlint-rule-no-doubled-conjunctive-particle-ga

### Dependencies

- [azu/kuromojin](https://github.com/azu/kuromojin): a wrapper of [kuromoji.js](https://github.com/takuyaa/kuromoji.js "kuromoji.js")
- [azu/sentence-splitter](https://github.com/azu/sentence-splitter)

## Usage

    textlint --rule no-doubled-conjunctive-particle-ga sample.md

### Options

There's no options for this plugin.

## Tests

    npm test

## Reference

- [textlint](https://github.com/textlint/textlint)
- [textlint-rule-no-doubled-joshi](https://github.com/azu/textlint-rule-no-doubled-joshi): this plugin is based on it
- [中野智彦, 丸山広, 高嶋章雄, 中村太一「文章中の重複表現の指摘方法の提案」, 第73回全国大会講演論文集](https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=108359&item_no=1&page_id=13&block_id=8)

## License

MIT
