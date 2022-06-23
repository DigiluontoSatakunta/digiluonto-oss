import { useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Controller, useFieldArray } from "react-hook-form";

import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import AndroidIcon from "@mui/icons-material/Android";
import VideocamIcon from "@mui/icons-material/Videocam";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
FieldLinks.propTypes = {
  control: PropTypes.any.isRequired,
  links: PropTypes.any.isRequired,
  append: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showHelp: PropTypes.bool.isRequired,
};

export default function FieldLinks({
  control,
  append,
  register,
  remove,
  links,
  title,
  description,
  showHelp,
}) {
  const [addLinkField, setAddLinkField] = useState(false);

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      {showHelp && <Typography variant="body2">{description}</Typography>}

      {links?.length === 0 && (
        <List dense={true}>
          <ListItem
            sx={{ pl: 0, pr: 7 }}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="add"
                  onClick={() => append({ type: "", url: "", name: "" })}
                  style={{ marginRight: 0 }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton edge="end" disabled={true}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <MyLinkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Et ole lisännyt ulkoisia linkkejä"
              secondary="https://www..."
            />
          </ListItem>
        </List>
      )}

      <List dense={true}>
        {links?.map((link, index) => {
          return (
            <ListItem
              key={`link-${index}`}
              sx={{ pl: 0, pr: 7 }}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={() => append({ type: "", url: "", name: "" })}
                    style={{ marginRight: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "primary.main" }}>
                  <MyLinkIcon type={link?.type} />
                </Avatar>
              </ListItemAvatar>
              <Link href={link?.url}>
                <a target="_blank">
                  <ListItemText primary={link?.name} secondary={link?.url} />
                </a>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <FormControl
        fullWidth={true}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 2,
        }}
      >
        {links?.map((link, index) => (
          <div key={link.id}>
            <Typography id="links-label">Linkki {index + 1}</Typography>
            <Controller
              name={`links.${index}.name`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name={`links.${index}.name`}
                  value={value}
                  placeholder="Nimi"
                  onChange={e => onChange(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
              )}
            />
            <Controller
              name={`links.${index}.url`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name={`links.${index}.url`}
                  placeholder="url"
                  onChange={e => onChange(e.target.value)}
                  value={value}
                  style={{ marginBottom: 16 }}
                />
              )}
            />
            <Controller
              name={`links.${index}.type`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  fullWidth
                  name={`links.${index}.type`}
                  value={value ?? ""}
                  onChange={event => onChange(event.target.value || null)}
                  style={{ marginBottom: 16 }}
                >
                  <MenuItem value={"AR"}>{"AR"}</MenuItem>
                  <MenuItem value={"AUDIO"}>{"AUDIO"}</MenuItem>
                  <MenuItem value={"IFRAME"}>{"IFRAME"}</MenuItem>
                  <MenuItem value={"LINK"}>{"LINK"}</MenuItem>
                  <MenuItem value={"VIDEO"}>{"VIDEO"}</MenuItem>
                  <MenuItem value={"GAME"}>{"GAME"}</MenuItem>
                </Select>
              )}
            />
          </div>
        ))}
      </FormControl>
    </>
  );
}

const MyLinkIcon = ({ type }) => {
  let icon = null;

  switch (type) {
    case "LINK":
      icon = <LinkIcon />;
      break;
    case "VIDEO":
      icon = <VideocamIcon />;
      break;
    case "AUDIO":
      icon = <AudiotrackIcon />;
      break;
    case "AR":
      icon = <AndroidIcon />;
      break;
    case "GAME":
      icon = <VideogameAssetIcon />;
      break;
    case "IFRAME":
      icon = <CropPortraitIcon />;
      break;
    default:
      icon = <LinkOffIcon />;
  }
  return icon;
};
