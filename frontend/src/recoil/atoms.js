import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {
        uid: null,
        token: null
    }
})

export const token_Id = selector({
    key: 'token',
    get: ({get})=>{
        const { uid, token } = get(userState);
        
        return { uid, token }
    }
})