import assert from "power-assert";
import rule from "../src/no-doubled-conjunctive-particle-ga";
import TextLintTester from "textlint-tester";
var tester = new TextLintTester();
tester.run("no-doubled-conjunctive-particle-ga", rule, {
    valid: [
        "この関数がエラーになるのは、関数名が正しくないためです。",
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
            text: "今日は早朝から出発したが，定刻には間に合わなかった．間に合わなかったが，無事会場に到着した．",
            errors: [
                {
                    message: `文中に逆接の接続助詞 "が" が二回以上使われています。`,
                    // last match
                    line: 1,
                    column: 12
                }
            ]
        }
    ]
});
