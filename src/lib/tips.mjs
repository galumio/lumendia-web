import manifest from '../content/tips-approved.json' with {type:'json'};
// Destacado manual: cambiar el slug tras revisión editorial; nunca rota por fecha.
export const featuredTipSlug = 'preparar-menu-semanal-con-chatgpt';
export const tipThemes = ['Vida cotidiana', 'Comunicación', 'Información y decisiones', 'Aprendizaje'];
export function tipGroups(entries) {
  const tips = entries.filter(entry => entry.format === 'tip').sort((a,b)=>manifest.findIndex(m=>m.slug===a.slug)-manifest.findIndex(m=>m.slug===b.slug));
  return tipThemes.map((title, index) => ({title, id: `tema-${index + 1}`, entries: tips.filter(entry => entry.topics.includes(title))})).filter(group => group.entries.length);
}
export function featuredTip(entries) {
  return entries.find(entry => entry.format === 'tip' && entry.slug === featuredTipSlug);
}
