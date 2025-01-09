import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import Section from "@/models/Section";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await dbConnect();

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Error parsing the files" });

      const { title } = fields;
      const file = files.file;

      // Move the file to a desired location
      const data = fs.readFileSync(file.filepath);
      const filePath = `uploads/${file.originalFilename}`;
      fs.writeFileSync(filePath, data);

      const newResource = new Resource({
        title,
        fileUrl: `/${filePath}`,
        section: req.query.sectionId,
      });

      await newResource.save();

      // Update the section with the new resource
      await Section.findByIdAndUpdate(req.query.sectionId, { $push: { resources: newResource._id } });

      return res.status(201).json({ resource: newResource });
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;