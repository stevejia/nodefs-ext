const {expect, test} = require('@jest/globals');
const path = require('path');
const fs = require('fs');
const {
  getdir,
  mkdir,
  writeFile,
  readFile,
  copyFile,
  readLine,
  deldir,
  isFile,
  copyDir,
  copyDirOrFile,
} = require("../dist/index");
const test_dir = path.resolve(__dirname, './tests');
const testDir = path.resolve(__dirname, './tests/test/method/mkdir');
const testFilePath = `${testDir}/test.txt`;
const testTarDir = path.resolve(__dirname, './testsTar');
const testTarFilePath = path.resolve(testTarDir, 'index.txt');
console.log(test_dir);
if(fs.existsSync(test_dir)) {
  deldir(test_dir);
}

test('method getdir', ()=> {
  console.log('getdir', 'path is directory');
  expect(getdir('/a/b/c/d/')).toBe('/a/b/c/d/');
  console.log('getdir', 'path is file directory pass');
  console.log('getdir', 'path is file');
  expect(getdir('/a/b/c/d/e.js')).toBe('/a/b/c/d');
  console.log('getdir', 'path is file pass');
});



test('method mkdir', ()=> {
  mkdir(testDir);
  expect(fs.existsSync(testDir)).toBe(true);
  mkdir(testDir)
  expect(fs.existsSync(testDir)).toBe(true);
});

test('method writeFile', ()=> {
  // write file to directory
  expect(()=> writeFile(testDir, 'test', 'utf-8')).toThrow();
  writeFile(testFilePath, 'test', 'utf-8');
  const fileText = fs.readFileSync(testFilePath, 'utf-8');
  expect(fileText).toBe('test');

  writeFile(testFilePath, 'test1\test2\ntest3', 'utf-8');
  const fileText2 = fs.readFileSync(testFilePath, 'utf-8');
  expect(fileText2).toBe('test1\test2\ntest3');
});

test('method readLine', ()=> {
  expect(()=> readLine(path.resolve(testDir, 'index2.js'), 'utf-8')).toThrow();
  const lines = [];
  readLine(testFilePath, 'utf-8', (line)=> {
    lines.push(line);
  }, ()=> {
    expect(lines.join('\n')).toEqual('test1\test2\ntest3');
  })
});


test('method isFile', ()=> {
  expect(()=> isFile('/a/b/c/d.js')).toThrow();
  expect(isFile(testDir)).toBe(false);
  expect(isFile(testFilePath)).toBe(true);
});

test('method copyFile', ()=> {
  expect(()=> copyFile('/a/b/c/d.js', '')).toThrow();
  expect(()=> copyFile(testDir, '')).toThrow();
  expect(()=> copyFile(testFilePath, testDir)).toThrow();

  copyFile(testFilePath, testTarFilePath);
  const content = fs.readFileSync(testTarFilePath, 'utf-8');
  expect(content).toEqual('test1\test2\ntest3');
  deldir(testTarDir);
});

test('method copyDir', ()=> {
  expect(()=> copyDir('/a/b/c/d', '')).toThrow();
  expect(()=> copyDir(testFilePath, '')).toThrow();
  expect(()=> copyDir(testDir, testFilePath)).toThrow();
  copyDir(test_dir, testTarDir);
  expect(fs.existsSync(path.resolve(testTarDir, './test/method/mkdir/test.txt'))).toBe(true);
  deldir(testTarDir);
});

test('method copyDirOrFile', ()=> {
  expect(()=> copyDirOrFile('/a/b/c/d/e', '')).toThrow();
  expect(()=> copyDirOrFile(testFilePath, testTarDir)).toThrow();
  expect(()=> copyDirOrFile(testDir, testFilePath)).toThrow();
  copyDirOrFile(testFilePath, testTarFilePath);
  expect(fs.readFileSync(testFilePath, 'utf-8')).toBe(fs.readFileSync(testTarFilePath, 'utf-8'));
  deldir(testTarDir);
  copyDirOrFile(test_dir, testTarDir);
  expect(fs.readFileSync(testFilePath, 'utf-8')).toBe(fs.readFileSync(path.resolve(testTarDir, './test/method/mkdir/test.txt'), 'utf-8'))
  deldir(testTarDir);
});

test('method readFile', ()=> {
  expect(()=> readFile(testTarFilePath, 'utf-8')).toThrow();
  expect(readFile(testFilePath, 'utf-8')).toBe('test1\test2\ntest3');
});

test('method deldir', ()=> {
  expect(()=> deldir(testTarDir)).toThrow();
})

if(fs.existsSync(test_dir)) {
  deldir(test_dir);
}
