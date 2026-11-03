export const navigation=[['/','Inicio'],['/biblioteca/','Biblioteca'],['/relatos/','Relatos'],['/aprende-ia/','Aprendé IA'],['/herramientas/','Herramientas']];
export function activeSection(path,completeSlugs=[]){
 if(path==='/')return '/';
 if(path.startsWith('/relatos/')||path.startsWith('/autores/'))return '/relatos/';
 if(path.startsWith('/biblioteca/')||completeSlugs.some(slug=>path.startsWith(`/libros/${slug}/`)))return '/biblioteca/';
 if(['/aprende-ia/','/tips/','/guias/','/tutoriales/','/libros/ia-para-docentes/'].some(p=>path.startsWith(p)))return '/aprende-ia/';
 if(path.startsWith('/herramientas/'))return '/herramientas/';
 return null; // Muestras, recursos e información: sin sección principal engañosa.
}
