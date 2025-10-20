export declare function getLocalFileByKey(key: string): Promise<NodeJS.ReadableStream>;
export declare const getFileByKey: (key: string) => Promise<NodeJS.ReadableStream>;
export declare function removeByKeys(keys: string[]): Promise<void>;
export declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
