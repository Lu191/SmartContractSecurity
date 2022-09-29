import prisma from '../lib/prisma';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'GET') {
        const result = await prisma.asset.findMany()
        res.status(200).json(result);
    } else if(req.method === 'DELETE') {
        let today = new Date();
        let sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const result = await prisma.asset.deleteMany({
            where: {
                createdAt: {
                    lte: sevenDaysAgo
                }
            }
        })
        res.json(result);
    } else {
        res.status(400).send(`The HTTP ${req.method} method is not supported at this route.`);
    }
};