// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import {getTokenizer} from "kuromojin";
import splitSentences, {Syntax as SentenceSyntax} from "sentence-splitter";
import StringSource from "textlint-util-to-string";

const defaultOptions = {
    separatorChars: ["。", "?", "!", "？", "！"]
};
// ref: https://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

/*
    1. Paragraph Node -> text
    2. text -> sentences
    3. tokenize sentence
    4. report error if found word that match the rule.

    TODO: need abstraction
 */
export default function (context, options = {}) {
    const separatorChars = options.separatorChars || defaultOptions.separatorChars;
    const helper = new RuleHelper(context);
    const {Syntax, report, getSource, RuleError} = context;
    return {
        [Syntax.Paragraph](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const source = new StringSource(node);
            const text = source.toString();
            const isSentenceNode = node => {
                return node.type === SentenceSyntax.Sentence;
            };
            const charRegExp = new RegExp("[" + RegExp.escape(separatorChars.join("")) + "]");
            let sentences = splitSentences(text, {
                charRegExp: charRegExp
            }).filter(isSentenceNode);
            return getTokenizer().then(tokenizer => {
              const checkSentence = (sentence) => {
                let tokens = tokenizer.tokenizeForSentence(sentence.raw);
                const isConjunctiveParticleGaToken = token => {
                  return token.pos_detail_1 === "接続助詞" && token.surface_form === "が";
                };
                let conjunctiveParticleGaTokens = tokens.filter(isConjunctiveParticleGaToken);
                if (conjunctiveParticleGaTokens.length <= 1) {
                  return;
                }
                let current = conjunctiveParticleGaTokens[0];
                let originalPosition = source.originalPositionFor({
                  line: sentence.loc.start.line,
                  column: sentence.loc.start.column + (current.word_position - 1)
                });
                // padding position
                var padding = {
                  line: originalPosition.line - 1,
                  // matchLastToken.word_position start with 1
                  // this is padding column start with 0 (== -1)
                  column: originalPosition.column
                };
                report(node, new RuleError(`文中に逆接の接続助詞 "が" が二回以上使われています。`, padding));
                return current;
              }
              sentences.forEach(checkSentence);
            });
        }
    }
};
