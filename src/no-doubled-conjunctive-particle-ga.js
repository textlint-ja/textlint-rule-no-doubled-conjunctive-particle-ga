// LICENSE : MIT
"use strict";
import { RuleHelper } from "textlint-rule-helper";
import { getTokenizer } from "kuromojin";
import { splitAST, SentenceSplitterSyntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";


/**
 * tokensから、区切り文字で分割したtokensの配列を返す
 * 結果は [[token, token], [token, token]] のような配列になる
 * @param {*[]} tokens
 * @param {string[]} separatorChars
 * @returns {*[][]}
 */
const splitTokensBySeparatorChars = (tokens, separatorChars) => {
    const results = [];
    let current = [];
    tokens.forEach(token => {
        if (separatorChars.includes(token.surface_form)) {
            results.push(current);
            current = [];
        } else {
            current.push(token);
        }
    });
    if (current.length > 0) {
        results.push(current);
    }
    return results;
}

const defaultOptions = {
    separatorChars: [
        ".", // period
        "．", // (ja) zenkaku-period
        "。", // (ja) 句点
        "?", // question mark
        "!", //  exclamation mark
        "？", // (ja) zenkaku question mark
        "！" // (ja) zenkaku exclamation mark
    ]
};

/*
    1. Paragraph Node -> text
    2. text -> sentences
    3. tokenize sentence
    4. report error if found word that match the rule.

    TODO: need abstraction
 */
/**
 * @param {import("@textlint/types").TextlintRuleContext} context
 * @param {*} options
 * @returns {import("@textlint/types").TextlintRuleReportHandler}
 */
export default function (context, options = {}) {
    const separatorChars = options.separatorChars ?? defaultOptions.separatorChars;
    const helper = new RuleHelper(context);
    const { Syntax, report, getSource, RuleError, locator } = context;
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const isSentenceNode = node => {
                return node.type === SentenceSyntax.Sentence;
            };
            const sentences = splitAST(node, {
                SeparatorParser: {
                    separatorCharacters: separatorChars
                }
            }).children.filter(isSentenceNode);
            const source = new StringSource(node);
            return getTokenizer().then(tokenizer => {
                const checkSentence = (sentence) => {
                    const sentenceText = getSource(sentence);
                    const tokens = tokenizer.tokenizeForSentence(sentenceText);
                    const isConjunctiveParticleGaToken = token => {
                        return token.pos_detail_1 === "接続助詞" && token.surface_form === "が";
                    };
                    // カッコの中はセンテンスとして分解されないため、
                    // 区切り文字で分割したtokensの配列を取得
                    const tokensBySentence = splitTokensBySeparatorChars(tokens, separatorChars);
                    tokensBySentence.forEach(tokens => {
                        const conjunctiveParticleGaTokens = tokens.filter(isConjunctiveParticleGaToken);
                        if (conjunctiveParticleGaTokens.length <= 1) {
                            return;
                        }
                        const current = conjunctiveParticleGaTokens[0];
                        const sentenceIndex = source.originalIndexFromPosition(sentence.loc.start) || 0;
                        const currentIndex = sentenceIndex + (current.word_position - 1);
                        report(node, new RuleError(`文中に逆接の接続助詞 "が" が二回以上使われています。`, {
                            padding: locator.range([currentIndex, currentIndex + 1])
                        }));
                    });
                }
                sentences.forEach(checkSentence);
            });
        }
    }
};
