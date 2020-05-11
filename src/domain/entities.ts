import { generateUUID } from 'src/utilities/uuid';


export class Article {
   _id: string;
   title: string;
   createdAt: number;
   catalogUUID: string;
   description: string;
   completedFlag: boolean;
   completedAt: number;
   dueAt: number;
   planAt: number;
   notifyMe: false;

   constructor(title: string, catalogUUID?: string) {
      this._id = generateUUID();
      this.title = title;
      this.catalogUUID = catalogUUID;
      this.completedFlag = false;
   }
}


export class Catalog {
   _id: string;
   title: string;
   createdAt: number;

   constructor(title: string) {
      this._id = generateUUID();
      this.title = title;
   }
}