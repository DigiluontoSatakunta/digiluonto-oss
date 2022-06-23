/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";

import Input from "@mui/material/Input";

import Typography from "@mui/material/Typography";

import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";

import { UPLOAD_FILE_MUTATION } from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

export default function FieldGalleryUpload({
  setValue,
  description,
  title,
  activePoi,
  showHelp,
  setSnackBarData,
  getValues,
  control,
}) {
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);
  const [images, setImages] = useState(null);

  useEffect(() => {
    if (activePoi?.gallery) {
      setImages(activePoi.gallery);
      setValue(
        "gallery",
        activePoi.gallery.map(item => item.id, { shouldDirty: true })
      );
    } else {
      setImages(null);
      setValue("gallery", null);
    }
  }, [activePoi, setImages, setValue]);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    if (result?.data?.upload?.id) {
      let newItemArray = images
        .filter(item => item !== null)
        .map(item => item.id);
      newItemArray.push(result.data.upload.id);
      updatePlaceGallery(newItemArray);
    }
  };

  const onDelete = item => {
    if (item && images) {
      deleteItem(item);
    }
  };

  const deleteItem = async item => {
    const deletedItemArray = images
      .filter(j => j.id !== item.id)
      .map(item => item.id);

    updatePlaceGallery(deletedItemArray);
  };

  const updatePlaceGallery = async galleryItems => {
    try {
      await updatePlace({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data: {
              gallery: galleryItems,
            },
          },
        },
        refetchQueries: ["MyPlace"],
      });
    } catch {
      setSnackBarData({
        type: "error",
        message: "Paikan galleria-sisällön päivitys epäonnistui",
      });
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      <ImageGallery
        images={images}
        setImages={setImages}
        setValue={setValue}
        getValues={getValues}
        onChange={onChange}
        onDelete={onDelete}
      />
    </>
  );
}

const ImageGallery = ({
  images,
  setImages,
  gallery,
  setValue,
  getValues,
  onChange,
  onDelete,
}) => {
  return images?.length === 0 ? (
    <BlankImage
      images={images}
      setImages={setImages}
      setValue={setValue}
      getValues={getValues}
      onChange={onChange}
      onDelete={onDelete}
    />
  ) : images?.length === 1 ? (
    <SingleImage
      image={images?.[0]}
      setValue={setValue}
      getValues={getValues}
      onChange={onChange}
      onDelete={onDelete}
    />
  ) : (
    <SplideImageGallery
      gallery={images}
      setValue={setValue}
      getValues={getValues}
      onChange={onChange}
      onDelete={onDelete}
    />
  );
};
const BlankImage = ({
  setImages,
  images,
  setValue,
  getValue,
  onChange,
  onDelete,
}) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16/9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.06)",
        }}
        htmlFor="image-input"
      >
        <NoPhotographyIcon sx={{ fontSize: "100px", color: " #dedede" }} />
      </Box>

      <IconButton
        //   disabled={!image}
        aria-label="Poista kuva"
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>

      <label style={{ float: "right" }} htmlFor="image-input">
        <Input
          inputProps={{ accept: "image/*" }}
          id="image-input"
          type="file"
          name="files"
          onChange={onChange}
          sx={{ display: "none" }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </>
  );
};

const SingleImage = ({ image, onChange, onDelete }) => {
  const resolvedImage = image?.formats?.medium ||
    image?.formats?.small || { url: image?.url, name: image?.url };
  return (
    <div data-element="image-gallery">
      <img
        style={{
          aspectRatio: "4/3", // now forcing aspect ratio. Could also be full image with lightbox. @TODO lightbox impl?
          objectFit: "cover",
          width: "100%",
          maxWidth: "100%",
          objectPosition: "center",
        }}
        src={`${GRAPHQL_API}${resolvedImage.url}`}
        alt={`${GRAPHQL_API}${resolvedImage.name}`}
      />
      <IconButton
        //   disabled={!image}
        aria-label="Poista kuva"
        onClick={() => onDelete(image)}
      >
        <DeleteIcon />
      </IconButton>
      <label style={{ float: "right" }} htmlFor="image-input">
        <Input
          inputProps={{ accept: "image/*" }}
          id="image-input"
          type="file"
          name="files"
          onChange={onChange}
          sx={{ display: "none" }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </div>
  );
};

const SplideImageGallery = ({ gallery, onChange, onDelete }) => {
  return (
    <div data-element="image-gallery">
      <Splide
        options={{
          id: "image-gallery",
          rewind: true,
          width: "100%",
          gap: 16,
          arrows: true,
          autoWidth: true,
          classes: {
            pagination: "splide__pagination splide-dots",
            page: "splide__pagination__page splide-single-dot",
          },
        }}
      >
        {gallery?.map((image, i) => (
          <SplideSlide key={i}>
            <GalleryItem
              image={image}
              onChange={onChange}
              onDelete={onDelete}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

function GalleryItem({ image, onChange, onDelete }) {
  const resolvedImage = image?.formats?.medium ||
    image?.formats?.small || { url: image?.url, name: image?.url };
  return (
    <>
      <img
        style={{
          aspectRatio: "4/3",
          objectFit: "cover",
          width: "100%",
          maxWidth: 420,
          objectPosition: "center",
        }}
        src={`${GRAPHQL_API}${resolvedImage.url}`}
        alt={`${GRAPHQL_API}${resolvedImage.name}`}
      ></img>
      <IconButton
        //   disabled={!image}
        aria-label="Poista kuva"
        onClick={() => onDelete(image)}
        style={{ position: "absolute", left: 4, bottom: 4 }}
      >
        <DeleteIcon />
      </IconButton>
      <label style={{ float: "right" }} htmlFor="image-input">
        <Input
          inputProps={{ accept: "image/*" }}
          id="image-input"
          type="file"
          name="files"
          onChange={onChange}
          sx={{ display: "none" }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          style={{ position: "absolute", right: 4, bottom: 4 }}
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </>
  );
}
