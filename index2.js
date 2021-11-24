const obfuscator = require('javascript-obfuscator');
const fs = require('fs');


const options = {
    stringArray: true, //符串声明放到一个数组里
    rotateStringArray: true, //控制字符串数组化后的元素顺序
    // stringArrayEncoding: true, //设置数组的编码形式
    // stringArrayThreshold: 1,   //可控制编码的范围

    identifierNamesGenerator: 'mangled',

    identifiersPrefix: 'lh', //变量名加上前缀

    controlFlowFlattening: true, //控制流平坦化(默认0.75)
    controlFlowFlatteningThreshold: 0.06, //参数来控制平坦化的比例

    deadCodeInjection: true, //僵尸代码注入 默认0.4
    deadCodeInjectionThreshold: 0.06,  //参数来控制注入比例，范围为0~1
}


function obfuscate(code, options) {
    return obfuscator.obfuscate(code, options).getObfuscatedCode()
}


process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdout.write('混淆main.min.js请输入1，混淆qu.min.js请输入2\n'); //标准输出

process.stdin.on('data', function (data) {
    process.stdin.pause();
    let inputFile;
    let outputFile;

    data = data.toString().trim();
    if (data == 1) {
        process.stdout.write('开始混淆main.min.js\n');
        inputFile = 'main.min';
        outputFile = 'main2.min';
    } else if (data == 2) {
        process.stdout.write('开始混淆qu.min.js\n');
        inputFile = 'qu.min';
        outputFile = 'qu2.min';
    } else {
        process.stdout.write('输入有误！');
        return;
    }

    const startT = Date.now();
    if (inputFile && outputFile) {
        try {
            const buffer = fs.readFileSync(`./${inputFile}.js`);
            const sourceCode = String(buffer);

            const outputCode = obfuscate(sourceCode, options);
            process.stdout.write("混淆成功\n")

            fs.writeFile(`./${outputFile}.js`, outputCode, error => {
                if (error) {
                    process.stdout.write("异常！！！写入文件失败！")
                } else {
                    process.stdout.write('写入文件成功！\n')
                    process.stdout.write(`${Math.ceil((Date.now() - startT) / 1000)}秒`);
                }
            })
        } catch(err) {
            process.stdout.write("混淆失败！！！")
        }
    }
});

