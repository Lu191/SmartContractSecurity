import React from 'react';
import '../pages.scss';

import AssetGraph from '../../components/assetGraph/AssetGraph';
import MarketInfo from '../../components/marketInfo/MarketInfo';
import AssetList from '../../components/assetList/AssetList';
import './markets.scss';

const Markets = () => {
    const [width, setWidth] = React.useState(window.innerWidth);

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
    };

    React.useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    return (
        <div className='white-text-page'>
            <div className='upperPage'>
                <MarketInfo />
            </div>
            <div className='chart'>
                <AssetGraph width={width * 0.6}/>
            </div>
            <div className='assetList'>
                <AssetList />
            </div>
        </div>
    );
}

export default Markets;

