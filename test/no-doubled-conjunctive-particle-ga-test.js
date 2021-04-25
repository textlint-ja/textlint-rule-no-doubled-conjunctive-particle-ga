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
        }
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
    ]
});
