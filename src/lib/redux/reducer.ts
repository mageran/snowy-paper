import { combineReducers } from 'redux';
import { MonetaryEntityList } from '../../components/generic/MonetaryEntity/monetary-entity';

export const createRootReducer = (entityLists: MonetaryEntityList<any, any>[]) => {
    const reducerObj = entityLists.reduce((acc, entityList) => {
        const slice = entityList.slice;
        const sliceName = entityList.sliceName;
        acc[sliceName] = slice.reducer;
        return acc;
    }, {} as Record<string, any>); // Initialize the accumulator as an empty object
    return combineReducers(reducerObj);
};