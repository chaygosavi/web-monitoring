import WebsiteSchema from "./WebsiteSchema.js";
import axios from "axios";

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

export const createWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Url Required",
    });
  }

  const validUrl = validateUrl(url);

  if (!validUrl) {
    return res.status(422).json({
      status: false,
      message: "Invalid Url",
    });
  }

  const user = req.user;

  const response = await axios.get(url).catch((err) => void err);

  if (!response || response.status !== 200) {
    return res.status(422).json({
      status: false,
      message: "Website with url " + url + " is not active",
    });
  }

  try {
    const newWebsite = new WebsiteSchema({
      url,
      userId: user._id,
      isActive: true,
    });

    await newWebsite.save();

    return res.status(201).json({
      status: true,
      message: "Website Created",
      data: newWebsite,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating Website Document",
      error,
    });
  }
};
