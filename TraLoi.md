# Trả lời câu hỏi bổ sung — Buổi 9

**1. Giá trị dẫn xuất.**
`errors` và `valid` suy ra hoàn toàn từ `name`, `phone`, `address` và giỏ hàng, nên tính trực tiếp mỗi lần render thì luôn khớp với dữ liệu hiện tại. Nếu lưu bằng `useState` riêng, phải nhớ cập nhật ở mọi chỗ `setName`, `setPhone`, `setAddress`, `clear`...; quên một chỗ là lỗi hiện sai hoặc nút "Xác nhận đặt hàng" sáng/mờ sai so với dữ liệu thật.

**2. Thứ tự gọi.**
Nếu `clear()` chạy trước `await createOrder(...)` thì khi mất mạng giỏ đã bị xoá (cả trong store lẫn AsyncStorage) mà đơn chưa được tạo, người dùng mất hết sách đã chọn và không thể bấm thử lại. Đặt `clear()` ngay sau `await createOrder(...)` là đúng vì chỉ khi server đã nhận đơn (không ném lỗi) mới xoá giỏ; nếu lỗi thì code nhảy vào `catch` và giỏ được giữ nguyên.

**3. PUT hay PATCH.**
`PUT /users/1` với `{ name, phone }` sẽ thay cả object, user trong `db.json` chỉ còn `id`, `name`, `phone`, mất `email` và `password` (không đăng nhập lại được). `PATCH` chỉ đổi các trường được gửi nên các trường còn lại giữ nguyên, phù hợp với form sửa một phần như hồ sơ.

**4. Cập nhật lạc quan.**
Nếu bỏ đoạn hoàn lại `read: false` trong `catch` thì khi mất mạng giao diện vẫn báo "đã đọc" trong khi server vẫn là "chưa đọc"; mở lại màn là thông báo quay về chưa đọc, gây khó hiểu. Nên dùng cho thao tác nhẹ, ít sai, hoàn lại dễ như thả tim (yêu thích) hoặc đánh dấu đã đọc. Không nên dùng cho thanh toán/đặt hàng, vì phải chắc chắn server đã nhận đơn rồi mới báo thành công và xoá giỏ.

**5. Code bổ sung — bộ lọc trạng thái ở màn Đơn hàng.**
Thêm state `status` (`"all" | OrderStatus`) và một chỗ sửa dữ liệu truyền cho FlatList (file `src/screens/OrdersScreen.tsx`):

```tsx
const [status, setStatus] = useState<"all" | OrderStatus>("all");
const shown = orders.filter((o) => status === "all" || o.status === status);
// <FlatList data={shown} ListHeaderComponent={hàng nút lọc: Tất cả / Chờ xác nhận / Đang giao / Hoàn tất / Đã huỷ} ... />
```
