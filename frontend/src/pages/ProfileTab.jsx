import { useEffect, useState } from "react";
import { getMyProfile } from "../api/accountApi";
import "../style/profile.css";

export default function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải hồ sơ...</p>;
  if (!profile) return <p>Không có dữ liệu</p>;

  return (
    <div className="profile-card">
      <h3>Thông tin cá nhân</h3>

      <div className="profile-row">
        <span>Họ tên</span>
        <strong>{profile.fullName}</strong>
      </div>

      <div className="profile-row">
        <span>Email</span>
        <strong>{profile.email}</strong>
      </div>

      <div className="profile-row">
        <span>Số điện thoại</span>
        <strong>{profile.phone || "—"}</strong>
      </div>

      <div className="profile-row">
        <span>Giới tính</span>
        <strong>{profile.gender || "—"}</strong>
      </div>

      <div className="profile-row">
        <span>Ngày sinh</span>
        <strong>{profile.dob || "—"}</strong>
      </div>
    </div>
  );
}
