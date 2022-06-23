import { gql } from "@apollo/client";

export const VESSEL_LOCATION = gql`
  query latestVesselLocation($mmsi: Int!) {
    vesselLocationsByMssiAndTimestamp(mmsi: $mmsi) {
      features {
        mmsi
        geometry {
          coordinates
        }
        properties {
          heading
          posAcc
          sog
          timestampExternal
        }
      }
    }
  }
`;
