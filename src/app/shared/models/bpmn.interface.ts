export interface IBpmnProcess {
  $type: string;
  flowElements?: { $type: string; name: string }[];
}
