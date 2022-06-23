import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, Button } from "@material-ui/core/";
import { SENDEVENT } from "../../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { useSettings } from "../../../settings/SettingsContext";
import { crawlers } from "../../../../utils/crawlers";
const useStyles = makeStyles(theme => ({
  LinkContent: {
    display: "grid",
    padding: theme.spacing(1),
    gridTemplateColumns: "1fr",
  },
  Button: {
    color: theme.palette.icon.main,
  },
}));

export const LinkContent = ({ link, group, place, uid }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const settings = useSettings();
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const handleMediaEvent = type => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "mediaOpened",
              data: `type: link`,
              place: place?.id,
              group: group?.id,
              uid: uid,
            },
          },
        },
      });
    }
  };
  return (
    <div className={classes.LinkContent}>
      <Button
        variant="contained"
        href={link?.url}
        className={classes.Button}
        color="primary"
        target="_blank"
        rel="noopener"
        aria-label={t("Open Link to learn more")}
        onClick={() => handleMediaEvent()}
      >
        {link?.name || t("Open")}
      </Button>
    </div>
  );
};
