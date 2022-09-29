import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';
import * as React from 'react';
import { getTokenFeed } from '../../api/price_feeds'

const { REACT_APP_API_CHART } = process.env;

function getNDaysAgoDate(days: number) : string {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  return day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + day.getDate();
}

type Row = {
  name: string;
  amount: number;
  createdAt: Date | null;
}

type dbRow = {
  id: string;
  name: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

// list to perform filtering
const listOfStableCoin = ['dai', 'usdc'];
const listOfAltCoin = ['eth', 'ubt'];
const wbtc = 'wbtc';

const normalizeRows = (rows: Array<dbRow>): Array<Row> => {
  return rows.map(({id, name, amount, createdAt, updatedAt}: dbRow) => { 
    return {name, amount: Number(amount), createdAt: new Date(createdAt),}
  });
}

const divideInDays = (rows: Array<Row>): Array<Array<Row>> => {
  let divided = new Array<Array<Row>>(7);
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const dateIDaysAgo = now.getDate() - i;
    divided[6 - i] = rows.filter((row: Row) => {
      return row.createdAt!.getDate() === dateIDaysAgo;
    })
  }
  return divided;
}

type GraphDay = {
  date: string;
  altCoin: number;
  stableCoin: number;
  btc: number;
}

const sumUpPerDay = (rows: Array<Array<Row>>): Array<GraphDay> => {
  let graphDays = new Array<GraphDay>(7);

  for (let i = 0; i < graphDays.length; i++) {
    graphDays[i] = {date: '', altCoin: 0, stableCoin: 0, btc: 0};

    if (rows[i] !== undefined && rows[i].length > 0) { // se è presente una data in quel giorno
      const date = rows[i][0].createdAt;
      graphDays[i].date = `${date!.getFullYear()}/${date!.getMonth() + 1}/${date!.getDate()}`;

      graphDays[i].stableCoin = Math.log(rows[i].filter((row: Row): boolean => {
        return listOfStableCoin.includes(row.name);
      }).reduce((acc, row) => {
        return {name: '', amount: acc.amount + row.amount, createdAt: null};
      }, {name: '', amount: 0, createdAt: null}).amount);
      
      graphDays[i].altCoin = Math.log(rows[i].filter((row: Row): boolean => {
        return listOfAltCoin.includes(row.name);
      }).reduce((acc, row) => {
        return {name: '', amount: acc.amount + row.amount, createdAt: null};
      }, {name: '', amount: 0, createdAt: null}).amount);

      graphDays[i].btc = Math.log(rows[i].filter((row: Row): boolean => {
        return row.name === wbtc;
      }).reduce((acc, row) => {
        return {name: '', amount: acc.amount + row.amount, createdAt: null};
      }, {name: '', amount: 0, createdAt: null}).amount);

    } else {
      graphDays[i].date = getNDaysAgoDate(6 - i);
      graphDays[i].altCoin = 0;
      graphDays[i].stableCoin = 0;
      graphDays[i].btc = 0;
    }
  }
  return graphDays;
}

type AssetGraphProps = {
  width: number;
}

function convertToUSD(value: string, price: string, dec: number): string {
  return (Number(value) * Number(price)).toFixed(dec);
}

function bigNumberToFixedString(value: any, p: number, dec: number) {
  return (Number(value.toHexString()) / Math.pow(10, p)).toFixed(dec)
}

const AssetGraph = ({width}: AssetGraphProps) => {
  const [data, setData] = React.useState<any>();

  React.useEffect(() => {
    if (REACT_APP_API_CHART !== undefined) {
      axios.get(REACT_APP_API_CHART)
        .then(res => {
          const assets = res.data;

          let ethPrice = getTokenFeed("ethusd");
          let btcPrice = getTokenFeed("btcusd");
          let daiPrice = getTokenFeed("daiusd");
          let usdcPrice = getTokenFeed("usdcusd");

          let promises = [ethPrice, btcPrice, daiPrice, usdcPrice];
          
          Promise.all(promises).then((value) => {
            let ethP = bigNumberToFixedString(value[0].answer, 8, 2);
            let wbtcP = bigNumberToFixedString(value[1].answer, 8, 2);
            let usdcP = bigNumberToFixedString(value[2].answer, 8, 2);
            let daiP = bigNumberToFixedString(value[3].answer, 8, 2);

            for (let i = 0; i < assets.length; i++) {
              switch(assets[i].name) {
                case 'eth':
                  assets[i].amount = convertToUSD(ethP, assets[i].amount, 2);
                  break;
                case 'wbtc':
                  assets[i].amount = convertToUSD(wbtcP, assets[i].amount, 2);
                  break;
                case 'usdc':
                  assets[i].amount = convertToUSD(usdcP, assets[i].amount, 2);
                  break;
                case 'dai':
                  assets[i].amount = convertToUSD(daiP, assets[i].amount, 2);
                  break;
                case 'ubt':
                  break;
                default:
                  console.error('coin not expected', assets[i].name)
                  break;
              }
            }

            const normalizedRows = normalizeRows(assets);
            const dividedInDays = divideInDays(normalizedRows);
            const summedUpPerDay = sumUpPerDay(dividedInDays);

            summedUpPerDay[0].date = 'last week';
            summedUpPerDay[1].date = '6 days ago';
            summedUpPerDay[2].date = '5 days ago';
            summedUpPerDay[3].date = '4 days ago';
            summedUpPerDay[4].date = '3 days ago';
            summedUpPerDay[5].date = 'Yesterday';
            summedUpPerDay[6].date = 'Today';

            setData(summedUpPerDay);
          })
        })
    }
  }, []);

  return (
    <AreaChart width={width} height={250} data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorStableCoin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#650cad" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#650cad" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorAltCoin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4043f5" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#4043f5" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />

      <Area type="monotone" strokeWidth={2} dataKey="btc" stroke="#4043f5" fillOpacity={1} fill="url(#colorBtc)" />
      <Area type="monotone" strokeWidth={2} dataKey="stableCoin" stroke="#650cad" fillOpacity={1} fill="url(#colorStableCoin)" />
      <Area type="monotone" strokeWidth={2} dataKey="altCoin" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAltCoin)" />
    </AreaChart>
  );
}

export default AssetGraph;

