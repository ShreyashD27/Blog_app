
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddPost = () => {
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    image: Yup.mixed()
      .test("fileSize", "File size too large", (value) => {
        return value && value.size <= 2 * 1024 * 1024; // 2MB limit
      })
      .test("fileType", "Only JPG, PNG files are allowed", (value) => {
        return value && ["image/jpeg", "image/png"].includes(value.type);
      })
      .required("Image is required"),
    description: Yup.string().required("Description is required"),
  });

  return (
    <Formik
      initialValues={{ title: "", image: null, description: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("image", values.image);
        formData.append("description", values.description);

        try {
          await axios.post("http://localhost:5000/api/posts", formData);
          alert("Post added successfully!");
          resetForm();
        } catch (err) {
          setError("Failed to add post.");
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="add-post-form">
          <label>Title</label>
          <Field type="text" name="title" />
          <ErrorMessage name="title" component="div" className="error" />

          <label>Image</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
          />
          <ErrorMessage name="image" component="div" className="error" />

          <label>Description</label>
          <Field as="textarea" name="description" />
          <ErrorMessage name="description" component="div" className="error" />

          {error && <p className="error">{error}</p>}

          <button type="submit">Add Post</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddPost;
