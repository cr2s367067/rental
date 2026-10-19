import * as api from '../Generated/sdk.gen';import type * as DTO from '../Generated/types.gen';
export const usersService={
 async list(){return (await api.listUsers({query:{page_size:100},throwOnError:true})).data;},
 async create(body:DTO.CreateUserData['body']){return (await api.createUser({body,throwOnError:true})).data;},
 async update(id:string,body:DTO.UpdateUserData['body']){return (await api.updateUser({path:{id},body,throwOnError:true})).data;},
 async password(id:string,password:string){return (await api.resetUserPassword({path:{id},body:{password},throwOnError:true})).data;},
 async grants(id:string,body:DTO.ReplacePropertyGrantsData['body']){return (await api.replacePropertyGrants({path:{id},body,throwOnError:true})).data;},
 async owner(id:string,body:DTO.AssignPropertyOwnerData['body']){return (await api.assignPropertyOwner({path:{id},body,throwOnError:true})).data;},
 async date(business_date:string){return (await api.setDemoDate({body:{business_date},throwOnError:true})).data;},
 async reset(){return (await api.resetDemo({throwOnError:true})).data;}
};
export type UsersService=typeof usersService;
