import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

export const ImageGallery = ({ images }) => {
  return images?.length === 1 ? (
    <SingleImage image={images?.[0]} />
  ) : (
    <SplideImageGallery images={images} />
  );
};

const SingleImage = ({ image }) => {
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
        src={`${process.env.REACT_APP_STRAPI}${resolvedImage.url}`}
        alt={`${process.env.REACT_APP_STRAPI}${resolvedImage.name}`}
      />
    </div>
  );
};

const SplideImageGallery = ({ images }) => {
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
        {images.map((image, i) => (
          <SplideSlide key={i}>
            <GalleryItem image={image} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

function GalleryItem({ image }) {
  // exhaustively tries to resolve a suitable image, beginning from medium, small, the fallback is the original url
  const resolvedImage = image?.formats?.medium ||
    image?.formats?.small || { url: image?.url, name: image?.url }; // prepare convenience handle for image
  return (
    <img
      style={{
        aspectRatio: "4/3",
        objectFit: "cover",
        width: "100%",
        maxWidth: 420,
        objectPosition: "center",
      }}
      src={`${process.env.REACT_APP_STRAPI}${resolvedImage.url}`}
      alt={`${process.env.REACT_APP_STRAPI}${resolvedImage.name}`}
    />
  );
}
