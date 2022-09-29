import React from 'react';

import MarketInfo from '../../components/marketInfo/MarketInfo';
import AssetList from '../../components/assetList/AssetList';

const Dashboard = () => {

    return (
        <div className='white-text-page'>
            <div className='upperPage'>
                <MarketInfo />
            </div>
            <div className='assetList'>
                <AssetList />
            </div>
        </div>
    );
}

export default Dashboard;
