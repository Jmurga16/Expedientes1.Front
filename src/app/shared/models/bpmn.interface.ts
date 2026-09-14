export interface IBpmnCollaboration {
  $type: string;
  participants?: { name: string }[];
}

export interface IBpmnProcess {
  $type: string;
  flowElements?: { $type: string; name: string }[];
}
