import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUploadMedia() {
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', folder);
      
      return api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  });
}
