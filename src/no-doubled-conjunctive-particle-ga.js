// LICENSE : MIT
"use strict";
import { RuleHelper } from "textlint-rule-helper";
import { getTokenizer } from "kuromojin";
import { splitAST, Syntax as SentenceSyntax } from "sentence-splitter";
import { StringSource } from "textlint-util-to-string";

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
export default function (context, options = {}) {
    const separatorChars = options.separatorChars ?? defaultOptions.separatorChars;
    const helper = new RuleHelper(context);
    const { Syntax, report, getSource, RuleError } = context;
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
                    const conjunctiveParticleGaTokens = tokens.filter(isConjunctiveParticleGaToken);
                    if (conjunctiveParticleGaTokens.length <= 1) {
                        return;
                    }
                    const current = conjunctiveParticleGaTokens[0];
                    const sentenceIndex = source.originalIndexFromPosition(sentence.loc.start) || 0;
                    const currentIndex = sentenceIndex + (current.word_position - 1);
                    report(node, new RuleError(`文中に逆接の接続助詞 "が" が二回以上使われています。`, {
                        index: currentIndex
                    }));
                    return current;
                }
                sentences.forEach(checkSentence);
            });
        }
    }
};
