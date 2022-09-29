declare namespace NodeJS {
    interface ProcessEnv {
        //types of envs
        ALCHEMY_RPC: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
        
    }
}

export {}