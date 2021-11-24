var parse = require('esprima').parse;
var toString = require('escodegen').generate;
var confusion = require('confusion');
const fs = require('fs');
const uglifyjs = require("uglify-js");
const child_process = require('child_process');

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
        outputFile = 'main2';
    } else if (data == 2) {
        process.stdout.write('开始混淆qu.min.js\n');
        inputFile = 'qu.min';
        outputFile = 'qu2';
    } else {
        process.stdout.write('输入有误！');
        return;
    }

    if (inputFile && outputFile) {
        try {
            const buffer = fs.readFileSync(`./${inputFile}.js`);
            const sourceCode = String(buffer);
            var ast = parse(sourceCode);
            var obfuscated = confusion.transformAst(ast, confusion.createVariableName);
            const outputCode = toString(obfuscated);
            process.stdout.write("混淆成功\n")

            fs.writeFile(`./${outputFile}.js`, outputCode, error => {
                if (error) {
                    process.stdout.write("临时文件写入失败！")
                } else {
                    process.stdout.write('临时文件写入成功！\n')
                    process.stdout.write('uglifying...\n')

                    const cmd = `uglifyjs ${outputFile}.js -m -o ${outputFile}.min.js`;
                    child_process.exec(cmd, function (err, stdout, stderr) {
                        if (err) {
                            console.log('uglifyjs cmd error:' + stderr);
                        } else {
                            fs.unlink(`${outputFile}.js`, function (err) {
                                if (err) {
                                    process.stdout.write('删除临时文件失败');
                                    process.stdout.write(err)
                                } else {
                                    process.stdout.write('成功！！')
                                }
                            })

                        }
                    });
                }
            })
        } catch (err) {
            process.stdout.write("混淆失败！！！")
        }
    }
});


