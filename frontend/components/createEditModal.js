"use client";
import { useState } from "react";
import CreateBlogForm from "./createBlogForm";

function CreateEditModal() {
  const [showForm, setShowForm] = useState(false);
  const isEdit = true;

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div>
      <CreateBlogForm
        isEdit={isEdit}
        showForm={showForm}
        handleCloseForm={handleCloseForm}
        handleOpenForm={handleOpenForm}
      />
    </div>
  );
}

export default CreateEditModal;
