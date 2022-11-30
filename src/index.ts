import fs from "fs";
import path from "path";
import readline from "readline";
const extReg = /\.[^\.]+$/;

const getdir = (pathLike: string): string => {
  if (!extReg.test(pathLike)) {
    return pathLike;
  }
  const paths = pathLike.split(/\/|\\/);
  paths.pop();
  return paths.join("/");
};

const mkdir = (pathLike: string): void => {
  const dir = getdir(pathLike);
  if (fs.existsSync(dir)) {
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
};

const readLine = (
  filePath: fs.PathLike,
  options?: BufferEncoding,
  onLine?: (line: string) => void,
  onClose?: () => void
) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("soure file not exist!");
  }
  const stream = fs.createReadStream(filePath, options);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => onLine && onLine(line));
  rl.on("close", () => onClose && onClose());
};

const isFile = (path: fs.PathLike): boolean => {
  if (!fs.existsSync(path)) {
    throw new Error("isFile: path not exist!");
  }
  const stat = fs.statSync(path);
  return stat.isFile();
};

const copyFile = (sourcePath: string, targetPath: string) => {
  if (!fs.existsSync(sourcePath)) {
    throw new Error("source file not exist!");
  }
  if (
    !isFile(sourcePath) ||
    (fs.existsSync(targetPath) && !isFile(targetPath))
  ) {
    throw new Error("source or target file is directory");
  }

  mkdir(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
};

const copyDir = (sourceDir: string, targetDir: string): void => {
  if (!fs.existsSync(sourceDir)) {
    throw new Error("source directory not exist!");
  }
  if (isFile(sourceDir) || (fs.existsSync(targetDir) && isFile(targetDir))) {
    throw new Error("copy source path or target path is not directory!");
  }
  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    const curSourcePath = path.resolve(sourceDir, file);
    const curTargetPath = path.resolve(targetDir, file);
    const _isFile = isFile(curSourcePath);
    if (!_isFile) {
      mkdir(curTargetPath);
      copyDir(curSourcePath, curTargetPath);
      return;
    }
    copyFile(curSourcePath, curTargetPath);
  });
};

const copyDirOrFile = (sourcePath: string, targetPath: string) => {
  if (!fs.existsSync(sourcePath)) {
    throw new Error("source directory not exist!");
  }

  const targetPathExist = fs.existsSync(targetPath);

  /**
   * 如果是file 则降级处理
   */
  if (isFile(sourcePath) && (!targetPathExist || isFile(targetPath))) {
    copyFile(sourcePath, targetPath);
    return;
  }
  if (!isFile(sourcePath) && (!targetPathExist || !isFile(targetPath))) {
    copyDir(sourcePath, targetPath);
    return;
  }
  throw new Error("source path & target path is not both directory or file!");
};

/**
 *
 * @param targetPath 写入文件路径
 * @param data 文件数据
 * @param options 写入文件额外配置
 */
const writeFile = (
  targetPath: string,
  data: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions | undefined
) => {
  if (typeof targetPath === "string") {
    mkdir(targetPath);
  }

  if (fs.existsSync(targetPath) && !isFile(targetPath)) {
    throw new Error("target path is directory, can't write data to directory!");
  }

  fs.writeFileSync(targetPath, data, options);
};

const readFile = (
  path: fs.PathLike,
  options?: {
    encoding?: null | undefined;
    flag?: string | undefined;
  } | null
): Buffer => {
  if (!fs.existsSync(path)) {
    throw new Error("soure file not exist!");
  }
  return fs.readFileSync(path, options);
};

const deldir = (path: fs.PathLike) => {
  if (!fs.existsSync(path)) {
    throw new Error("the folder you delete not exist!");
  }
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const curPath = `${path}/${file}`;
    const _isFile = isFile(curPath);
    if (!_isFile) {
      deldir(curPath);
      return;
    }
    fs.unlinkSync(curPath);
  });
  fs.rmdirSync(path);
};

module.exports = {
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
};
