import React from "react";
import { Grid } from "@material-ui/core/";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

import { JourneyCard } from "./JourneyCard";

export const NearMeJourneyCards = ({ journeys }) => {
  return (
    <Grid container spacing={2} data-element="journey-cards">
      <Splide
        options={{
          id: "nearme-cards",
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
        {journeys?.map((journey, i) => (
          <SplideSlide key={journey.id}>
            <JourneyCard
              fromHome={false}
              journey={journey}
              journeyCount={journeys?.length}
            />
          </SplideSlide>
        ))}
      </Splide>
    </Grid>
  );
};
