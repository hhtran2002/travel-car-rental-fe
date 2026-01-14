const uploadCarImage = async (carId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  await axios.post(
    `/api/admin/car-images/${carId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

<input
  type="file"
  accept="image/*"
  onChange={(e) => uploadCarImage(1, e.target.files[0])}
/>
