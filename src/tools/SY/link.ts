export function strIsRef(str: string) {
  if (/\(\(\d{14}-[a-zA-Z0-9]+ '[^']*'\)/.test(str)) {
    return refToBlockInfo(str);
  }
  return false;
}
export function strIsLink(str: string) {
  return /siyuan:\/\/blocks\/\d{14}-[a-zA-Z0-9]+$/.test(str);
}
export function strIsInset(str: string) {
  // {{select * from blocks where id='20241217085934-0csu4ow'}}
  return /{{select \* from blocks where id='\d{14}-[a-zA-Z0-9]'}}$/.test(str);
}

export function refToBlockInfo(ref: string) {
  ref = ref.slice(2, -3);
  const [id, title] = ref.split(" '");
  return { id, title };
}

export function blockInfoToLink({ id, title }: { id: string; title: string }) {
  return `siyuan://blocks/${id} ${title}`;
}
