import React from "react";
import { Grid } from "@material-ui/core/";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

import { PlaceCard } from "./PlaceCard";

export const BadgePlaceCards = ({ places, data }) => {
  return (
    <Grid container spacing={2} data-element="journey-cards">
      <Splide
        options={{
          id: "journey-cards",
          rewind: true,
          width: "100%",
          gap: 0,
          arrows: false,
          autoWidth: true,
          aspectRatio: "0.5625",
          focus: "center",
          classes: {
            pagination: "splide__pagination splide-dots",
            page: "splide__pagination__page splide-single-dot",
          },
        }}
      >
        {places?.map((place, i) => (
          <SplideSlide key={place.id}>
            <PlaceCard
              fromHome={false}
              place={place}
              data={data}
              placeCount={places?.length}
            />
          </SplideSlide>
        ))}
      </Splide>
    </Grid>
  );
};
