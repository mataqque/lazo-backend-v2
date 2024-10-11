/**
 * sentence router
 */
import { customRouter } from "../../../helpers/helpers";
import { factories } from '@strapi/strapi';
const { createCoreRouter } = factories

const defaultRouter = createCoreRouter('api::sentence.sentence');
export type TdefaultRouter = typeof defaultRouter
const myExtraRoutes = [
    {
        method: 'POST',
        path: '/sentences/list',
        handler: 'sentence.getSentences',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'POST',
        path: '/sentences/sentence',
        handler: 'sentence.getSentence',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'POST',
        path: '/sentences/create',
        handler: 'sentence.createSentence',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'POST',
        path: '/sentences/cron',
        handler: 'sentence.cronSentences',
        config: {
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'POST',
        path: '/sentences/delete',
        handler: 'sentence.deleteSentence',
        config: {
            policies: [],
            middlewares: [],
        },
    },
];

export default customRouter(defaultRouter, myExtraRoutes);