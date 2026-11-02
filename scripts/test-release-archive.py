"""Pruebas sintéticas de seguridad. No extraen archivos ni borran fuentes."""
import io,tarfile,subprocess,sys
from pathlib import Path
root=Path('.local');root.mkdir(exist_ok=True);archive=root/'policy-hostile-fixture.tar.gz'
cases=[['../escape'],['/absolute'],['C:\\escape'],['same','./same'],['link']]
for names in cases:
 with tarfile.open(archive,'w:gz') as tar:
  for name in names:
   info=tarfile.TarInfo(name)
   if name=='link':info.type=tarfile.SYMTYPE;info.linkname='../escape';tar.addfile(info)
   else:info.size=1;tar.addfile(info,io.BytesIO(b'x'))
 result=subprocess.run([sys.executable,'scripts/extract-release.py',str(archive),str(root/'policy-no-extraction')],capture_output=True,text=True)
 assert result.returncode!=0,names
assert not (root/'policy-no-extraction').exists()
print('5 TAR hostiles rechazados antes de extraer; sin escrituras fuera del fixture.')
