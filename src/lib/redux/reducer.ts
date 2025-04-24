import { combineReducers, Middleware } from 'redux';
import { MonetaryEntityList } from '../../components/generic/MonetaryEntity/monetary-entity';

export const serializeMiddleware: Middleware = (_store) => (next) => (action:any) => {
    const serialize = (obj: any): any => {
        console.log(`MIDDLEWARE serialize: %o`, obj);
      if (obj && typeof obj === 'object' && typeof obj.toJson === 'function') {
        return obj.toJson();
      }
      return obj;
    };
    const serializedPayload = serialize(action.payload);
    console.log('serialized: %o', serializedPayload);
    return next({ ...action, payload: serializedPayload });
  };

export const createRootReducer = (entityLists: MonetaryEntityList<any, any>[]) => {
    const reducerObj = entityLists.reduce((acc, entityList) => {
        const slice = entityList.slice;
        const sliceName = entityList.sliceName;
        acc[sliceName] = slice.reducer;
        return acc;
    }, {} as Record<string, any>); // Initialize the accumulator as an empty object
    return combineReducers(reducerObj);
};