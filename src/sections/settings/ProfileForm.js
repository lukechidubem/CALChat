import React, { useCallback } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";
import { useDispatch, useSelector } from "react-redux";

import { RHFTextField } from "../../components/hook-form";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { UpdateUserProfile } from "../../redux/slices/users";

const ProfileForm = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    about: Yup.string().required("About is required"),
    photo: Yup.mixed(),
  });

  const defaultValues = {
    name: user.name,
    about: user.about,
    photo: user.photo,
  };
  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("about", data.about);
        formData.append("photo", data.photo);

        //   Send API request
        dispatch(UpdateUserProfile(formData));
        console.log("DATA", formData);
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("photo", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <RHFUploadAvatar name="photo" maxSize={3145728} onDrop={handleDrop} />

        <RHFTextField
          helperText={"This name is visible to your contacts"}
          name="name"
          label="Full Name"
        />
        <RHFTextField
          multiline
          rows={4}
          maxRows={5}
          name="about"
          label="About"
        />

        <Stack direction={"row"} justifyContent="end">
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            // loading={isSubmitSuccessful || isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
