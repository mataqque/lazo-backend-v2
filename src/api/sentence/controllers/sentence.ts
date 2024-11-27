/**
 * sentence controller
 */


import { factories } from '@strapi/strapi'
import { createSentenceSchema, phoneScheme } from '../schema';
import { pick, update } from 'lodash';
import { ISentence } from '../types';


function updateList(list: any, documentId: string) {
    return {
        data: {
            list: list,
            publishedAt: new Date(),
            updatedAt: new Date(),
        },
        status: 'published',
        documentId: documentId
    }
}


const get_data = (list: ISentence[], listId: number[]): { sentence: ISentence, ids: number[] } => {
    const numRamdon = Math.floor(Math.random() * list.length);
    const sentence = list[numRamdon];
    return {
        sentence,
        ids: [...(listId.length === list.length ? [] : listId), parseInt(sentence.id.toString())]
    }
}

export default factories.createCoreController('api::sentence.sentence', ({ strapi }) => ({
    async getSentences(ctx) {
        try {
            const validate = phoneScheme.validateSync(ctx.request.body);
            const { cel = '' } = pick(validate, Object.keys(phoneScheme.fields));
            const data = await strapi.documents('api::sentence.sentence').findMany({
                status: 'published',
                filters: {
                    user: {
                        cel: cel
                    }
                }
            });

            return data;
        } catch (err) {
            return {
                status: 500,
                error: err
            };
        }
    },
    getSentence: async (ctx, next) => {
        try {
            const { cel } = ctx.request.body;
            const user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: {
                    cel: cel,
                },
            });

            if (!user) {
                return { status: 404, data: 'user dont exist' };
            }

            const invalidList = await strapi.documents('api::invalid-list.invalid-list').findMany({
                status: 'published',
                filters: {
                    user: {
                        cel: cel
                    }
                }
            });

            const documentIDlist = invalidList[0]?.documentId.toString() ?? '';

            const arrayInvalidList: number[] = JSON.parse(JSON.stringify(invalidList[0]))?.list ?? [];

            const sentences = await strapi.documents('api::sentence.sentence').findMany({
                status: 'published',
                filters: {
                    user: {
                        cel: cel
                    }
                }
            });

            const idsValids = [...new Set(arrayInvalidList.filter((e: number) => {
                if (sentences.find((s: any) => s.id === e)) {
                    return true
                }
                return false
            }))];

            const newSentences = sentences.filter(e => {
                return !idsValids.includes(parseInt(e.id.toString()));
            });

            const { sentence, ids } = get_data(newSentences.length <= 0 ? sentences : newSentences, idsValids);

            const updateInvalidList = await strapi.documents('api::invalid-list.invalid-list').update(updateList(ids, documentIDlist));

            return { status: 200, data: sentence };

        } catch (err) {
            return { error: err };
        }
    },
    createSentence: async (ctx, next) => {
        try {

            const validate = createSentenceSchema.validateSync(ctx.request.body)
            const { data = [], name, cel } = pick(validate, Object.keys(createSentenceSchema.fields));

            const sentences = [];

            let user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: {
                    cel: cel,
                },
            });

            if (!user) {
                user = await strapi.db.query('plugin::users-permissions.user').create({
                    data: {
                        username: name,
                        cel: cel,
                        blocked: false,
                        confirmed: true,
                        publishedAt: new Date(),
                    },
                });
            }
            for await (const sentence of data) {
                let newSentence = await strapi.documents('api::sentence.sentence').create({
                    data: {
                        ...sentence,
                        user: user.id,
                    },
                    status: 'published',
                });
                sentences.push(newSentence);
            }

            return { status: 200, data: sentences };

        } catch (err) {
            return { error: err };
        }
    },
    cronSentences: async (ctx, next) => {
        const { cel, interval } = ctx.request.body;
        if (interval) {
            const setInterval = await strapi.db.query('plugin::users-permissions.user').update({
                where: {
                    cel: cel,
                },
                data: {
                    interval: `0 */${interval} * * * *`,
                },
            });
        }
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: {
                cel: cel,
            },
        });
        return { status: 200, data: user };
    },
    deleteSentence: async (ctx, next) => {
        const { id, cel } = ctx.request.body;
        try {
            // const sentence = await strapi.entityService.findOne('api::sentence.sentence', id, { populate: '*' });
            // if (!sentence) {
            // 	return { status: 404, data: 'error' };
            // }
            // if (sentence.userphone.cel !== cel) {
            // 	return { status: 404, data: 'error' };
            // }
            // const data = await strapi.entityService.delete('api::sentence.sentence', id);
            return { status: 200, data: 'ok' };
        } catch (err) {
            return { error: err };
        }
    },
}));
