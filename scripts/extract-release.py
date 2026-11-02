import sys,tarfile
from pathlib import Path,PurePosixPath
archive,destination=sys.argv[1:];root=Path(destination).resolve()
with tarfile.open(archive,'r:gz') as tar:
 members=tar.getmembers();seen=set();total=0
 for m in members:
  p=PurePosixPath(m.name)
  if p.is_absolute() or '..' in p.parts or '\\' in m.name or ':' in m.name or not (m.isfile() or m.isdir()):raise SystemExit('Entrada insegura en TAR: '+m.name)
  key=str(p).casefold()
  if key in seen:raise SystemExit('Entrada duplicada: '+m.name)
  seen.add(key);total+=m.size
  if total>500_000_000 or len(members)>20000:raise SystemExit('Artefacto excesivo')
 tar.extractall(root,filter='data')
