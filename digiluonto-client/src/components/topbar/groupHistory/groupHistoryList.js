import React, { useEffect, useState } from "react";
import { MenuItem } from "@material-ui/core/";
import { useLazyQuery } from "@apollo/client";

import { GROUP_HISTORY_LIST } from "../../../gql/queries/Group";

export const GroupHistoryList = () => {
  // DIG-993 käytetään määriteltyä oletusryhmä id:tä
  const [oids, setOids] = useState([process.env.REACT_APP_DEFAULT_GROUP]);

  const [loadData, { data }] = useLazyQuery(GROUP_HISTORY_LIST, {
    variables: {
      oids,
    },
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    const oids = localStorage.getItem("oids");
    const oidList = oids && oids.length ? JSON.parse(oids) : [];

    if (oidList?.length) {
      setOids(oldList => [...new Set([...oldList, ...oidList])]);
    }
    loadData();
  }, [loadData]);

  const switchGroup = id => {
    // pitää tehdä näin jotta tulee kunnon reload.
    window.location.replace(`${window.location.origin}/?oid=${id}`);
  };

  return (
    <>
      {data?.groups?.map((group, i) => (
        <MenuItem key={group.id} onClick={() => switchGroup(group.id)}>
          {group?.name}
        </MenuItem>
      ))}
    </>
  );
};
