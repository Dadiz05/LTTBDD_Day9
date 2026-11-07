import { api } from "../api/client";
import { User } from "../types";

// BT9.4: PATCH /users/:id chỉ với { name, phone } (PUT sẽ làm mất các trường khác).
// json-server trả cả `password` → loại bỏ trước khi return để không đưa mật khẩu vào store.
export async function updateProfile(id: number, data: Pick<User, "name" | "phone">): Promise<User> {
  const res = await api.patch<User & { password?: string }>(`/users/${id}`, data);
  const { password: _pw, ...user } = res.data;
  return user;
}
