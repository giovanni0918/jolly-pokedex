import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from '../client/src/components/App';
const app = express();

app.set('port', process.env.PORT || 5000);

app.use('/static', express.static(path.resolve(__dirname, '../client/public')));

app.get('/*', function(req, res) {
    const context = {};

    const jsx = (
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );

    const reactDom = renderToString(jsx);

    if (context.url) {
        res.writeHead(301, {
            Location: context.url,
        });
        res.end();
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        res.end(htmlTemplate(reactDom));
    }
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on http://localhost:'.concat(app.get('port')));
});

function htmlTemplate(reactDom) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <title>Jolly Pokedex</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                
                <link rel="stylesheet" href="./static/bundles/styles.bundle.css">
                <script src="./static/bundles/vendors.bundle.js"></script>
            </head>

            <body>
                <div id="jolly-pokedex">${reactDom}</div>
                <script src="./static/bundles/client.bundle.js"></script>
            </body>
        </html>
    `;
}
