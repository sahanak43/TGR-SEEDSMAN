import {
    IS_LOADING_URL_REWRITE as SOURCE_IS_LOADING_URL_REWRITE,
    setIsUrlRewritesLoading as sourceSetIsUrlRewritesLoading,
    UPDATE_URL_REWRITE as SOURCE_UPDATE_URL_REWRITE,
    updateUrlRewrite as sourceUpdateUrlRewrite
} from 'SourceStore/UrlRewrites/UrlRewrites.action';

// TODO: implement UPDATE_URL_REWRITE
export const UPDATE_URL_REWRITE = SOURCE_UPDATE_URL_REWRITE;

// TODO: implement IS_LOADING_URL_REWRITE
export const IS_LOADING_URL_REWRITE = SOURCE_IS_LOADING_URL_REWRITE;

// TODO: implement updateUrlRewrite
export const updateUrlRewrite = sourceUpdateUrlRewrite;

// TODO: implement setIsUrlRewritesLoading
export const setIsUrlRewritesLoading = sourceSetIsUrlRewritesLoading;
