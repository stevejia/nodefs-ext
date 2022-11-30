
# fs-ext
 ## how to install


> npm i fs-ext --save 

> yarn add fs-ext

## how to use

|  method   | parameters  | description |
|  ----  | ----  | ---- |
| getdir  | (path: string) | return the directory of a file path  | 
| mkdir  | (path: string) | create directory if not exist |
| deldir  | (path: string) | delete directory if exist |
| isFile  | (path: string) | check path is file (true) or directory (false) |
| readFile  | (path: fs.pathLike, options?: any) | read file content |
| readLine  | (path: fs.pathLike, options?: BufferEncoding, onLine?: (line)=> void, onClose?: ()=> void) | read file content line by line |
| writeFile  | (path: fs.pathLike, data: string \| Buffer, options?: any) | write file content |
| copyFile  | (sourcePath: string, targetPath: string) | copy a file to another path |
| copyDir  | (sourcePath: string, targetPath: string) | copy directory whole files to another directory |
| copyDirOrFile  | (sourcePath: string, targetPath: string) | copy file(directory) to another file(directory) depends on the path is file(directory) |

## keywords

nodejs fs extensions
