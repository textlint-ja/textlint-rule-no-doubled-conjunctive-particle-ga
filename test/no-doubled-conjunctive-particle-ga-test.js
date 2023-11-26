import TextLintTester from "textlint-tester";
import rule from '../src/no-doubled-conjunctive-particle-ga';

const tester = new TextLintTester();
tester.run("no-doubled-conjunctive-particle-ga", rule, {
    valid: [
        "この関数がエラーになるのは、関数名が正しくないためです。",
        "この文章が問題となっています。",
        "今日は早朝から出発したが、定刻には間に合わなかった。が、無事会場に到着した。",
        {
            text: "今日は早朝から出発したが，定刻には間に合わなかった．間に合わなかったが，無事会場に到着した．",
            options: {
                separatorChars: ["。", "?", "!", "？", "！", "．"]
            }
        },
        // 括弧の中の区切り文字判定
        // https://github.com/textlint-ja/textlint-rule-no-doubled-conjunctive-particle-ga/issues/19
        "今日は早朝から出発したが、定刻には間に合わなかった。定刻には間に合わなかったが、無事会場に到着した",
        "「今日は早朝から出発したが、定刻には間に合わなかった。定刻には間に合わなかったが、無事会場に到着した」"
    ],
    invalid: [
        {
            text: "今日は早朝から出発したが、定刻には間に合わなかったが、無事会場に到着した。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    // last match
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            text: "規模は小さいが、収益は多いが、実益は小さい。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    index: 6
                }
            ]
        },
        {
            // https://ipsj.ixsq.nii.ac.jp/ej/index.php?action=pages_view_main&active_action=repository_action_common_download&item_id=108359&item_no=1&attribute_id=1&file_no=1&page_id=13&block_id=8 から引用
            text: "キーワードが多く抽出されたが、クラスタの数が10ということもあるが、逆に欠点となるようなキーワードが表示されなかった。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    index: 13
                }
            ]
        },
        // option test
        {
            text: "今日は早朝から出発したが，定刻には間に合わなかった．間に合わなかったが，無事会場に到着した．",
            options: {
                separatorChars: ["。"] // ． を除外
            },
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            text: "こんにちは。\n今日は早朝から出発したが、定刻には間に合わなかったが、無事会場に到着した。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    line: 2,
                    column: 12
                }
            ]
        },
        {
            text: "\n今日は早朝から出発したが、定刻には間に合わなかったが、無事会場に到着した。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    line: 2,
                    column: 12
                }
            ]
        },
        // range
        {
            text: "\n今日は早朝から出発したが、定刻には間に合わなかったが、無事会場に到着した。",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    range: [12, 13]
                }
            ]
        },
    ]
});
