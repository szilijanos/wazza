const http = require('http');
const { https } = require('follow-redirects');

function sendOutboundRequest(payload) {
    const baseUrl = 'menetrendek.hu';
    const searchRoutesPath = '/menetrend/interface/index.php';

    const options = {
        method: 'POST',
        hostname: baseUrl,
        path: searchRoutesPath,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        maxRedirects: 5,
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks);
                resolve(body);
            });

            res.on('error', (error) => {
                console.error(error);
                reject(error);
            });
        });

        req.write(payload);
        req.end();
    });
}

function serve() {
    http.createServer((request, response) => {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
        });

        const bodyChunks = [];

        request.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });

        request.on('end', () => {
            const body = Buffer.concat(bodyChunks);

            sendOutboundRequest(body)
                .then((responseBody) => {
                    response.write(responseBody);
                    response.end();
                })
                .catch((err) => {
                    response.end();
                    throw err;
                });
        });

        request.on('error', (error) => {
            console.error(error);
            response.end();
        });
    }).listen(5501);
}

serve();
