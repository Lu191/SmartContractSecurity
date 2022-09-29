import prisma from '../lib/prisma';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'POST') {
    if(req.body !== undefined) {
      const { asset, amount } = req.body;
      if (asset !== undefined && amount !== undefined) {
        const result = await prisma.asset.create({
          data: {
            name: asset,
            amount: amount,
          },
        });
        res.json(result);
      } else {
        res.status(422).send(`Bad params`);
      }
    } else {
      res.status(422).send(`Bad params`);
    }
  } else {
    res.status(400).send(`The HTTP ${req.method} method is not supported at this route.`);
  }
};