declare type Params = {
    [key: string]: string | number | string[];
};
export declare const buildQueryString: (parameters: Params) => string;
export {};
