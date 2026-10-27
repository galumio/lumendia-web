// Clasificación editorial separada de los manuscritos importados.
export type ReadingScope = 'complete' | 'additional-paid' | 'sample';
export const featuredBookSlug = 'como-estudiar-para-un-final';
export function readingScope(book:{slug:string;sample?:boolean}):ReadingScope {
 if(book.sample) return 'sample';
 return book.slug==='ia-para-docentes' ? 'additional-paid' : 'complete';
}
export const scopeLabels = {
 es:{complete:'Lectura completa gratuita','additional-paid':'Guía gratuita con contenido adicional de pago',sample:'Muestra del ebook comercial'},
 en:{complete:'Complete free reading','additional-paid':'Free guide with additional paid content',sample:'Sample of the commercial ebook'}
};
export const scopeLabel=(book:{slug:string;sample?:boolean;language?:'es'|'en'},language=book.language??'es')=>scopeLabels[language][readingScope(book)];
