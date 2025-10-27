import api from "@/app/lib/axiosCall";

export async function getAllPublicAttachments(): Promise<{
  data: any;
  status: number;
}> {
  return await api.get("/message-attachments/public-message-attachments");
}

export async function getAllPrivateAttachments(
  userId: string,
  receiverId: string
) {
  return await api.post("/message-attachments/private-message-attachments", {
    userId,
    receiverId,
  });
}
