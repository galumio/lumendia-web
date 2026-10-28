import {editorialEntries} from './editorial-catalog';
export const authorProfiles = [{slug:'gael-beltra',name:'Gael Beltra',description:'Gael Beltra es el seudónimo literario del autor de estos relatos originales de ficción.'}];
for(const entry of editorialEntries){
 if(entry.author?.slug&&!authorProfiles.some(a=>a.slug===entry.author?.slug&&a.name===entry.author.name))throw Error('Referencia de autor desconocida');
}
export const availableAuthors=authorProfiles.filter(a=>editorialEntries.some(e=>e.author?.slug===a.slug));
export const authorUrl=(slug:string)=>`/autores/${slug}/`;
