import Elysia from "elysia";

export const errorPlugin = new Elysia({ name: 'error-plugin'})
    .onError(({ code, error, set }) => {
        if (code == 'VALIDATION') {
            set.status = 422;
            return { error: 'Du lieu ko hop le', detail: error.message };
        }

        if (code == 'UNKNOWN') {
            set.status = 400;
            return { error: error.message };
        }

        set.status = 500;
        return { error: 'Loi he thong' };
    });