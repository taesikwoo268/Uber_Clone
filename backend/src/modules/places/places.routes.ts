import {Elysia} from "elysia";
import {PlacesService} from "./places.service";
import {nearbyPlacesSchema, searchPlacesSchema} from "./places.schema";
import {jwtPlugin} from "../../plugins/jwt";
import {jwt} from "@elysiajs/jwt";


export const placesRoutes = new Elysia({prefix: '/places'})
    .use( jwtPlugin)
    .get('/search', async ({ query })=> {
        return PlacesService.search( query.q, query.limit);
    }, {query: searchPlacesSchema})
    .derive(async ({ jwt, headers: { authorization} }) => {
        const payload = await jwt.verify(authorization)
        if (!payload) throw new Error('Unauthorized');
        return { user: payload as {userId: string}};
    })
    .get('/nearby', async ({query}) => {
        const {lat, lng, radius } = query;
        return PlacesService.findNearbyPickupPoints(lat, lng, radius);
    }, { query: nearbyPlacesSchema});