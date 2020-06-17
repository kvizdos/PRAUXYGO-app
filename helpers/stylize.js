import React from 'react';
import { Text, StyleSheet } from 'react-native';

let __inMultilineComment = false;
const dontTabFor = "<!--, area, base, br, col, command, embed, hr, img, input, keygen, link, meta, param, source, track, wbr"

const tagParser = (tag, couldBeText = false) => {
    const fullAttr = new RegExp(/(\w*\s?)=(\s?)"(.+?)"/gm);
    const partialAttr = new RegExp(/ (\w*(?!\s?=\s?))(?=[\s|>])/gm);
    
    if(fullAttr.test(tag)) {
        const match = tag.match(fullAttr);

        let editedTag = [<Text key={Math.floor(Math.random() * 1000000000)} style={styles.tagName}>{tag.split(" ")[0]} </Text>];

        for(let i = 0; i < match.length; i++) {
            // console.log(match[i])
            const attr = match[i].split("=");

            const coloredAttr = [
                <Text key={Math.floor(Math.random() * 1000000000)} style={styles.tagAttribute}>{attr[0]}</Text>,
                <Text key={Math.floor(Math.random() * 1000000000)}style={styles.tagName}>=</Text>,
                <Text key={Math.floor(Math.random() * 1000000000)} style={styles.tagAttributeValue}>{attr[1]}{i != match.length - 1 ? " " : ""}</Text>
            ]

            editedTag.push(coloredAttr)
        }     
        return editedTag;
    }

    return <Text key={Math.floor(Math.random() * 1000000000)} style={[!couldBeText ? styles.tagName : styles.tagContainer, styles.spacing]}>{tag}</Text>;
}

const getTag = (line) => {
    const l = line.split(" ")[0].trim().replace("<", "").replace(">", "");
    return l.length > 0 ? l : "__PRAUXYDONTMATCH__";
}

export const stylize = (line, key, appendNewLine = false, addSpacing = true) => {
    const tagMatch = new RegExp(/^(\s)*<(.*?)>(.*)?(?:<\/(.*?)>)/gm);
    const partialTagMatch = new RegExp(/^(\s)*<(.*?)>/gm);
    
    const commentSyntax = new RegExp(/(?:<?)!-- (.+?) --(?:>?)/gm);
    const multilineCommentStart = new RegExp(/(?:<?)!--(.*?)/gm);
    const multilineCommentEnd = new RegExp(/--(?:>?)/gm);

    if(__inMultilineComment) {
        if(line.indexOf("-->") != -1) __inMultilineComment = false;
        
    return <Text key={key} style={[styles.comment, styles.spacing]}>{line}{appendNewLine ? "\n" : ""}</Text>
    }

    if(commentSyntax.test(line) || multilineCommentStart.test(line)) {
        if(line.indexOf("<!--") != -1) __inMultilineComment = true;
        if(line.indexOf("-->") != -1) __inMultilineComment = false;

        return <Text key={key} style={[styles.comment, styles.spacing]}>{line}{appendNewLine ? "\n" : ""}</Text>
    } else if(tagMatch.test(line)) {
        const spacing = (new Array(line.search(/\S/))).fill('   ').join('');

        let match = line.match(tagMatch);

        const x = RegExp.$1;

        const tagName = RegExp.$2;
        const insideTag = RegExp.$3;
        const endTag = RegExp.$4;
        if(line.indexOf("/") != -1) {
            // if(__currentTabs != 0) __currentTabs--;
        }  else if(dontTabFor.indexOf(getTag(line)) == -1) {
            __currentTabs++;
        }

        return <Text key={key} style={styles.spacing}>{addSpacing && spacing}<Text style={styles.tagContainer}>&lt;</Text>{tagParser(tagName)}<Text style={styles.tagContainer}>&gt;</Text>{tagParser(insideTag, true)}<Text style={styles.tagContainer}>&lt;/</Text>{tagParser(endTag)}<Text style={styles.tagContainer}>&gt;</Text>{appendNewLine ? "\n" : ""}</Text>;
    } else if(partialTagMatch.test(line)) {
        const spacing = (new Array(line.search(/\S/))).fill('   ').join('');

        let match = line.match(partialTagMatch);
        
        // console.log(`1${RegExp.$1} 2${RegExp.$2} 3${RegExp.$3} 4${RegExp.$4}`)
        // return <Text key={key}>${RegExp.$1}${RegExp.$2}</Text>;
        const x = RegExp.$1;

        const tagName = RegExp.$2;

        return <Text key={key} style={styles.spacing}>{addSpacing && spacing}<Text style={styles.tagContainer}>&lt;</Text>{tagParser(tagName)}<Text style={styles.tagContainer}>&gt;</Text>{appendNewLine ? "\n" : ""}</Text>;

    }
    // line = tagMatch.test(line) ? <Text>{line}</Text> : <Text>Undefined</Text>
    
    return <Text key={key}>{line}{appendNewLine ? "\n" : ""}</Text>;
}

const styles = StyleSheet.create({
    spacing: {
        lineHeight: 18, 
        width: 10000
    },
    tagContainer: {
        color: "#FFF",
        lineHeight: 18, 
        width: 10000
    }, 
    tagName: {
        color: "#ed3267",
        lineHeight: 18, 
        width: 10000
    },
    tagAttribute: {
        color: "#1adb44",
        lineHeight: 18, 
        width: 10000
    },
    tagAttributeValue: {
        color: "#f7dc2a",
        lineHeight: 18, 
        width: 10000
    },
    comment: {
        color: "#999999",
        lineHeight: 18, 
        width: 10000
    }
});