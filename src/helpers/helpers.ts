import { Route, Router } from '@strapi/types/dist/core/core-api/router'

type CustomRouterFunction = (defaultRouter: Router, extraRoutes: any) => Router;

export const customRouter: CustomRouterFunction = (innerRouter, extraRoutes = []) => {

    let routes: typeof innerRouter.routes;

    return {
        get prefix() {
            return innerRouter.prefix;
        },

        get routes() {
            console.log(innerRouter.routes);
            if (typeof innerRouter.routes === 'function') {
                routes = innerRouter.routes().concat(extraRoutes);
            } else {
                routes = innerRouter.routes.concat(extraRoutes);
            }

            return routes;
        },
        type: innerRouter.type
    };
};
