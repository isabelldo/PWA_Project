const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BJFt2N924iiOqSmkdPFxXkPXjHA-DpPEXnbW_1ixbHE8eukuaqGIk9y4pn-DGIn3k6R80yOM0ZVDcqLaAFcpaJk';
const privateVapidKey = '4rMrJ3Xq391XjeZOrxAIFEbBELOvNgxX2ECqK1pYT0w';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:isabelldorendorf99@web.de', publicVapidKey, privateVapidKey);
});

module.exports = router;
