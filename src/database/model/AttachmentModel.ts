export interface AttachmentOpaqueModel {
  id: string;
  nome: string;
  tamanho: number;
  mime: string;
  modificado: number;
}

export interface AttachmentModel extends AttachmentOpaqueModel {
  dados: Buffer;
}
