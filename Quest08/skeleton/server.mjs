import http from 'http';
import url from 'url';
import fs from 'fs';
import qs from 'querystring';

const server = http.createServer((req, res) => {
    /* TODO: 각각의 URL들을 어떻게 처리하면 좋을까요? */
    const parseUrl = url.parse(req.url, true);
    const queryData = parseUrl.query;
    const pathname = parseUrl.pathname;

    if ( req.method === 'POST' ) {//POST
        if ( pathname === '/uploaded' ) {
            creatEventFileUpload();
        } else {
            createEventPostFoo();
        }
    } else {//GET
        if ( pathname === '/' ) {
            createEventGreeting('Hello World!');
        } else if ( pathname === '/foo' ) {
            if ( queryData.bar ) {//bar에 value가 들어오면
                createEventGreeting(`Hello, ${queryData.bar}`);
            } else {
                createEventForm('./form_foo.html');
            }
        } else if ( pathname === '/pic/upload' ) {
            createEventForm('./form_upload.html');
        } else if ( pathname === '/pic/show' ) {
            createEventShowImage();
        } else if ( pathname === '/pic/download' ) {
            creatEventDownload();
        }
    }
    function createEventGreeting (string) {
        res.writeHead(200, {'Content-Type' : 'text/plane'});
        res.end(string);
    }

    function createEventPostFoo () {
        let body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            let post = qs.parse(body);
            res.writeHead(200, {'Content-Type' : 'text/plane'});
            res.end(`Hello, ${post.name}`);
        });
    }

    function createEventForm (filePath) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type' : 'text/plane'});
                res.end('404 : Not Found');
            } else {
                res.writeHead(200, {'content-Type': 'text/html'});
                res.end(data);
            }
        });
    }

    function creatEventFileUpload() {
        const chunks = [];
        let totalSize = 0;
      
        req.on('data', (chunk) => {
          chunks.push(chunk);
          totalSize += chunk.length;
        });
      
        req.on('end', () => {
        const buffer = Buffer.concat(chunks, totalSize);
        const form = parseMultipartForm(buffer, req.headers['content-type']);
       
        const fileData = form.userFile;
        const filePath = `uploads/${fileData.filename}`;
        
        fs.writeFile(filePath, fileData.data, (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File uploaded!');
          });
        });
    }
      
    function parseMultipartForm(buffer, contentType) {
        const boundary = contentType.split('; ')[1].split('=')[1];
        const parts = buffer.toString().split(`--${boundary}`);
      
        const form = {};
      
        parts.forEach((part) => {
            if (!part.includes('Content-Disposition')) return;
        
            const [_, name] = part.match(/name="(.+?)"/) || [];
            const [__, filename] = part.match(/filename="(.+?)"/) || [];
        
            if (filename) {
                const [, data] = part.split('\r\n\r\n');
                form[name] = { filename, data: Buffer.from(data, 'binary') };
            } else {
                const [, value] = part.split('\r\n\r\n');
                form[name] = { value };
            }
        });
        return form;
    }

    function readFile(headSetting) {
        fs.readdir('./uploads', (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed!!');
                return;
            }
            const filePath = `/Users/jiheenam/WebDevCurriculum/Quest08/skeleton/uploads/${files[0]}`;
            fs.readFile(filePath, (error, data) => {
                if (error) {
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Internal Failed!!');
                  return;
                }
                res.writeHead(200, Object.assign({}, headSetting, {'Content-Length': data.length}));
                res.end(data);
            });
        });
    }

    function createEventShowImage() {
        readFile({'Content-Type': 'image/svg+xml'});
    }
    function creatEventDownload () {
        readFile({
            'Content-Type': 'application/octet-stream', //이진 파일 형식
            'Content-Disposition': 'attachment; filename=pic.jpg'//pic.jpg로 재설정
        });
    }
});
server.listen(8080);