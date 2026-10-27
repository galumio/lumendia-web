// Usa todo el catálogo para que los títulos no varíen entre preview y producción.
export function chapterSeoTitle(book,page,catalog){
 const occurrences=catalog.reduce((count,b)=>count+b.pages.filter(p=>p.title===page.title).length,0);
 return occurrences>1?`${page.title} | ${book.title}`:page.title;
}
